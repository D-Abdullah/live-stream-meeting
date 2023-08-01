(function () {
    'use strict';

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isOnIOS =
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPhone/i);
    const eventName = isOnIOS ? "pagehide" : "beforeunload";

    const audioInputSelect = document.querySelector('select#audioSource');
    const videoInputSelect = document.querySelector('select#videoSource');
    const selectors = [audioInputSelect, videoInputSelect];

    let mixer;
    let socket;
    let device;
    let settings;
    let recorder;
    let uploader;
    let resizeTimeout;
    let mouseMoveTimer;
    let displayFileUrl;
    let localAudioStream;
    let localVideoStream;
    let producerTransport;
    let currentMeetingTime;
    let routerRtpCapabilities;
    let usersCount = 1;
    let messageCount = 0;
    let audioMuted = true;
    let videoMuted = true;
    let isRecording = false;
    let screenShared = false;
    let whiteboardAdded = false;
    let whiteboardVisible = false;

    let recordingData = [];
    let consumerTransports = [];
    let consumingTransports = [];

    let timer = new easytimer.Timer();
    let notificationTone = new Audio('/sounds/notification.mp3');
    let layoutContainer = document.getElementById('videos');
    let layout = initLayoutContainer(layoutContainer).layout;
    let designer = new CanvasDesigner();
    designer.widgetHtmlURL = '/widget';
    designer.widgetJsURL = 'js/widget.min.js';

    let videoOptions = {
        encodings: [{
            rid: 'r0',
            maxBitrate: 100000,
            scalabilityMode: 'S1T3',
        },
        {
            rid: 'r1',
            maxBitrate: 300000,
            scalabilityMode: 'S1T3',
        },
        {
            rid: 'r2',
            maxBitrate: 900000,
            scalabilityMode: 'S1T3',
        },
        ],
        codecOptions: {
            videoGoogleStartBitrate: 1000
        }
    };

    let audioParams = { appData: { type: 'mic', username: '' } };
    let videoParams = { videoOptions, appData: { type: 'webcam', username: '' } };
    let screenAudioParams = { appData: { type: 'screenAudio', username: '' } };
    let screenVideoParams = { videoOptions, appData: { type: 'screenVideo', username: '' } };

    //get session details
    (function () {
        $.post({
            url: "/get-details",
        })
            .done(function (data) {
                data = JSON.parse(data);

                if (data.success) {
                    settings = data.data;

                    initializeSocket(settings.signalingURL);
                } else {
                    showError(languages.no_session);
                }
            })
            .catch(function () {
                showError(languages.no_session);
            });
    })();

    //initialize socket and listen for events
    function initializeSocket(signalingURL) {
        socket = io.connect(signalingURL);
        uploader = new SocketIOFileUpload(socket);

        //show the error message and disable the join button
        socket.on("connect_error", function () {
            $('#joinMeeting').attr('disabled', true);
            $("#error").show();
        });

        //hide the error message and enable the join button
        socket.on("connect", function () {
            $('#joinMeeting').attr('disabled', false);
            $("#error").hide();
        });

        socket.on('message', (data) => {
            switch (data.type) {
                case 'newProducer':
                    signalNewConsumerTransport(data.producerId);
                    break;
                case 'producerClosed':
                    handleProducerClosed(data.remoteProducerId, data.producerSocketId, data.trackType);
                    break;
                case 'leave':
                    handleLeave(data.socketId, data.isModerator, data.username);
                    break;
                case 'meetingMessage':
                    handlemeetingMessage(data);
                    break;
                case 'file':
                    handleFileMessage(data);
                    break;
                case 'raiseHand':
                    showInfo(languages.hand_raised + data.username);
                    break;
                case 'whiteboard':
                    handleWhiteboard(data.data);
                    break;
                case 'clearWhiteboard':
                    designer.clearCanvas();
                    designer.sync();
                    break;
                case 'sync':
                    designer.sync();
                    break;
                case 'recordingPermission':
                    handleRecordingPermission(data);
                    break;
                case 'recordongPermissionResult':
                    handleRecordingPermissionResult(data);
                    break;
                case 'permissionResult':
                    checkMeetingResult(data);
                    break;
                case 'permission':
                    handlePermission(data);
                    break;
                case 'kick':
                    showInfo(languages.kicked);
                    reload(0);
                    break;
                case 'recordingStarted':
                    notificationTone.play();
                    showInfo(languages.recording_started + ": " + data.username);
                    break;
                case 'userJoined':
                    $("#participantListBody").append("<tr class='list-" + data.username + "'><th scope='row'></th><td>" + data.username + "</td></tr>");
                    $('#showParticipantList').addClass('number').attr('data-content', ++usersCount);
                    break;
                case 'usernames':
                    data.usernames.forEach((username) => {
                        $("#participantListBody").append("<tr class='list-" + username + "'><th scope='row'></th><td>" + username + "</td></tr>");
                        $('#showParticipantList').addClass('number').attr('data-content', ++usersCount);
                    });
                    break;
            }
        });

        //listen on sendFile button click event
        uploader.listenOnSubmit($('#sendFile')[0], $('#file')[0]);

        //start file upload
        uploader.addEventListener('start', function (event) {
            event.file.meta.extension = event.file.name.substring(event.file.name.lastIndexOf('.'));
            event.file.meta.username = userInfo.username;
            showInfo(languages.uploading);
        });

        //append file when file upload is completed
        uploader.addEventListener('complete', function (event) {
            appendFile(event.detail.file, event.detail.extension, null, true);
        });

        //handle file upload error
        uploader.addEventListener('error', function (event) {
            showError(event.message);
        });

        //get item from localStorage and set to html
        videoQualitySelect.value = localStorage.getItem('videoQuality') || 'VGA';
        if (!userInfo.username) userInfo.username = username.value = localStorage.getItem('username') || htmlEscape(settings.defaultUsername);

        setMediaPreview(true, true);
    }

    //get media stream and set video preview, show the error if any
    async function setMediaPreview(audio, video) {
        try {
            if (audio) localAudioStream = await getUserMedia(true, false);
            if (video) localVideoStream = await getUserMedia(false, true);
        } catch (e) {
            //show an error if the media device is not available
            $(".text-show").text(languages.no_device + e);
            $("#toggleAudioPreview, #toggleVideoPreview").removeClass('disabled');
        }

        if (audio && localAudioStream) {
            audioMuted = false;
            $("#toggleAudioPreview, #toggleMic").html('<i class="fa fa-microphone"></i>').removeClass('disabled');
        }

        if (video && localVideoStream) {
            videoMuted = false;
            previewVideo.srcObject = new MediaStream([localVideoStream.getTracks()[0]]);
            previewVideo.style.zIndex = 5;
            $("#toggleVideoPreview, #toggleVideo").html('<i class="fa fa-video"></i>').removeClass('disabled');
        }

        if (localAudioStream && localVideoStream) {
            $(".text-show").text();
        }
    }

    //toggle audio preview
    $("#toggleAudioPreview").on('click', function () {
        if (!audioMuted) {
            localAudioStream.getTracks().forEach((track) => track.stop());
            localAudioStream.removeTrack(localAudioStream.getTracks()[0]);
            localAudioStream = null;
            $("#toggleAudioPreview, #toggleMic").html('<i class="fa fa-microphone-slash"></i>');
            audioMuted = true;
        } else {
            $("#toggleAudioPreview").addClass('disabled');
            setMediaPreview(true, false);
        }
    });

    //toggle video preview
    $("#toggleVideoPreview").on('click', function () {
        if (!videoMuted) {
            localVideoStream.getTracks().forEach((track) => track.stop());
            localVideoStream.removeTrack(localVideoStream.getTracks()[0]);
            previewVideo.srcObject = localVideoStream = null;
            previewVideo.style.zIndex = 0;
            $("#toggleVideoPreview, #toggleVideo").html('<i class="fa fa-video-slash"></i>');
            videoMuted = true;
        } else {
            $("#toggleVideoPreview").addClass('disabled');
            setMediaPreview(false, true);
        }
    });

    //check meeting password if present
    $("#passwordCheck").on('submit', function (e) {
        e.preventDefault();
        $('#joinMeeting').attr('disabled', true);

        //show an error if the signaling server is not connected
        if (!socket.connected) {
            showError(languages.cant_connect);
            $('#joinMeeting').attr('disabled', false);
            return;
        }

        if (passwordRequired) {
            $.ajax({
                url: '/check-meeting-password',
                data: $(this).serialize(),
                type: 'post',
            })
                .done(function (data) {
                    data = JSON.parse(data);
                    $('#joinMeeting').attr('disabled', false);

                    if (data.success) {
                        continueToMeeting();
                    } else {
                        showError(languages.invalid_password);
                    }
                })
                .catch(function () {
                    showError();
                    $('#joinMeeting').attr('disabled', false);
                });
        } else {
            continueToMeeting();
        }
    });

    //send a message to the server to check meeting
    async function continueToMeeting() {
        //set username
        userInfo.username = username.value || htmlEscape(settings.defaultUsername);
        audioParams.appData.username = videoParams.appData.username = screenAudioParams.appData.username = screenVideoParams.appData.username = userInfo.username;
        localStorage.setItem('username', userInfo.username);

        //check if the meeting is full or not
        socket.emit('message', {
            type: 'checkMeeting',
            username: userInfo.username,
            meetingId: userInfo.meetingId,
            moderator: isModerator,
            authMode: settings.authMode,
            moderatorRights: settings.moderatorRights,
        }, (result) => {
            checkMeetingResult(result);
        });
    }

    //check meeting request
    async function checkMeetingResult(data) {
        if (data.type == "info") {
            showInfo(languages[data.message]);
            return;
        }

        if (data.result) {
            //initiate the meeting
            init();
        } else {
            //there is an error, show it to the user
            showInfo(languages[data.message]);
            $('#joinMeeting').attr('disabled', false);
        }
    }

    //initiate the meeting
    function init() {
        $('.meeting-details, .navbar, footer').hide();
        $('.meeting-section').show();
        if (!audioMuted) localAudio.srcObject = new MediaStream([localAudioStream.getTracks()[0]]);
        if (!videoMuted) localVideo.srcObject = new MediaStream([localVideoStream.getTracks()[0]])
        previewVideo.srcObject = null;

        $('.user-initial').text(userInfo.username[0]).css('background', getRandomColor());

        if (!audioMuted) audioParams = { track: localAudioStream.getTracks()[0], ...audioParams };
        if (!videoMuted) videoParams = { track: localVideoStream.getTracks()[0], ...videoParams };

        socket.emit('message', {
            type: 'join',
            isModerator,
            meetingId: userInfo.meetingId,
            username: userInfo.username
        }, (data) => {
            routerRtpCapabilities = data.rtpCapabilities;
            createDevice();
        });

        manageOptions();
        initKeyShortcuts();
        layout();
        if (!isMobile) $('#screenShare').show();

        //start with a time limit for limited time meeting
        timer.start({ precision: 'seconds', startValues: { seconds: 0 }, target: { seconds: timeLimit * 60 - 60 } });

        $('#showParticipantList').addClass('number').attr('data-content', usersCount);
    }

    //hide/show certain meeting related details
    function manageOptions() {
        $('.meeting-options').show();
        $('#meetingIdInfo').html(meetingTitle);
        localStorage.setItem('videoQuality', videoQualitySelect.value);

        setTimeout(function () {
            hideOptions();
            $('.local-user-name, .remote-user-name, .kick').hide();
        }, 3000);

        $('body').on('mousemove', function () {
            showOptions();
        });
    }

    //hide meeting ID and options
    function hideOptions() {
        $('.meeting-options, .meeting-info').hide();
    }

    //show meeting ID and options
    function showOptions() {
        $('.meeting-options, .meeting-info').show();

        if (mouseMoveTimer) {
            clearTimeout(mouseMoveTimer);
        }

        mouseMoveTimer = setTimeout(function () {
            hideOptions();
        }, 3000);
    }

    //handle mouseover event on video container
    $(document).on('mouseover', '.videoContainer', function () {
        $(this).find('span, button').show();
    });

    //handle mouseout event on video container
    $(document).on('mouseout', '.videoContainer', function () {
        $(this).find('span, button').hide();
    });

    //notify the moderator for new join request
    function handlePermission(data) {
        notificationTone.play();
        toastr.info(
            '<br><button type="button" class="btn btn-primary btn-sm clear approve" data-from="' +
            data.fromSocketId +
            '">' + languages.approve + '</button><button type="button" class="btn btn-warning btn-sm clear ml-2 decline" data-from="' +
            data.fromSocketId +
            '">' + languages.decline + '</button>',
            languages.request_join_meeting + data.username, {
            tapToDismiss: false,
            timeOut: 0,
            extendedTimeOut: 0,
            newestOnTop: false,
        }
        );
    }

    //notify participant about the request approval
    $(document).on('click', '.approve', function () {
        $(this).closest('.toast').remove();
        sendMessage({
            type: 'permissionResult',
            result: true,
            toSocketId: $(this).data('from'),
        });
    });

    //notify participant about the request rejection
    $(document).on('click', '.decline', function () {
        $(this).closest('.toast').remove();
        sendMessage({
            type: 'permissionResult',
            result: false,
            toSocketId: $(this).data('from'),
            message: 'request_declined',
        });
    });

    //notify the moderator for new recording request
    function handleRecordingPermission(data) {
        notificationTone.play();
        toastr.info(
            '<br><button type="button" class="btn btn-primary btn-sm clear approveRecording" data-from="' +
            data.fromSocketId +
            '">' + languages.approve + '</button><button type="button" class="btn btn-warning btn-sm clear ml-2 declineRecording" data-from="' +
            data.fromSocketId +
            '">' + languages.decline + '</button>',
            languages.request_record_meeting + data.username, {
            tapToDismiss: false,
            timeOut: 0,
            extendedTimeOut: 0,
            newestOnTop: false,
        }
        );
    }

    //notify participant about the recording request approval
    $(document).on('click', '.approveRecording', function () {
        $(this).closest('.toast').remove();

        sendMessage({
            type: 'recordongPermissionResult',
            result: true,
            toSocketId: $(this).data('from'),
        });
    });

    //notify participant about the recording request rejection
    $(document).on('click', '.declineRecording', function () {
        $(this).closest('.toast').remove();

        sendMessage({
            type: 'recordongPermissionResult',
            result: false,
            toSocketId: $(this).data('from'),
            message: languages.request_declined,
        });
    });

    //start the recording or notify the user about the rejection
    function handleRecordingPermissionResult(data) {
        $("#recording").attr('disabled', false);

        if (data.result) {
            startRecording();
        } else {
            showInfo(languages.record_request_declined);
        }
    }

    //listen for timer update event and display during the meeting
    timer.addEventListener('secondsUpdated', function () {
        currentMeetingTime = timer.getTimeValues().minutes * 60 + timer.getTimeValues().seconds;
        $('#timer').html(getCurrentTime());
    });

    //start the timer for last one minute and end the meeting after that
    timer.addEventListener('targetAchieved', function () {
        $('#timer').css('color', 'red');
        timer.stop();
        timer.start({
            precision: 'seconds',
            startValues: {
                seconds: currentMeetingTime,
            },
        });
        setTimeout(function () {
            showInfo(languages.meeting_ended);
            reload(1);
        }, 60 * 1000);
    });

    //handle file message
    function handleFileMessage(data) {
        if ($(".chat-panel").is(":hidden")) {
            $("#openChat").addClass("notify").attr('data-content', ++messageCount);
            showOptions();
            notificationTone.play();
        }
        appendFile(data.file, data.extension, data.username, false);
    }

    //append file to the chat panel
    function appendFile(file, extension, username, self) {
        if ($('.empty-chat-body')) {
            $('.empty-chat-body').remove();
        }

        let remoteUsername = username ? '<span>' + username + ': </span>' : '';

        let className = self ? "local-chat" : "remote-chat",
            fileDiv = "<div class='" + className + "'>" + "<button class='btn btn-primary fileMessage' title='" + languages.view_file + "' data-file='" + file + "' data-extension='" + extension + "'>" + remoteUsername + "<i class='fa fa-file'></i> " + file + extension + "</button>";

        $('.chat-body').append(fileDiv);
        $('.chat-body').animate({
            scrollTop: $('.chat-body').prop('scrollHeight'),
        },
            1000
        );
    }

    //get current meeting time in readable format
    function getCurrentTime() {
        return timer.getTimeValues().toString(['hours', 'minutes', 'seconds']);
    }

    //handle message and append it
    function handlemeetingMessage(data) {
        if ($('.chat-panel').is(':hidden')) {
            $('#openChat').addClass('notify').attr('data-content', ++messageCount);
            showOptions();
            notificationTone.play();
        }
        appendMessage(data.message, data.username, false);
    }

    //toggle chat panel
    $(document).on('click', '#openChat', function () {
        $('.chat-panel').animate({
            width: 'toggle',
        });

        if ($(this).hasClass('notify')) {
            $(this).removeClass('notify');
            messageCount = 0;
        }
    });

    //close chat panel
    $(document).on('click', '.close-panel', function () {
        $('.chat-panel').animate({
            width: 'toggle',
        });
    });

    //copy/share the meeting invitation
    $(document).on('click', '#add', function () {
        let link = location.protocol + '//' + location.host + location.pathname;

        if (navigator.share) {
            try {
                navigator.share({
                    title: htmlEscape(settings.appName),
                    url: link,
                    text: languages.inviteMessage,
                });
            } catch (e) {
                showError(e);
            }
        } else {
            let inp = document.createElement('textarea');
            inp.style.display = 'hidden';
            document.body.appendChild(inp);
            inp.value = languages.inviteMessage + link;
            inp.select();
            document.execCommand('copy', false);
            inp.remove();
            showSuccess(languages.link_copied);
        }
    });

    //listen for message form submit event and send message
    $(document).on('submit', '#chatForm', function (e) {
        e.preventDefault();

        if (!featureAvailable('text_chat')) return;

        let message = htmlEscape($('#messageInput').val().trim());

        if (message) {
            $('#messageInput').val('');
            appendMessage(message, null, true);

            sendMessage({
                type: 'meetingMessage',
                message: message,
                username: userInfo.username,
            });
        }
    });

    //append message to chat body
    function appendMessage(message, username, self) {
        if ($('.empty-chat-body')) {
            $('.empty-chat-body').remove();
        }

        let className = self ? 'local-chat' : 'remote-chat',
            messageDiv = '<div class="' + className + '">' + '<div>' + (username ? '<span class="remote-chat-name">' + username + ': </span>' : '') + linkify(message) + '</div>' + '</div>';

        $('.chat-body').append(messageDiv);
        $('.chat-body').animate({
            scrollTop: $('.chat-body').prop('scrollHeight'),
        },
            1000
        );
    }

    //listen on file input change
    $('#file').on('change', function () {
        let inputFile = this.files;
        let maxFilesize = $(this).data('max');

        if (inputFile && inputFile[0]) {
            if (inputFile[0].size > maxFilesize * 1024 * 1024) {
                showError(languages.max_file_size + maxFilesize);
                return;
            }

            $('#previewImage').attr('src', 'images/loader.gif');
            $('#previewFilename').text(inputFile[0].name);
            $('#previewModal').modal('show');

            if (inputFile[0].type.includes('image')) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    $('#previewImage').attr('src', e.target.result);
                };
                reader.readAsDataURL(inputFile[0]);
            } else {
                $('#previewImage').attr('src', '/images/file.png');
            }
        } else {
            showError();
        }
    });

    //empty file value on modal close
    $('#previewModal').on('hidden.bs.modal', function () {
        $('#file').val('');
    });

    //hide modal on file send button click
    $(document).on('click', '#sendFile', function () {
        $('#previewModal').modal('hide');
    });

    //dispay file on button click
    $(document).on('click', '.fileMessage', function () {
        let filename = $(this).data('file');
        let extension = $(this).data('extension');

        $('#displayImage').attr('src', '/images/loader.gif');
        $('#displayFilename').text(filename + extension);
        $('#displayModal').modal('show');

        fetch('/file_uploads/' + userInfo.meetingId + '/' + filename + extension)
            .then((res) => res.blob())
            .then((blob) => {
                displayFileUrl = window.URL.createObjectURL(blob);
                if (['.png', '.jpg', '.jpeg', '.gif'].includes(extension)) {
                    $('#displayImage').attr('src', displayFileUrl);
                } else {
                    $('#displayImage').attr('src', '/images/file.png');
                }
            })
            .catch(() => showError());
    });

    //download file on button click
    $(document).on('click', '#downloadFile', function () {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = displayFileUrl;
        link.download = $('#displayFilename').text();
        document.body.appendChild(link);
        link.click();
        $('#displayModal').modal('hide');
        window.URL.revokeObjectURL(displayFileUrl);
    });

    //open file exploler
    $(document).on('click', '#selectFile', function () {
        if (!featureAvailable('file_share')) return;

        $('#file').trigger('click');
    });

    //notify participants about hand raise
    $(document).on('click', '#raiseHand', function () {
        if (!featureAvailable('hand_raise')) return;

        showInfo(languages.hand_raised_self);

        sendMessage({
            type: 'raiseHand',
            username: userInfo.username,
        });
    });

    //mute/unmute local video
    $(document).on('click', '#toggleMic', async function () {
        $(this).attr('disabled', true);

        if (audioMuted) {
            let stream = await getUserMedia(true, false);
            audioParams.track = stream.getTracks()[0];
            producerTransport.produce(audioParams);
            localAudio.srcObject = new MediaStream([audioParams.track]);

            $(this).html('<i class="fa fa-microphone"></i>');
            audioMuted = false;
            showSuccess(languages.mic_unmute);

            if (isRecording) mixer.appendStreams(new MediaStream([audioParams.track]));
        } else {
            audioParams.track.stop();
            sendMessage({ type: 'producerClose', id: audioParams.id });
            localAudio.srcObject = null;

            $(this).html('<i class="fa fa-microphone-slash"></i>');
            audioMuted = true;
            showSuccess(languages.mic_mute);
            if (isRecording) mixer.resetVideoStreams(getMediaStreams());
        }

        $(this).attr('disabled', false);
    });

    //mute/unmute local video
    $(document).on('click', '#toggleVideo', async function () {
        $(this).attr('disabled', true);

        if (videoMuted) {
            let stream = await getUserMedia(false, true);
            videoParams.track = stream.getTracks()[0];
            producerTransport.produce(videoParams);
            localVideo.srcObject = new MediaStream([videoParams.track]);

            $(this).html('<i class="fa fa-video"></i>');
            videoMuted = false;
            showSuccess(languages.camera_on);
            if (isRecording) mixer.appendStreams(new MediaStream([videoParams.track]));
        } else {
            videoParams.track.stop();
            sendMessage({ type: 'producerClose', id: videoParams.id });
            localVideo.srcObject = null;

            $(this).html('<i class="fa fa-video-slash"></i>');
            videoMuted = true;
            showSuccess(languages.camera_off);
            if (isRecording) mixer.resetVideoStreams(getMediaStreams());
        }

        $(this).attr('disabled', false);
    });

    //toggle screen share
    $(document).on('click', '#screenShare', function () {
        if (!featureAvailable('screen_share')) return;

        if (screenShared) {
            stopScreenSharing();
        } else {
            startScreenSharing();
        }
    });

    //start screen sharing
    function startScreenSharing() {
        navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: true
        }).then(stream => {
            let audioTrack = stream.getAudioTracks()[0];
            let videoTrack = stream.getVideoTracks()[0];

            if (audioTrack) {
                screenAudioParams.track = audioTrack;
                producerTransport.produce(screenAudioParams);
                localScreenAudio.srcObject = new MediaStream([audioTrack]);
                if (isRecording) mixer.appendStreams(new MediaStream([audioTrack]));
            }

            screenVideoParams.track = videoTrack;
            producerTransport.produce(screenVideoParams);
            localScreenVideo.srcObject = new MediaStream([videoTrack]);
            videoTrack.addEventListener('ended', () => {
                stopScreenSharing();
            });

            screenShared = true;
            screenContainer.style.display = "block";
            layout();

            if (isRecording) mixer.appendStreams(new MediaStream([videoTrack]));
        }).catch(e => {
            showError(languages.cant_share_screen + ' ' + e);
        });
    }

    //stop screen sharing
    function stopScreenSharing() {
        if (screenAudioParams.track) {
            localScreenAudio.srcObject = null;
            screenAudioParams.track.stop();
            sendMessage({ type: 'producerClose', id: screenAudioParams.id });
        }
        localScreenVideo.srcObject = null;
        screenVideoParams.track.stop();
        sendMessage({ type: 'producerClose', id: screenVideoParams.id });
        screenShared = false;
        screenContainer.style.display = "none";
        layout();
        if (isRecording) mixer.resetVideoStreams(getMediaStreams());
    }

    //get user media and return stream
    async function getUserMedia(audio, video) {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({
                audio: audio ? getAudioConstraints() : false,
                video: video ? getVideoConstraints() : false
            });
            return stream;
        } catch (e) {
            if (e.name === "OverconstrainedError") $("#videoQualitySelect").val('VGA').trigger('change');
            showError(languages.no_device + e.name);
            throw new Error('Could not get user media');
        }
    }

    //create mediasoup device and load it
    async function createDevice() {
        try {
            device = new mediasoupClient.Device();
            await device.load({ routerRtpCapabilities });
            createSendTransport();
        } catch (e) {
            showError();
        }
    }

    //create and send transport
    function createSendTransport() {
        socket.emit('message', {
            type: 'createWebRtcTransport',
            consumer: false
        }, ({ params }) => {
            if (params.error) return;

            producerTransport = device.createSendTransport(params);

            producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await socket.emit('message', {
                        type: 'transportConnect',
                        dtlsParameters
                    });

                    callback();
                } catch (e) {
                    errback(e)
                }
            });

            producerTransport.on('produce', async (parameters, callback, errback) => {
                try {
                    await socket.emit('message', {
                        type: 'transportProduce',
                        kind: parameters.kind,
                        rtpParameters: parameters.rtpParameters,
                        appData: parameters.appData
                    }, ({ id }) => {
                        callback({ id });

                        if (parameters.appData.type === 'mic') {
                            audioParams.id = id;
                        } else if (parameters.appData.type === 'webcam') {
                            videoParams.id = id;
                        } else if (parameters.appData.type === 'screenAudio') {
                            screenAudioParams.id = id;
                        } else {
                            screenVideoParams.id = id;
                        }
                    });

                } catch (e) {
                    errback(e)
                }
            });

            if (!audioMuted) producerTransport.produce(audioParams);
            if (!videoMuted) producerTransport.produce(videoParams);
            //get producers if producersExist
            if (params.producersExist) getProducers();
        });
    }

    //get producers and signal new consumer transport
    function getProducers() {
        socket.emit('message', {
            type: 'getProducers'
        }, producerIds => {
            producerIds.forEach(signalNewConsumerTransport);
        });
    }

    //signal new consumer transport
    async function signalNewConsumerTransport(remoteProducerId) {
        //check if we are already consuming the remoteProducerId
        if (consumingTransports.includes(remoteProducerId)) return;
        consumingTransports.push(remoteProducerId);

        socket.emit('message', {
            type: 'createWebRtcTransport',
            consumer: true,
        }, ({ params }) => {
            if (params.error) return;

            let consumerTransport;
            try {
                consumerTransport = device.createRecvTransport(params);
            } catch (e) {
                return;
            }

            consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
                try {
                    await socket.emit('message', {
                        type: 'transportRecvConnect',
                        dtlsParameters,
                        serverConsumerTransportId: params.id
                    });

                    callback();
                } catch (e) {
                    errback(e);
                }
            });

            connectRecvTransport(consumerTransport, remoteProducerId, params.id)
        });
    }

    //connect receive transport
    async function connectRecvTransport(consumerTransport, remoteProducerId, serverConsumerTransportId) {
        await socket.emit('message', {
            type: 'consume',
            remoteProducerId,
            serverConsumerTransportId,
            rtpCapabilities: device.rtpCapabilities
        }, async ({ params }) => {
            if (params.error) return;

            const consumer = await consumerTransport.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters
            });

            consumerTransports = [
                ...consumerTransports,
                {
                    consumerTransport,
                    serverConsumerTransportId: params.id,
                    producerId: remoteProducerId,
                    consumer
                }
            ]

            let remoteElement;
            let stream = new MediaStream([consumer.track]);

            if (params.kind == 'audio') {
                remoteElement = document.createElement('audio');
                remoteElement.id = remoteProducerId;
                remoteElement.setAttribute('autoplay', '');
                remoteElement.srcObject = stream;
            } else {
                remoteElement = document.createElement('video');
                remoteElement.id = remoteProducerId;
                remoteElement.setAttribute('autoplay', '');
                remoteElement.setAttribute('playsinline', '');
                remoteElement.srcObject = stream;
            }

            if (isRecording) mixer.appendStreams(stream);

            sendMessage({
                type: 'consumerResume',
                serverConsumerId: params.serverConsumerId
            });

            if (params.appData.type == 'screenVideo' || params.appData.type == 'screenAudio') {
                let screenDiv;
                let screenSelector = document.getElementById('screen-' + params.producerSocketId);
                if (screenSelector) {
                    screenDiv = screenSelector;
                    screenDiv.appendChild(remoteElement);
                } else {
                    screenDiv = document.createElement('div');
                    screenDiv.id = 'screen-' + params.producerSocketId;
                    screenDiv.className = 'videoContainer';
                    screenDiv.appendChild(remoteElement);
                    videos.appendChild(screenDiv);

                    let screenText = document.createElement('span');
                    screenText.className = 'remote-user-name';
                    screenText.innerText = languages.screen + params.appData.username;
                    screenDiv.appendChild(screenText);

                    layout();
                }
            }

            if (params.appData.type == 'webcam' || params.appData.type == 'mic') {
                let containerDiv;
                let containerSelector = document.getElementById('container-' + params.producerSocketId);

                if (containerSelector) {
                    containerDiv = containerSelector;
                    containerDiv.appendChild(remoteElement);
                } else {
                    containerDiv = document.createElement('div');
                    containerDiv.id = 'container-' + params.producerSocketId;
                    containerDiv.className = 'videoContainer';
                    containerDiv.appendChild(remoteElement);
                    videos.appendChild(containerDiv);

                    let containerText = document.createElement('span');
                    containerText.className = 'remote-user-name';
                    containerText.innerText = params.appData.username;
                    containerDiv.appendChild(containerText);

                    let containerInitial = document.createElement('p');
                    containerInitial.className = 'user-initial';
                    containerInitial.innerText = params.appData.username[0];
                    containerInitial.style.background = getRandomColor();
                    containerDiv.appendChild(containerInitial);

                    if (isModerator && settings.moderatorRights == "enabled") {
                        let kickButton = document.createElement('button');
                        kickButton.className = 'btn meeting-option kick';
                        kickButton.innerHTML = '<i class="fa fa-ban"></i>';
                        kickButton.setAttribute('data-id', params.producerSocketId);
                        kickButton.setAttribute('title', languages.kick_user);

                        containerDiv.appendChild(kickButton);
                    }

                    layout();
                }
            }

        })
    }

    //kick the participant out of the meeting
    $(document).on('click', '.kick', function () {
        if (confirm(languages.confirmation_kick)) {
            $(this).attr('disabled', true);
            sendMessage({
                type: 'kick',
                toSocketId: $(this).data('id'),
            });
        }
    });

    //handle producer closed, remove the media element and update the layout
    function handleProducerClosed(remoteProducerId, producerSocketId, trackType) {
        const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId);
        producerToClose.consumerTransport.close();
        producerToClose.consumer.close();

        consumerTransports = consumerTransports.filter(transportData => transportData.producerId !== remoteProducerId);

        if (trackType.type === 'screenAudio' || trackType.type === 'screenVideo') {
            if (document.getElementById('screen-' + producerSocketId)) document.getElementById('screen-' + producerSocketId).remove();
            layout();
        } else {
            if (document.getElementById(remoteProducerId)) document.getElementById(remoteProducerId).remove();
        }

        if (isRecording) mixer.resetVideoStreams(getMediaStreams());
    }

    //handle leave, update the layout and reset streams for recording
    function handleLeave(socketId, isModerator, username) {
        if (isModerator) reload(1);

        let container = document.getElementById('container-' + socketId);
        let screenContainer = document.getElementById('screen-' + socketId);
        if (container) container.remove();
        if (screenContainer) screenContainer.remove();
        if (container || screenContainer) layout();
        if (isRecording) mixer.resetVideoStreams(getMediaStreams());

        $(".list-" + username)[0].remove();
        $('#showParticipantList').addClass('number').attr('data-content', --usersCount);
    }

    //open device settings modal
    $('.openSettings').on('click', async function () {
        $('#settings').modal('show');
        let devices = await navigator.mediaDevices.enumerateDevices();
        gotDevices(devices);
    });

    //get audio constraints
    function getAudioConstraints() {
        const audioSource = audioInputSelect.value;

        return {
            deviceId: audioSource ? { exact: audioSource } : undefined,
        };
    }

    //get video constraints
    function getVideoConstraints() {
        return {
            deviceId: videoInputSelect.value,
            width: { exact: $('#' + videoQualitySelect.value).data('width') },
            height: { exact: $('#' + videoQualitySelect.value).data('height') },
        };
    }

    //set devices in select input
    function gotDevices(deviceInfos) {
        const values = selectors.map((select) => select.value);
        selectors.forEach((select) => {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
        });
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
                audioInputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `camera ${videoInputSelect.length + 1}`;
                videoInputSelect.appendChild(option);
            }
        }
        selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
                select.value = values[selectorIndex];
            }
        });
    }

    //video input change handler
    videoQualitySelect.onchange = videoInputSelect.onchange = async function () {
        if (!videoParams.track) return;

        try {
            videoParams.track.stop();
            sendMessage({ type: 'producerClose', id: videoParams.id });
            localVideo.srcObject = null;

            let stream = await getUserMedia(false, true);
            videoParams.track = stream.getTracks()[0];
            producerTransport.produce(videoParams);
            localVideo.srcObject = new MediaStream([videoParams.track]);

            videoSource.value = videoParams.track.getSettings().deviceId;
            localStorage.setItem('videoQuality', videoQualitySelect.value);
        } catch (e) { }
    };

    //checks and audio input change handler
    audioSource.onchange = async function () {
        if (!audioParams.track) return;

        try {
            audioParams.track.stop();
            sendMessage({ type: 'producerClose', id: audioParams.id });
            localAudio.srcObject = null;

            let stream = await getUserMedia(true, false);
            audioParams.track = stream.getTracks()[0];
            producerTransport.produce(audioParams);
            localAudio.srcObject = new MediaStream([audioParams.track]);
        } catch (e) { }
    };

    //leave the meeting
    $(document).on('click', '#leave', function () {
        showError(languages.meeting_ended);
        reload(0);
    });

    //reload after a specific seconds
    function reload(seconds) {
        setTimeout(function () {
            if (settings.endURL == 'null') {
                window.location.reload();
            } else {
                window.location.href = settings.endURL;
            }
        }, seconds * 1000);
    }

    //change the video size on window resize
    window.onresize = function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            layout();
        }, 20);
    };

    //enter into fullscreen mode with double click on video
    $(document).on('dblclick', 'video', function () {
        if (this.id == "previewVideo") return;

        let parentElement = $(this).parent();
        if (parentElement.hasClass('OT_big')) {
            parentElement.removeClass('OT_big');
        } else {
            parentElement.addClass('OT_big');
        }

        layout();
    });

    //toggle picture-in-picture mode with click on video
    //preventing pip mode for mobile devices because, it is not fully supported yet
    $(document).on('click', 'video', function () {
        if (isMobile || this.id == "previewVideo") return;

        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            if (this.readyState === 4 && this.srcObject.getTracks().length) {
                try {
                    this.requestPictureInPicture();
                } catch (e) {
                    showError(languages.no_pip);
                }
            } else {
                showError(languages.no_video);
            }
        }
    });

    //toggle recording
    $(document).on('click', '#recording', function () {
        if (!featureAvailable('recording')) return;

        if (isOnIOS) {
            showError(languages.feature_not_supported);
            return;
        }

        if (isRecording) {
            stopRecording();
        } else {
            if (isModerator || settings.authMode == "disabled" || settings.moderatorRights == "disabled") {
                startRecording();
            } else {
                $(this).attr('disabled', true);

                //ask moderator for permission
                sendMessage({
                    type: 'recordingPermission',
                    username: userInfo.username,
                    meetingId: userInfo.meetingId
                });

                showInfo(languages.please_wait);
            }
        }
    });

    //start the recording
    function startRecording() {
        mixer = new MultiStreamsMixer(getMediaStreams());
        mixer.frameInterval = 1;
        mixer.height = $('#' + videoQualitySelect.value).data('height');
        mixer.width = $('#' + videoQualitySelect.value).data('width');
        mixer.startDrawingFrames();

        recorder = new MediaRecorder(mixer.getMixedStream());
        recorder.start(1000);
        recorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) {
                recordingData.push(e.data);
            }
        }
        isRecording = true;
        $("#recording").css('color', 'red');
        sendMessage({
            type: 'recordingStarted',
            username: userInfo.username,
            meetingId: userInfo.meetingId
        });
    }

    //stop recording and download
    function stopRecording() {
        mixer.releaseStreams();
        recorder.stop();
        recorder = recorder.ondataavailable = null;
        let link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob(recordingData, { type: "video/webm" }));
        link.download = meetingTitle;
        link.click();
        isRecording = false;
        recordingData = [];
        $("#recording").css('color', 'white');
    }

    //get all the audio and video streams
    function getMediaStreams() {
        let mediaStreams = [];
        let hasVideoTrack = false;

        $("audio").each((key, value) => {
            if (value.srcObject) mediaStreams.push(value.srcObject);
        });

        $("video").each((key, value) => {
            if (value.srcObject) {
                if (value.srcObject.getTracks().length) hasVideoTrack = true;
                mediaStreams.push(value.srcObject);
            }
        });

        if (recordingPreference.value == 'with' && parseInt(features['whiteboard'])) {
            hasVideoTrack = true;
            if (whiteboardAdded) {
                mediaStreams.push($("iframe").contents().find("#main-canvas")[0].captureStream());
            } else {
                showWhiteboard();
                setTimeout(function () {
                    mixer.appendStreams($("iframe").contents().find("#main-canvas")[0].captureStream());
                }, 3000);
            }
        }

        //add a fake video stream from the canvas if no video track is available
        if (!hasVideoTrack) mediaStreams.push(audioOnly.captureStream());

        return mediaStreams;
    }

    //store recordingPreference in localStorage
    recordingPreference.onchange = function () {
        localStorage.setItem('recordingPreference', this.value);
    };

    //update recordingPreference value from localStorage
    recordingPreference.value = localStorage.getItem('recordingPreference') || 'without';

    //add listner to whiteboard
    designer.addSyncListener(function (data) {
        sendMessage({
            type: 'whiteboard',
            data: JSON.stringify(data)
        });
    });

    //set whiteboard tools
    designer.setTools({
        line: true,
        arrow: true,
        pencil: true,
        marker: true,
        dragSingle: false,
        dragMultiple: false,
        eraser: true,
        rectangle: true,
        arc: false,
        bezier: false,
        quadratic: true,
        text: true,
        image: true,
        pdf: true,
        zoom: false,
        lineWidth: false,
        colorsPicker: true,
        extraOptions: false,
        code: false,
        undo: true,
        snap: true,
        clear: true,
        close: true
    });

    designer.icons = {
        pencil: '/images/pencil.png',
        marker: '/images/marker.png',
        eraser: '/images/eraser.png',
        text: '/images/text.png',
        image: '/images/image.png',
        pdf: '/images/pdf.png',
        line: '/images/line.png',
        arrow: '/images/arrow.png',
        rectangle: '/images/rectangle.png',
        quadratic: '/images/curve.png',
        undo: '/images/undo.png',
        colorsPicker: '/images/color.png',
        snap: '/images/camera.png',
        clear: '/images/clear.png',
        close: '/images/close.png',
    };

    //toggle whiteboard
    $(document).on("click", "#whiteboard", function () {
        if (!featureAvailable('whiteboard')) return;

        if (whiteboardVisible) {
            hideWhiteboard();
        } else {
            showWhiteboard();
        }
    });

    //hide whiteboard
    function hideWhiteboard() {
        $("#videos").removeClass('set-videos');
        $("#whiteboardSection").removeClass('set-whiteboard');
        whiteboardVisible = false;
        layout();
    }

    //show whiteboard
    function showWhiteboard() {
        $("#videos").addClass('set-videos');
        $("#whiteboardSection").addClass('set-whiteboard');
        whiteboardVisible = true;
        layout();

        appendWhiteboard();
    }

    //append whiteboard
    function appendWhiteboard() {
        if (whiteboardAdded) return;
        designer.appendTo(whiteboardSection);
        whiteboardAdded = true;

        //set onload event on iframe
        $('iframe').on("load", function () {
            $("iframe").contents().on('click', '#clear', function () {
                sendMessage({
                    type: 'clearWhiteboard'
                });
            });

            $("iframe").contents().on('click', '#close', function () {
                hideWhiteboard();
            });
        });
    }

    //handle new event on whiteboard
    function handleWhiteboard(data) {
        data = JSON.parse(data);

        if (whiteboardAdded) {
            designer.syncData(data);
        } else {
            showWhiteboard();

            setTimeout(function () {
                designer.syncData(data);
            }, 3000);
        }
    }

    //send data to the server
    function sendMessage(data) {
        socket.emit('message', data);
    }

    //detect and replace text with url
    function linkify(text) {
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    }

    //warn the user if he tries to leave the page during the meeting
    window.addEventListener(eventName, function () {
        socket.close();

        $("video").each((key, value) => {
            if (value.srcObject) {
                value.pause();
                value.srcObject = null;
                value.load();
                value.parentNode.removeChild(value);
            }
        });

        if (isRecording) stopRecording();
    });

    //initiate keyboard shortcuts
    function initKeyShortcuts() {
        $(document).on('keydown', function (e) {
            if ($('#messageInput').is(':focus')) return;

            switch (e.key) {
                case 'C':
                case 'c':
                    $('.chat-panel').animate({
                        width: 'toggle',
                    });

                    if ($('#openChat').hasClass('notify')) {
                        $('#openChat').removeClass('notify');
                        messageCount = 0;
                    }
                    break;
                case 'F':
                case 'f':
                    if ($('.chat-panel').is(':hidden')) {
                        $('.chat-panel').animate({
                            width: 'toggle',
                        });
                    }
                    $('#selectFile').trigger('click');
                    break;
                case 'A':
                case 'a':
                    $('#toggleMic').trigger('click');
                    break;
                case 'L':
                case 'l':
                    $('#leave').trigger('click');
                    break;
                case 'V':
                case 'v':
                    $('#toggleVideo').trigger('click');
                    break;
                case 'S':
                case 's':
                    $('#screenShare').trigger('click');
                    break;
            }
        });
    }

    //get random color
    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    //check if the feature is available in the current meeting plan
    function featureAvailable(feature) {
        let result = parseInt(features[feature]);
        if (!result) showError(languages.feature_not_available);
        return result;
    }
})();