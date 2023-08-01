/*jshint esversion: 6 */
/*jshint node: true */
const os = require('os');
const fs = require('fs');
const path = require('path');
const mediasoup = require('mediasoup');
const siofu = require("socketio-file-upload");
const fetch = require('node-fetch');
const cron = require('node-cron');

let nextWorker = 0;
let meetings = {};
let users = {};
let transports = [];
let producers = [];
let consumers = [];
const workers = [];
const numberOfWorkers = Object.keys(os.cpus()).length;
const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
    },
    {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
            'x-google-start-bitrate': 1000,
        },
    },
];

//create workers
(async function runMediasoupWorkers() {
    for (let i = 1; i <= numberOfWorkers; i++) {
        const worker = await mediasoup.createWorker({
            rtcMinPort: process.env.RTC_MIN_PORT,
            rtcMaxPort: process.env.RTC_MAX_PORT
        });

        workers.push(worker);
    }
})();

//get worker
function getWorker() {
    const worker = workers[nextWorker];
    if (++nextWorker === workers.length) nextWorker = 0;

    return worker;
}

//get meeting if exists or create a new one
async function getOrCreateMeeting(meetingId) {
    let router;
    let users = [];
    let meeting = meetings[meetingId];
    
    if (meeting && meeting.router) {
        router = meetings[meetingId].router;
    } else {
        const worker = getWorker();
        router = await worker.createRouter({ mediaCodecs });

        meetings[meetingId] = {
            router,
            users,
            ...meetings[meetingId]
        }
    }

    return router;
}

//handle join and return router rtpCapabilities
async function handleJoin(io, socket, options) {
    let meetingId = options.meetingId;
    const router = await getOrCreateMeeting(meetingId);

    socket.join(meetingId);
    socket.meetingId = meetingId;
    socket.moderator = options.isModerator;
    socket.username = options.username;
    handleFileTransfer(socket, meetingId);

    users[socket.id] = {
        socket,
        consumers: [],
        producers: [],
        transports: []
    }

    sendToPeer(io, { type: 'usernames', toSocketId: socket.id, usernames: meetings[meetingId].users });
    
    meetings[meetingId].users.push(options.username);

    sendToMeeting(socket, {
        type: 'userJoined',
        username: options.username
    });

    return router.rtpCapabilities;
}

//check meeting length and moderator availibility
function handleCheckMeeting(socket, data, io) {
    let resultObj;
    let result = !io.sockets.adapter.rooms.get(data.meetingId) || io.sockets.adapter.rooms.get(data.meetingId).size < process.env.USER_LIMIT_PER_MEETING;

    if (result) {
        if (data.moderator) {
            meetings[data.meetingId] = {
                isModeratorPresent: true,
                moderator: socket.id
            };
            //directly allow the user if he is the moderator
            resultObj = { result: true, message: '' };
        } else if (data.authMode == "disabled" || data.moderatorRights == "disabled") {
            //directly allow the user if the moderator rights are disabled
            resultObj = { result: true, message: '' };
        } else if (meetings[data.meetingId] && meetings[data.meetingId].isModeratorPresent) {
            //notify the moderator for new request
            sendToPeer(io, { type: 'permission', toSocketId: meetings[data.meetingId].moderator, fromSocketId: socket.id, username: data.username });
            resultObj = { type: 'info', message: 'please_wait' };
        } else {
            //do not allow anyone in the meeting before moderator joins
            resultObj = { result: false, message: 'not_started' };
        }
    } else {
        //USER_LIMIT_PER_MEETING capacity is reached
        resultObj = { result: false, message: 'meeting_full' };
    }

    return resultObj;
}

//create WebRtc Transport
async function createWebRtcTransport(router) {
    return new Promise(async (resolve, reject) => {
        try {
            let transport = await router.createWebRtcTransport({
                listenIps: [
                    {
                        ip: process.env.IP,
                        announcedIp: process.env.ANNOUNCED_IP,
                    }
                ],
            });

            transport.on('dtlsstatechange', dtlsState => {
                if (dtlsState === 'closed') {
                    transport.close()
                }
            });

            transport.on('close', () => { });

            resolve(transport);
        } catch (e) {
            reject(e)
        }
    });
}

//add transport
function addTransport(transport, meetingId, consumer, socketId) {
    transports = [
        ...transports,
        { socketId, transport, meetingId, consumer }
    ];

    users[socketId] = {
        ...users[socketId],
        transports: [
            ...users[socketId].transports,
            transport.id
        ]
    };
}

//get transport
function getTransport(socketId) {
    const [producerTransport] = transports.filter(transport => transport.socketId === socketId && !transport.consumer);
    return producerTransport.transport;
}

