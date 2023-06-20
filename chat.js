//HOST STUFF -- later put in button fxn

let globalOffer;
let globalAnswer;

let pca;
let pcb;
let dcg;

//for same-page debugging
let dcx;

$('#cheat').on('click', cheatSetup);


$('#create').on('click', createRoom);

function createRoom(){
    
    let pc = new RTCPeerConnection();
    // console.log(pc)
    let dc = pc.createDataChannel('taco');
    // console.log(dc)

    //new for cross-tab
    dc.onmessage = incomingMessage;
    // dc.onmessage = function(event){
    //     let data = event.data
    //     $('#inbox').append(data);
    // }


    //must set local description initially
    //in order to start generating ICE candidates
    //OH this is asynchronous
    //so finding candidates is part of setting it
    pc.createOffer().then((offer)=>{
        console.log('initial offer created');
        pc.setLocalDescription(offer).then(desc => {
            console.log('description created');
        })
        // console.log("offer1", offer.sdp);
        // console.log("local1", pc.localDescription)
        //ok the offer is available but local description later
        //because have to add ICE candidates to local desc!
    })

    let icecount = 0;

    pc.onicecandidate = async function(candidate){
        console.log('new ice candidate');
        // console.log("candidate", candidate)
        icecount++;
        // if(icecount == 1){
        //     setTimeout(async function(){
        //         let offer = await pc.createOffer();
        //         console.log("offer2", offer.sdp)
        //         $('#offer-box').text(offer.sdp);
        //     }, 5000)
        // }
        if(candidate.candidate == null){
            let offer = await pc.createOffer();
            console.log('finished offer created');
            // console.log("offer2", offer.sdp)
            // console.log("local2", pc.localDescription)

            console.log("offer origin: ", offer);
            $('#offer-box').text(JSON.stringify(offer));
            // $('#offer-box').text(offer.sdp);
            globalOffer = offer;
        }
    }

    pca = pc;
    dcg = dc;
    
}

$('#join').on('click', joinRoom);





async function joinRoom(){
    let pc = new RTCPeerConnection();
    pc.ondatachannel = function(event){
        let channel = event.channel;
        
        channel.onmessage = incomingMessage;
        // channel.onmessage = function(event){
        //     let data = event.data
        //     $('#inbox').append(data);
        // }
        dcg = channel;
    }
    
    // let text = $('#offer-box').text();
    // console.log("offer val", text);
    // let parsed = JSON.parse(text);
    // console.log("parsed: ", parsed);

    // await pc.setRemoteDescription(parsed);
    let paste = $('#paste').val();
    console.log("paste: ",paste)
    let json = JSON.parse(paste);
    console.log("json: ",json)
    await pc.setRemoteDescription(json);
    // await pc.setRemoteDescription(globalOffer);
    console.log('remote description set', pc.remoteDescription);

    let answer = await pc.createAnswer();
    console.log('answer created', answer);

    await pc.setLocalDescription(answer);
    console.log('local desc created', pc.localDescription);

    $('#answer-box').text(JSON.stringify(answer));
    // $('#answer-box').text(answer.sdp);
    globalAnswer = answer;

    pcb = pc;

}

$('#connect').on('click', makeConnection)



async function makeConnection(){
    let paste2 = $('#paste2').val();
    let json2 = JSON.parse(paste2);
    await pca.setRemoteDescription(json2);
    // await pca.setRemoteDescription(globalAnswer);
    console.log('partner remote desc set', pca.remoteDescription);
}



let msgCount = 0;

$('#send').on('click', sendMessage);

function sendMessage(){
    let message = $('#message').val();
    $('#outbox').append(message);
    
    setTimeout(() => {
        dcg.send(message);
        // dcx.send("xxx"+message);
    }, 100)
    
    // dcg.send(message);
    
    msgCount++;
    let placeholder = "_msg"+msgCount;
    $('#message').val(placeholder);
}

// function inMsg2(event){
//     let data = event.data;
//     $('#inbox').append("channel2"+data);
// }

function incomingMessage(event){
    let data = event.data;
    $('#inbox').append(data);
}


//ok now what
//add cheat connection
//make git add/commit shortcuts
//deactivate buttons
//better formatted ID/address
//copy-paste button for these
//add name prompt
//error-checks
//callbacks?
//exit and close buttons
//files/audio
//sockets
//OH and load script & css into single html file
//for portability
//implement try/catch blocks also?
//switch vanilla instead of JQ
//obfuscate chat-id
//rename room key -- asymmetric?  vs passcode?
//limit to alexandras

//done
//replace globals with pasting
//input boxes and such


//
//

//list what didn't need!
//all that SDP crap!

//

//plan:

//ask if host i guess?
//make pc
//make dc
//wait for ICEs
//make the offer
//display it

//whereas if joining
//make pc
//ask for offer
//generate answer
//display it
//oh set the ondatachannel

//at various points:
//await
//error-check
//various callbacks define
//various buttons deactivate

//oh and then
//when get message
//display in the box
//when TYPE message
//display it
//and SEND it

//when exit
//close channels

//bonus:
//add files & audio






// steps:------------------------------------
// make a RTC cnxn object
// make a data channel
// do the handshake

//
// new RTCPeerConnection(servers)
// pc.createDataChannel('taco')
// pc.onicecandidate = (assign fxn)
// dtc.onopen
// dtc.onclose
// pc.ondatachannel = callback fxn
// 	passes event.channel
// 	channel.onmessage = fxn
// 	passes event.data
// 	channel.onopen
// 	channel.onclose
// 	use channel.readyState...
// sdp = await pc.createOffer()
// dtc.send(data)
// dtc.close()
// pc.close()
// pc.setLocalDescription(sdp)
// pc.setRemoteDescription(sdp)
// iceCallback(event)
// 	event.candidate
// await pc.addIceCandidate(event.candidate)


//WEBRTC

// const pc = new RTCPeerConnection();
// const dc = pc.createDataChannel("my channel");

// dc.onmessage = (event) => {
//     console.log(`received: ${event.data}`);
// };

// dc.onopen = () => {
//     console.log("datachannel open");
// };

// dc.onclose = () => {
//     console.log("datachannel close");
// };



async function cheatSetup(){
    console.log('cheat setup');
    let pc = new RTCPeerConnection();
    let dc = pc.createDataChannel('taco');
    // dc.onmessage = incomingMessage;
    let offer = await pc.createOffer();
    let desc = pc.setLocalDescription(offer);
    pca = pc;
    dcg = dc;
    pc.onicecandidate = async function(candidate){
        if(candidate.candidate == null){
            let offer = await pc.createOffer();
            globalOffer = offer;
            finishSetup();
        }
    }
    async function finishSetup(){
        // let offer = await pc.createOffer();
        // globalOffer = offer;

        let pc = new RTCPeerConnection();
        pc.ondatachannel = function(event){
            let channel = event.channel;
            channel.onmessage = incomingMessage;
            // channel.onmessage = inMsg2;
            // dcg = channel;
            // dcx = channel;
        }

        await pc.setRemoteDescription(globalOffer);
        let answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        globalAnswer = answer;

        pcb = pc;

        await pca.setRemoteDescription(globalAnswer);

    }
}