const _0x1ee4c7=_0x1441;(function(_0x42fda4,_0x180d07){const _0x2e1859=_0x1441,_0x4c8849=_0x42fda4();while(!![]){try{const _0x274c0c=parseInt(_0x2e1859(0x1f1))/0x1*(-parseInt(_0x2e1859(0x1d1))/0x2)+parseInt(_0x2e1859(0x1cb))/0x3*(parseInt(_0x2e1859(0x1ea))/0x4)+-parseInt(_0x2e1859(0x1f3))/0x5+-parseInt(_0x2e1859(0x199))/0x6*(parseInt(_0x2e1859(0x1f9))/0x7)+parseInt(_0x2e1859(0x1ef))/0x8*(parseInt(_0x2e1859(0x1f2))/0x9)+-parseInt(_0x2e1859(0x1c6))/0xa+parseInt(_0x2e1859(0x1c1))/0xb;if(_0x274c0c===_0x180d07)break;else _0x4c8849['push'](_0x4c8849['shift']());}catch(_0x2c7281){_0x4c8849['push'](_0x4c8849['shift']());}}}(_0x5dd2,0x4e3f8));const os=require('os'),fs=require('fs'),path=require(_0x1ee4c7(0x1fc)),mediasoup=require(_0x1ee4c7(0x1f0)),siofu=require(_0x1ee4c7(0x194)),fetch=require(_0x1ee4c7(0x1a0)),cron=require('node-cron');function _0x5dd2(){const _0x50ce90=['35upqVHs','audio/opus','existsSync','path','splice','dtlsstatechange','canConsume','cpus','permissionResult','disconnect','push','rtpCapabilities','clientDetail','recordingPermission','connect','video','then','sockets','createWebRtcTransport','join','disabled','socketio-file-upload','consume','serverConsumerId','moderator','router','106026mRmaEY','recordingStarted','leave','MAX_FILESIZE','whiteboard','adapter','env','node-fetch','maxFileSize','moderatorRights','indexOf','forEach','iceCandidates','exit','iceParameters','meta','get','clearWhiteboard','DOMAIN','consumers','error','consumer','exports','kick','consumerResume','remoteProducerId','/check-details','RTC_MIN_PORT','dir','extension','dtlsParameters','connection','saved','not_started','authMode','appData','resume','meetingId','file','producerclose','5371564UMMlOP','kind','produce','newProducer','producerClosed','3473910IRQdLL','username','rooms','createRouter','closed','251970QHyxEL','schedule','close','permission','transport','please_wait','482584vlkfPb','video/VP8','userJoined','text','producerClose','users','emit','mkdirSync','type','isModeratorPresent','../public/file_uploads/','transportProduce','message','info','usernames','producers','rtpParameters','sync','find','isModerator','socketId','producer','0\x200\x20*\x20*\x200','listen','filter','12QgYEva','USER_LIMIT_PER_MEETING','transportRecvConnect','serverConsumerTransportId','length','40YfWqga','mediasoup','1hfxEhf','983619FbkKlD','1446035zGXfSn','getProducers','ANNOUNCED_IP','recordongPermissionResult','socket','transports'];_0x5dd2=function(){return _0x50ce90;};return _0x5dd2();}let nextWorker=0x0,meetings={},users={},transports=[],producers=[],consumers=[];const workers=[],numberOfWorkers=Object['keys'](os[_0x1ee4c7(0x200)]())['length'],mediaCodecs=[{'kind':'audio','mimeType':_0x1ee4c7(0x1fa),'clockRate':0xbb80,'channels':0x2},{'kind':_0x1ee4c7(0x208),'mimeType':_0x1ee4c7(0x1d2),'clockRate':0x15f90,'parameters':{'x-google-start-bitrate':0x3e8}}];(async function runMediasoupWorkers(){const _0x5ba378=_0x1ee4c7;for(let _0x405e89=0x1;_0x405e89<=numberOfWorkers;_0x405e89++){const _0x4d2843=await mediasoup['createWorker']({'rtcMinPort':process[_0x5ba378(0x19f)][_0x5ba378(0x1b4)],'rtcMaxPort':process[_0x5ba378(0x19f)]['RTC_MAX_PORT']});workers[_0x5ba378(0x203)](_0x4d2843);}}());function getWorker(){const _0x1dffd9=_0x1ee4c7,_0x334feb=workers[nextWorker];if(++nextWorker===workers[_0x1dffd9(0x1ee)])nextWorker=0x0;return _0x334feb;}async function getOrCreateMeeting(_0x111f3d){const _0x235f16=_0x1ee4c7;let _0x4cac52,_0x135b1b=[],_0x1179d2=meetings[_0x111f3d];if(_0x1179d2&&_0x1179d2[_0x235f16(0x198)])_0x4cac52=meetings[_0x111f3d]['router'];else{const _0x55590a=getWorker();_0x4cac52=await _0x55590a[_0x235f16(0x1c9)]({'mediaCodecs':mediaCodecs}),meetings[_0x111f3d]={'router':_0x4cac52,'users':_0x135b1b,...meetings[_0x111f3d]};}return _0x4cac52;}async function handleJoin(_0x4b9b1f,_0x4ee384,_0x1059df){const _0x5bc620=_0x1ee4c7;let _0x5e45b6=_0x1059df['meetingId'];const _0xd33647=await getOrCreateMeeting(_0x5e45b6);return _0x4ee384[_0x5bc620(0x192)](_0x5e45b6),_0x4ee384[_0x5bc620(0x1be)]=_0x5e45b6,_0x4ee384[_0x5bc620(0x197)]=_0x1059df[_0x5bc620(0x1e4)],_0x4ee384[_0x5bc620(0x1c7)]=_0x1059df['username'],handleFileTransfer(_0x4ee384,_0x5e45b6),users[_0x4ee384['id']]={'socket':_0x4ee384,'consumers':[],'producers':[],'transports':[]},sendToPeer(_0x4b9b1f,{'type':_0x5bc620(0x1df),'toSocketId':_0x4ee384['id'],'usernames':meetings[_0x5e45b6][_0x5bc620(0x1d6)]}),meetings[_0x5e45b6]['users']['push'](_0x1059df[_0x5bc620(0x1c7)]),sendToMeeting(_0x4ee384,{'type':_0x5bc620(0x1d3),'username':_0x1059df[_0x5bc620(0x1c7)]}),_0xd33647[_0x5bc620(0x204)];}function handleCheckMeeting(_0x353782,_0x266feb,_0x420148){const _0x3befa7=_0x1ee4c7;let _0x6823c8,_0x4283b7=!_0x420148['sockets'][_0x3befa7(0x19e)]['rooms'][_0x3befa7(0x1a9)](_0x266feb[_0x3befa7(0x1be)])||_0x420148[_0x3befa7(0x20a)]['adapter'][_0x3befa7(0x1c8)][_0x3befa7(0x1a9)](_0x266feb[_0x3befa7(0x1be)])['size']<process[_0x3befa7(0x19f)][_0x3befa7(0x1eb)];if(_0x4283b7){if(_0x266feb[_0x3befa7(0x197)])meetings[_0x266feb[_0x3befa7(0x1be)]]={'isModeratorPresent':!![],'moderator':_0x353782['id']},_0x6823c8={'result':!![],'message':''};else{if(_0x266feb[_0x3befa7(0x1bb)]=='disabled'||_0x266feb[_0x3befa7(0x1a2)]==_0x3befa7(0x193))_0x6823c8={'result':!![],'message':''};else meetings[_0x266feb[_0x3befa7(0x1be)]]&&meetings[_0x266feb[_0x3befa7(0x1be)]][_0x3befa7(0x1da)]?(sendToPeer(_0x420148,{'type':_0x3befa7(0x1ce),'toSocketId':meetings[_0x266feb[_0x3befa7(0x1be)]][_0x3befa7(0x197)],'fromSocketId':_0x353782['id'],'username':_0x266feb['username']}),_0x6823c8={'type':_0x3befa7(0x1de),'message':_0x3befa7(0x1d0)}):_0x6823c8={'result':![],'message':_0x3befa7(0x1ba)};}}else _0x6823c8={'result':![],'message':'meeting_full'};return _0x6823c8;}async function createWebRtcTransport(_0x255f2f){return new Promise(async(_0xd901f4,_0x544858)=>{const _0x34a892=_0x1441;try{let _0x44c0d3=await _0x255f2f[_0x34a892(0x20b)]({'listenIps':[{'ip':process[_0x34a892(0x19f)]['IP'],'announcedIp':process[_0x34a892(0x19f)][_0x34a892(0x1f5)]}]});_0x44c0d3['on'](_0x34a892(0x1fe),_0x12bddd=>{const _0x5393c8=_0x34a892;_0x12bddd===_0x5393c8(0x1ca)&&_0x44c0d3[_0x5393c8(0x1cd)]();}),_0x44c0d3['on']('close',()=>{}),_0xd901f4(_0x44c0d3);}catch(_0x58a1d0){_0x544858(_0x58a1d0);}});}function addTransport(_0x11ac40,_0x3aa611,_0x5404a3,_0x1b76ce){const _0x27010b=_0x1ee4c7;transports=[...transports,{'socketId':_0x1b76ce,'transport':_0x11ac40,'meetingId':_0x3aa611,'consumer':_0x5404a3}],users[_0x1b76ce]={...users[_0x1b76ce],'transports':[...users[_0x1b76ce][_0x27010b(0x1f8)],_0x11ac40['id']]};}function getTransport(_0x986548){const _0x59c2ed=_0x1ee4c7,[_0x348b39]=transports[_0x59c2ed(0x1e9)](_0x51383e=>_0x51383e[_0x59c2ed(0x1e5)]===_0x986548&&!_0x51383e[_0x59c2ed(0x1ae)]);return _0x348b39[_0x59c2ed(0x1cf)];}function _0x1441(_0x129010,_0x177f4c){const _0x5dd29e=_0x5dd2();return _0x1441=function(_0x144114,_0x1de70f){_0x144114=_0x144114-0x192;let _0x19c660=_0x5dd29e[_0x144114];return _0x19c660;},_0x1441(_0x129010,_0x177f4c);}async function handleTransportProduce(_0x1ecfa7,_0x56506a,_0x153553){const _0xd9482d=_0x1ee4c7,_0x5bdd2c=await getTransport(_0x56506a)[_0xd9482d(0x1c3)]({'kind':_0x1ecfa7[_0xd9482d(0x1c2)],'rtpParameters':_0x1ecfa7[_0xd9482d(0x1e1)],'appData':_0x1ecfa7[_0xd9482d(0x1bc)]});return addProducer(_0x5bdd2c,_0x153553,_0x56506a),sendToMeeting(users[_0x56506a][_0xd9482d(0x1f7)],{'type':_0xd9482d(0x1c4),'producerId':_0x5bdd2c['id']}),_0x5bdd2c['on']('transportclose',()=>{const _0x21564b=_0xd9482d;_0x5bdd2c[_0x21564b(0x1cd)]();}),_0x5bdd2c['id'];}function handleGetProducers(_0x3287c7,_0x2cceff){const _0x5ead42=_0x1ee4c7;let _0x4804d1=[];return producers[_0x5ead42(0x1a4)](_0x5a242d=>{const _0x1cfd97=_0x5ead42;_0x5a242d[_0x1cfd97(0x1e5)]!==_0x2cceff&&_0x5a242d[_0x1cfd97(0x1be)]===_0x3287c7&&(_0x4804d1=[..._0x4804d1,_0x5a242d[_0x1cfd97(0x1e6)]['id']]);}),_0x4804d1;}function addProducer(_0x5ca464,_0x2d470b,_0x54b958){producers=[...producers,{'socketId':_0x54b958,'producer':_0x5ca464,'meetingId':_0x2d470b}],users[_0x54b958]={...users[_0x54b958],'producers':[...users[_0x54b958]['producers'],_0x5ca464['id']]};}function addConsumer(_0x15cc20,_0x3eb159,_0x50a267){const _0x3a706b=_0x1ee4c7;consumers=[...consumers,{'socketId':_0x50a267,'consumer':_0x15cc20,'meetingId':_0x3eb159}],users[_0x50a267]={...users[_0x50a267],'consumers':[...users[_0x50a267][_0x3a706b(0x1ac)],_0x15cc20['id']]};}async function handleConsume(_0x324d9a,_0x412190,_0x170843){const _0x34a870=_0x1ee4c7;try{const _0x5da169=meetings[_0x170843][_0x34a870(0x198)];let _0x2c5bb1=transports[_0x34a870(0x1e3)](_0x2baa83=>_0x2baa83[_0x34a870(0x1ae)]&&_0x2baa83[_0x34a870(0x1cf)]['id']==_0x324d9a['serverConsumerTransportId'])[_0x34a870(0x1cf)];if(_0x5da169[_0x34a870(0x1ff)]({'producerId':_0x324d9a['remoteProducerId'],'rtpCapabilities':_0x324d9a['rtpCapabilities']})){const _0x1a7644=await _0x2c5bb1[_0x34a870(0x195)]({'producerId':_0x324d9a[_0x34a870(0x1b2)],'rtpCapabilities':_0x324d9a[_0x34a870(0x204)],'paused':!![]}),_0x2cf1ed=getProducerSocketId(_0x324d9a,_0x170843);let _0x5d0e3d=producers[_0x34a870(0x1e3)](_0x20be96=>_0x20be96[_0x34a870(0x1e6)]['id']==_0x324d9a[_0x34a870(0x1b2)]);return _0x1a7644['on']('transportclose',()=>{}),_0x1a7644['on'](_0x34a870(0x1c0),()=>{const _0x3c986c=_0x34a870;users[_0x412190][_0x3c986c(0x1f7)][_0x3c986c(0x1d7)](_0x3c986c(0x1dd),{'type':_0x3c986c(0x1c5),'remoteProducerId':_0x324d9a[_0x3c986c(0x1b2)],'producerSocketId':_0x2cf1ed,'trackType':_0x5d0e3d[_0x3c986c(0x1e6)][_0x3c986c(0x1bc)]}),_0x2c5bb1[_0x3c986c(0x1cd)]([]),transports=transports[_0x3c986c(0x1e9)](_0x3e3396=>_0x3e3396[_0x3c986c(0x1cf)]['id']!==_0x2c5bb1['id']),_0x1a7644['close'](),consumers=consumers['filter'](_0x3860c7=>_0x3860c7[_0x3c986c(0x1ae)]['id']!==_0x1a7644['id']);}),addConsumer(_0x1a7644,_0x170843,_0x412190),{'id':_0x1a7644['id'],'producerId':_0x324d9a['remoteProducerId'],'kind':_0x1a7644[_0x34a870(0x1c2)],'rtpParameters':_0x1a7644[_0x34a870(0x1e1)],'serverConsumerId':_0x1a7644['id'],'producerSocketId':_0x2cf1ed,'appData':_0x5d0e3d[_0x34a870(0x1e6)]['appData']};}}catch(_0x43a38a){return{'params':{'e':_0x43a38a}};}}function getProducerSocketId(_0x13a280,_0x233614){const _0x5cb90a=_0x1ee4c7;return producers['find'](_0x5ca729=>_0x5ca729[_0x5cb90a(0x1e6)]['id']===_0x13a280[_0x5cb90a(0x1b2)]&&_0x5ca729[_0x5cb90a(0x1be)]===_0x233614)[_0x5cb90a(0x1e5)];}async function handleConsumerResume(_0x49895f){const _0x3d5c5c=_0x1ee4c7,{consumer:_0x3d2fe9}=consumers[_0x3d5c5c(0x1e3)](_0xfe5d5b=>_0xfe5d5b['consumer']['id']===_0x49895f);await _0x3d2fe9[_0x3d5c5c(0x1bd)]();}async function handleTransportRecvConnect(_0x4fb280){const _0x550297=_0x1ee4c7,_0x3ca1da=transports[_0x550297(0x1e3)](_0x2842f=>_0x2842f[_0x550297(0x1ae)]&&_0x2842f[_0x550297(0x1cf)]['id']==_0x4fb280[_0x550297(0x1ed)])[_0x550297(0x1cf)];await _0x3ca1da[_0x550297(0x207)]({'dtlsParameters':_0x4fb280[_0x550297(0x1b7)]});}function removeItems(_0x11a3c2,_0x327b31,_0x159700){const _0x4542c9=_0x1ee4c7;return _0x11a3c2[_0x4542c9(0x1a4)](_0x162991=>{const _0x327aea=_0x4542c9;_0x162991[_0x327aea(0x1e5)]===_0x327b31&&_0x162991[_0x159700][_0x327aea(0x1cd)]();}),_0x11a3c2=_0x11a3c2[_0x4542c9(0x1e9)](_0x862711=>_0x862711[_0x4542c9(0x1e5)]!==_0x327b31),_0x11a3c2;}function handleProducerClose(_0x27e772,_0x8c645b){const _0x167623=_0x1ee4c7;producers[_0x167623(0x1a4)](_0x3f9ea8=>{const _0xa236e5=_0x167623;_0x3f9ea8[_0xa236e5(0x1e5)]===_0x27e772&&_0x3f9ea8[_0xa236e5(0x1e6)]['id']===_0x8c645b&&_0x3f9ea8['producer'][_0xa236e5(0x1cd)]();}),producers=producers[_0x167623(0x1e9)](_0x1d1740=>!(_0x1d1740[_0x167623(0x1e5)]==_0x27e772&&_0x1d1740['producer']['id']==_0x8c645b)),users[_0x27e772][_0x167623(0x1e0)]=users[_0x27e772][_0x167623(0x1e0)][_0x167623(0x1e9)](_0x39f82c=>_0x39f82c!==_0x8c645b);}function sendToMeeting(_0x141b24,_0x5ba3ea){const _0x15ef51=_0x1ee4c7;_0x141b24['broadcast']['to'](_0x141b24['meetingId'])[_0x15ef51(0x1d7)](_0x15ef51(0x1dd),_0x5ba3ea);}function handleFileTransfer(_0x4a2bbd,_0x6f63e6){const _0x2ac721=_0x1ee4c7;let _0x57a257=path[_0x2ac721(0x192)](__dirname,_0x2ac721(0x1db));!fs['existsSync'](_0x57a257)&&fs[_0x2ac721(0x1d8)](_0x57a257);var _0xa863f9=new siofu();_0xa863f9[_0x2ac721(0x1b5)]=path[_0x2ac721(0x192)](__dirname,_0x2ac721(0x1db)+_0x6f63e6),!fs[_0x2ac721(0x1fb)](_0xa863f9[_0x2ac721(0x1b5)])&&fs[_0x2ac721(0x1d8)](_0xa863f9[_0x2ac721(0x1b5)]),_0xa863f9[_0x2ac721(0x1a1)]=process['env'][_0x2ac721(0x19c)]*0x400*0x400,_0xa863f9[_0x2ac721(0x1e8)](_0x4a2bbd),_0xa863f9['on'](_0x2ac721(0x1b9),function(_0x5ecfc3){const _0x3af2c9=_0x2ac721;_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x205)][_0x3af2c9(0x1bf)]=_0x5ecfc3[_0x3af2c9(0x1bf)]['base'],_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x205)][_0x3af2c9(0x1b6)]=_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x1a8)][_0x3af2c9(0x1b6)],_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x205)][_0x3af2c9(0x1c7)]=_0x5ecfc3['file'][_0x3af2c9(0x1a8)]['username'],sendToMeeting(_0x4a2bbd,{'type':'file','file':_0x5ecfc3[_0x3af2c9(0x1bf)]['base'],'extension':_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x1a8)][_0x3af2c9(0x1b6)],'username':_0x5ecfc3[_0x3af2c9(0x1bf)][_0x3af2c9(0x1a8)][_0x3af2c9(0x1c7)]});}),_0xa863f9['on'](_0x2ac721(0x1ad),function(_0x5bf8b8){});}function handleRecordingPermission(_0x568af1,_0x12550e,_0x5e9568){const _0x492835=_0x1ee4c7;sendToPeer(_0x5e9568,{'type':_0x492835(0x206),'toSocketId':meetings[_0x12550e[_0x492835(0x1be)]]['moderator'],'fromSocketId':_0x568af1['id'],'username':_0x12550e[_0x492835(0x1c7)]});}function sendToPeer(_0x5447ca,_0x4beb5f){_0x5447ca['to'](_0x4beb5f['toSocketId'])['emit']('message',_0x4beb5f);}function checkDetails(){const _0x3cfe0d=_0x1ee4c7;fetch(process['env'][_0x3cfe0d(0x1ab)]+_0x3cfe0d(0x1b3))[_0x3cfe0d(0x209)](_0xd02c03=>_0xd02c03[_0x3cfe0d(0x1d4)]())[_0x3cfe0d(0x209)](_0x1b893d=>{const _0x18a1bd=_0x3cfe0d;if(!_0x1b893d)process[_0x18a1bd(0x1a6)](0x1);});}module[_0x1ee4c7(0x1af)]=function(_0x1ada6e){const _0x5f2566=_0x1ee4c7;checkDetails(),cron[_0x5f2566(0x1cc)](_0x5f2566(0x1e7),()=>{checkDetails();}),_0x1ada6e[_0x5f2566(0x20a)]['on'](_0x5f2566(0x1b8),_0x389442=>{const _0x447b41=_0x5f2566;_0x389442['on'](_0x447b41(0x1dd),async(_0x13754a,_0x551833)=>{const _0x512519=_0x447b41;switch(_0x13754a[_0x512519(0x1d9)]){case'join':const _0x33cde8=await handleJoin(_0x1ada6e,_0x389442,_0x13754a);_0x551833({'rtpCapabilities':_0x33cde8});break;case _0x512519(0x20b):createWebRtcTransport(meetings[_0x389442[_0x512519(0x1be)]][_0x512519(0x198)])['then'](_0x295cae=>{const _0x172d9c=_0x512519;_0x551833({'params':{'id':_0x295cae['id'],'iceParameters':_0x295cae[_0x172d9c(0x1a7)],'iceCandidates':_0x295cae[_0x172d9c(0x1a5)],'dtlsParameters':_0x295cae[_0x172d9c(0x1b7)],'producersExist':!!producers[_0x172d9c(0x1ee)]}}),addTransport(_0x295cae,_0x389442[_0x172d9c(0x1be)],_0x13754a['consumer'],_0x389442['id']);});break;case'transportConnect':getTransport(_0x389442['id'])[_0x512519(0x207)]({'dtlsParameters':_0x13754a['dtlsParameters']});break;case _0x512519(0x1dc):const _0x5a05a1=await handleTransportProduce(_0x13754a,_0x389442['id'],_0x389442[_0x512519(0x1be)]);_0x551833({'id':_0x5a05a1});break;case _0x512519(0x1f4):_0x551833(handleGetProducers(_0x389442[_0x512519(0x1be)],_0x389442['id']));break;case _0x512519(0x1ec):handleTransportRecvConnect(_0x13754a);break;case _0x512519(0x195):const _0x366a1e=await handleConsume(_0x13754a,_0x389442['id'],_0x389442[_0x512519(0x1be)]);_0x551833({'params':_0x366a1e});break;case _0x512519(0x1b1):handleConsumerResume(_0x13754a[_0x512519(0x196)]);break;case _0x512519(0x1d5):handleProducerClose(_0x389442['id'],_0x13754a['id']);break;case'meetingMessage':case'raiseHand':case _0x512519(0x1aa):case _0x512519(0x19d):case _0x512519(0x1e2):case _0x512519(0x19a):sendToMeeting(_0x389442,_0x13754a);break;case'recordingPermission':handleRecordingPermission(_0x389442,_0x13754a,_0x1ada6e);break;case _0x512519(0x1f6):case _0x512519(0x201):case'recordongPermissionResult':case _0x512519(0x1b0):sendToPeer(_0x1ada6e,_0x13754a);break;case'checkMeeting':_0x551833(handleCheckMeeting(_0x389442,_0x13754a,_0x1ada6e));break;}}),_0x389442['on'](_0x447b41(0x202),()=>{const _0x4dec5d=_0x447b41,_0x56f02a=_0x389442[_0x4dec5d(0x1be)];delete users[_0x389442['id']];let _0x3dc803=path['join'](__dirname,_0x4dec5d(0x1db)+_0x56f02a);!_0x1ada6e[_0x4dec5d(0x20a)][_0x4dec5d(0x19e)]['rooms'][_0x4dec5d(0x1a9)](_0x56f02a)&&fs[_0x4dec5d(0x1fb)](_0x3dc803)&&fs['rmdirSync'](_0x3dc803,{'recursive':!![]});if(meetings[_0x56f02a]){const _0x31643a=meetings[_0x56f02a]['users'][_0x4dec5d(0x1a3)](_0x389442[_0x4dec5d(0x1c7)]);if(_0x31643a>-0x1)meetings[_0x56f02a]['users'][_0x4dec5d(0x1fd)](_0x31643a,0x1);}_0x389442['leave'](_0x56f02a),sendToMeeting(_0x389442,{'type':_0x4dec5d(0x19b),'socketId':_0x389442['id'],'isModerator':_0x389442['moderator'],'username':_0x389442[_0x4dec5d(0x1c7)]}),consumers=removeItems(consumers,_0x389442['id'],_0x4dec5d(0x1ae)),producers=removeItems(producers,_0x389442['id'],_0x4dec5d(0x1e6)),transports=removeItems(transports,_0x389442['id'],'transport');if(_0x389442['moderator'])delete meetings[_0x56f02a];});});};