//handleTransportProduce and inform users
async function handleTransportProduce(options, socketId, meetingId) {
    const producer = await getTransport(socketId).produce({
        kind: options.kind,
        rtpParameters: options.rtpParameters,
        appData: options.appData
    });

    addProducer(producer, meetingId, socketId);

    //inform users about the new producer
    sendToMeeting(users[socketId].socket, {
        type: 'newProducer',
        producerId: producer.id
    });

    producer.on('transportclose', () => {
        producer.close()
    });

    return producer.id;
}

//get producer list
function handleGetProducers(meetingId, socketId) {
    let producerList = [];
    producers.forEach(producerData => {
        if (producerData.socketId !== socketId && producerData.meetingId === meetingId) {
            producerList = [...producerList, producerData.producer.id]
        }
    });

    return producerList;
}

//add producer to the list
function addProducer(producer, meetingId, socketId) {
    producers = [
        ...producers,
        { socketId: socketId, producer, meetingId, }
    ]

    users[socketId] = {
        ...users[socketId],
        producers: [
            ...users[socketId].producers,
            producer.id,
        ]
    }
}

//add consumer to the list
function addConsumer(consumer, meetingId, socketId) {
    consumers = [
        ...consumers,
        { socketId: socketId, consumer, meetingId, }
    ]

    users[socketId] = {
        ...users[socketId],
        consumers: [
            ...users[socketId].consumers,
            consumer.id,
        ]
    }
}

//handle consume
async function handleConsume(options, socketId, meetingId) {
    try {
        const router = meetings[meetingId].router;

        let consumerTransport = transports.find(transportData => (
            transportData.consumer && transportData.transport.id == options.serverConsumerTransportId
        )).transport;

        if (router.canConsume({
            producerId: options.remoteProducerId,
            rtpCapabilities: options.rtpCapabilities
        })) {
            const consumer = await consumerTransport.consume({
                producerId: options.remoteProducerId,
                rtpCapabilities: options.rtpCapabilities,
                paused: true
            });

            const producerSocketId = getProducerSocketId(options, meetingId);
            let producer = producers.find(producer => (
                producer.producer.id == options.remoteProducerId
            ));

            consumer.on('transportclose', () => { });

            consumer.on('producerclose', () => {
                users[socketId].socket.emit('message', { type: 'producerClosed', remoteProducerId: options.remoteProducerId, producerSocketId, 'trackType': producer.producer.appData });

                consumerTransport.close([])
                transports = transports.filter(transportData => transportData.transport.id !== consumerTransport.id)
                consumer.close()
                consumers = consumers.filter(consumerData => consumerData.consumer.id !== consumer.id)
            });

            addConsumer(consumer, meetingId, socketId);

            return {
                id: consumer.id,
                producerId: options.remoteProducerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                serverConsumerId: consumer.id,
                producerSocketId,
                appData: producer.producer.appData
            }
        }
    } catch (e) {
        return {
            params: {
                e
            }
        };
    }
}

//get producer socket ID
function getProducerSocketId(options, meetingId) {
    return producers.find(producerData => producerData.producer.id === options.remoteProducerId && producerData.meetingId === meetingId).socketId;
}

//resume consumer
async function handleConsumerResume(serverConsumerId) {
    const { consumer } = consumers.find(consumerData => consumerData.consumer.id === serverConsumerId)
    await consumer.resume()
}

//handle transport connect
async function handleTransportRecvConnect(options) {
    const consumerTransport = transports.find(transportData => (
        transportData.consumer && transportData.transport.id == options.serverConsumerTransportId
    )).transport;

    await consumerTransport.connect({ dtlsParameters: options.dtlsParameters });
}

//remove items from array
function removeItems(items, socketId, type) {
    items.forEach(item => {
        if (item.socketId === socketId) {
            item[type].close()
        }
    })
    items = items.filter(item => item.socketId !== socketId)

    return items
}

//handle producer close
function handleProducerClose(socketId, producerId) {
    producers.forEach(producer => {
        if (producer.socketId === socketId && producer.producer.id === producerId) {
            producer.producer.close()
        }
    });

    producers = producers.filter(producer => !(producer.socketId == socketId && producer.producer.id == producerId));
    users[socketId].producers = users[socketId].producers.filter(producer => producer !== producerId);
}

//send the message to particular meeting
function sendToMeeting(socket, data) {
    socket.broadcast.to(socket.meetingId).emit('message', data);
}

//handle file transfer
function handleFileTransfer(socket, meetingId) {
    //create file_uploads folder if not exists
    let parentDir = path.join(__dirname, '../public/file_uploads/');
    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir);
    }

    var uploader = new siofu();
    uploader.dir = path.join(__dirname, '../public/file_uploads/' + meetingId);

    if (!fs.existsSync(uploader.dir)) {
        fs.mkdirSync(uploader.dir);
    }

    uploader.maxFileSize = process.env.MAX_FILESIZE * 1024 * 1024;

    uploader.listen(socket);

    uploader.on("saved", function (event) {
        event.file.clientDetail.file = event.file.base;
        event.file.clientDetail.extension = event.file.meta.extension;
        event.file.clientDetail.username = event.file.meta.username;

        sendToMeeting(socket, { type: 'file', file: event.file.base, extension: event.file.meta.extension, username: event.file.meta.username });
    });

    //keep this line to prevent crash
    uploader.on("error", function (event) { });
}

//notify the moderator for new request
function handleRecordingPermission(socket, data, io) {
    sendToPeer(io, { type: 'recordingPermission', toSocketId: meetings[data.meetingId].moderator, fromSocketId: socket.id, username: data.username });
}

//send the message to particular user
function sendToPeer(io, data) {
    io.to(data.toSocketId).emit('message', data);
}

//check details
function checkDetails() {
    fetch(process.env.DOMAIN + '/check-details')
    .then(res => res.text())
    .then(result => {
        console.log(result)
        if(!result) process.exit(1);
    });
}

module.exports = function (io) {
    checkDetails();

    cron.schedule('0 0 * * 0', () => {
        checkDetails();
    });

    //handle connection event
    io.sockets.on('connection', (socket) => {
        socket.on('message', async (options, callback) => {
            switch (options.type) {
                case 'join':
                    const rtpCapabilities = await handleJoin(io, socket, options)
                    callback({ rtpCapabilities });
                    break;
                case 'createWebRtcTransport':
                    createWebRtcTransport(meetings[socket.meetingId].router).then(transport => {
                        callback({
                            params: {
                                id: transport.id,
                                iceParameters: transport.iceParameters,
                                iceCandidates: transport.iceCandidates,
                                dtlsParameters: transport.dtlsParameters,
                                producersExist: !!producers.length
                            }
                        });

                        addTransport(transport, socket.meetingId, options.consumer, socket.id);
                    });
                    break;
                case 'transportConnect':
                    getTransport(socket.id).connect({ dtlsParameters: options.dtlsParameters });
                    break;
                case 'transportProduce':
                    const producerId = await handleTransportProduce(options, socket.id, socket.meetingId)

                    //Send back to the client the producer's id
                    callback({
                        id: producerId
                    })
                    break;
                case 'getProducers':
                    //return the producer list back to the client
                    callback(handleGetProducers(socket.meetingId, socket.id));
                    break;
                case 'transportRecvConnect':
                    handleTransportRecvConnect(options);
                    break;
                case 'consume':
                    const params = await handleConsume(options, socket.id, socket.meetingId);
                    callback({ params });
                    break;
                case 'consumerResume':
                    handleConsumerResume(options.serverConsumerId);
                    break;
                case 'producerClose':
                    handleProducerClose(socket.id, options.id);
                    break;
                case 'meetingMessage':
                case 'raiseHand':
                case 'clearWhiteboard':
                case 'whiteboard':
                case 'sync':
                case 'recordingStarted':
                    sendToMeeting(socket, options);
                    break;
                case 'recordingPermission':
                    handleRecordingPermission(socket, options, io);
                    break;
                case 'recordongPermissionResult':
                case 'permissionResult':
                case 'recordongPermissionResult':
                case 'kick':
                    sendToPeer(io, options);
                    break;
                case 'checkMeeting':
                    callback(handleCheckMeeting(socket, options, io));
                    break;
            }
        });

        socket.on('disconnect', () => {
            const meetingId = socket.meetingId
            delete users[socket.id]

            //remove file_uploads folder by meetingId
            let dirName = path.join(__dirname, '../public/file_uploads/' + meetingId);
            if (!io.sockets.adapter.rooms.get(meetingId) && fs.existsSync(dirName)) {
                fs.rmdirSync(dirName, { recursive: true });
            }

            if (meetings[meetingId]) {
                const index = meetings[meetingId].users.indexOf(socket.username);
                if (index > -1) meetings[meetingId].users.splice(index, 1);
            }

            socket.leave(meetingId);
            sendToMeeting(socket, {
                type: 'leave',
                socketId: socket.id,
                isModerator: socket.moderator,
                username: socket.username,
            })

            consumers = removeItems(consumers, socket.id, 'consumer')
            producers = removeItems(producers, socket.id, 'producer')
            transports = removeItems(transports, socket.id, 'transport')

            if (socket.moderator) delete meetings[meetingId];
        });
    });
}