//HOST STUFF -- later put in button fxn

// let globalOffer;
// let globalAnswer;

let pca;
// let pcb;
let dcg;

//for same-page debugging
$('#cheat').on('click', cheatSetup);
$('#deactivate').on('click', disableButtons);
$('#hangup').on('click', cutConnection);
// let dcx;

const testArea = $('#testing-area');
// testArea.hide();
testArea.show();

const setupArea = $('#setup-area');
const createArea = $('#create-area');
const joinArea = $('#join-area');
const answerArea = $('#answer-area');
const connectArea = $('#connect-area');
const chatArea = $('#chat-area');

// createArea.hide();
// joinArea.hide();
// answerArea.hide();
// connectArea.hide();
// chatArea.hide();

// createArea.show();
// joinArea.show();
// answerArea.show();
// connectArea.show();
// chatArea.show();




// $('#paste').keypress((e)=>{
//     console.log('keypress event: ', e);
//     if(e.which == 13) joinRoom();
// })

//modify these to keydown?
$('#paste').keypress((e)=>{if(e.which == 13) joinRoom();})
$('#paste2').keypress((e)=>{if(e.which == 13) makeConnection();})

// $('#message').keypress((e)=>{if(e.which == 13) sendMessage();})

//THIS ONE WORKS
//TRIGGERS AFTER NEWLINE INSERTED
// $('#message').keyup((e)=>{if(e.which == 13) sendMessage();})

//this fails
// $('#message').keypress((e)=>{if(e.which == 70) {
//     // e.preventDefault();
//     sendMessage();
// }})

//also fails
// $('#message').keydown((e)=>{if(e.which == 13) {
//     e.preventDefault();
//     sendMessage();
// }})

//THIS WORKS TOO
//BETTER I THINK
//HEADS OFF NEWLINE INSERTION
//modify this to allow newline input
//or, to allow DIV to process it
// $('#message').keydown((e)=>{if(e.which == 13) {
$('#message').keydown((e)=>{if(e.which == 13 && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
}})








//trying to stop F from typing F
//OK, this experiment explained a lot of weird behavior

// $('#message').keydown((e)=>{
//     if(e.which == 70){
//         // e.preventDefault();
//         console.log("F'ed DOWN")
//     }
// })
// $('#message').keypress((e)=>{
//     if(e.which == 70){
//         // e.preventDefault();
//         console.log("F'ed PRESS")
//     }
// })
// $('#message').keyup((e)=>{
//     if(e.which == 70){
//         // e.preventDefault();
//         console.log("F'ed UP")
//     }
// })







$('#create').on('click', createRoom);

function createRoom(){

    setupArea.hide();
    createArea.fadeIn(400);
    // createArea.show();
    
    let pc = new RTCPeerConnection();
    // console.log(pc)
    let dc = pc.createDataChannel('taco');
    // console.log(dc)
    pca = pc;
    dcg = dc;

    //new for cross-tab
    dc.onmessage = incomingMessage;
    dc.onopen = () => {
        console.log('data channel open');
        announceSystem("chat connected...");
    }
    dc.onclose = () => {
        console.log('data channel closed');
        announceSystem('data channel lost');
    }
    // dc.onmessage = function(event){
    //     let data = event.data
    //     $('#inbox').append(data);
    // }
    pc.onconnectionstatechange = statusUpdate;


    //must set local description initially
    //in order to start generating ICE candidates
    //OH this is asynchronous
    //so finding candidates is part of setting it
    pc.createOffer().then((offer)=>{
        console.log('initial offer created');
        pc.setLocalDescription(offer).then(desc => {
            console.log('description created');
            console.log(desc);
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
            // $('#offer-box').text(JSON.stringify(offer));
            let offerKey = btoa(encodeURI(JSON.stringify(offer)));
            $('#offer-box').val(offerKey);
            // $('#offer-box').text(offer.sdp);
            // globalOffer = offer;
        }
    }

    
}

function statusUpdate(event){
    console.log("event: ", event);
    switch(pca.connectionState){
        case "new":
            console.log('RPC new');
            break;
        case "checking":
            console.log('RPC checking');
            break;
        case "connecting":
            console.log('RPC establishing connection...');
            break;
        case "connected":
            console.log('RPC connected!');
            break;
        case "disconnected":
            console.log('RPC disconnected!');
            announceSystem('chat disconnected...');
            break;
        case "closed":
            console.log('RPC closed');
            break;
        case "failed":
            console.log("RPC failed");
            break;
        default:
            console.log('RPC unknown status update');
            break; 
    }
}


$('#copy-offer').on('click', function(){
    let key = $('#offer-box').val();
    navigator.clipboard.writeText(key);
})
$('#copy-answer').on('click', function(){
    let key = $('#answer-box').val();
    navigator.clipboard.writeText(key);
})

$('#sent').on('click', function(){
    createArea.hide();
    connectArea.fadeIn(400);
    // connectArea.show();
})



$('#piggyback').on('click', () => {
    setupArea.hide();
    joinArea.fadeIn(400);
    // joinArea.show();
})

$('#sent-back').on('click', () => {
    answerArea.hide();
    chatArea.show();
})

function disableButtons(){
    setupArea.show();
    createArea.show();
    joinArea.show();
    answerArea.show();
    connectArea.show();
    chatArea.show();
    $('#cheat').prop('disabled', !$('#cheat').prop('disabled'));
}

function cutConnection(){
    dcg.close();
    pca.close();
    console.log("cnxn state: ",pca.connectionState);
    announceSystem('chat closed...');
    //weird, only shows closed for "Joiner" channel
}




$('#join').on('click', joinRoom);





async function joinRoom(){

    if($('#paste').val() == "") {
        console.log('empty input');
        return;
    };
    // console.log("pasteval: ", $('#paste').val());

    let pc = new RTCPeerConnection();
    pca = pc;

    pc.ondatachannel = function(event){
        // console.log('got to ondatachannel');
        console.log('data channel established');
        let dc = event.channel;
        dcg = dc;
        
        dc.onmessage = incomingMessage;
        // channel.onmessage = function(event){
        //     let data = event.data
        //     $('#inbox').append(data);
        // }
        dc.onopen = () => {
            console.log('data channel opened');
            announceSystem("chat connected...");
        }
        dc.onclose = () => {
            console.log('data channel closed');
            announceSystem('data channel lost');
        }
    }
    pc.onconnectionstatechange = statusUpdate;

    
    // let text = $('#offer-box').text();
    // console.log("offer val", text);
    // let parsed = JSON.parse(text);
    // console.log("parsed: ", parsed);

    // await pc.setRemoteDescription(parsed);
    let paste = $('#paste').val();
    console.log("paste: ",paste)
    
    try{
        let json = JSON.parse(decodeURI(atob(paste)));
        console.log("json: ",json)
        await pc.setRemoteDescription(json);
    } catch(err) {
        console.log("invalid key: "+err);
        return;
    }

    joinArea.hide();
    answerArea.fadeIn(400);
    // answerArea.show();

    // await pc.setRemoteDescription(globalOffer);
    console.log('remote description set', pc.remoteDescription);

    let answer = await pc.createAnswer();
    console.log('answer created', answer);

    await pc.setLocalDescription(answer);
    console.log('local desc created', pc.localDescription);

    // $('#answer-box').text(JSON.stringify(answer));
    let answerKey = btoa(encodeURI(JSON.stringify(answer)))
    answerKey = "===="+answerKey;
    $('#answer-box').val(answerKey);

    announceSystem("establishing...")
    // $('#answer-box').text(answer.sdp);
    // globalAnswer = answer;

    // pcb = pc;

}

$('#connect').on('click', makeConnection)


async function makeConnection(){

    if($('#paste2').val() == "") {
        console.log('empty input');
        return;
    };


    let paste2 = $('#paste2').val();
    paste2 = paste2.slice(4);
    
    try{
        let json2 = JSON.parse(decodeURI(atob(paste2)));
        console.log("json: ",json2)
        await pca.setRemoteDescription(json2);
    } catch(err){
        console.log("invalid handshake: "+err);
        return;
    }

    connectArea.hide();
    chatArea.show();
    announceSystem("establishing...")

    // await pca.setRemoteDescription(globalAnswer);
    console.log('partner remote desc set', pca.remoteDescription);
}



let msgCount = 0;

$('#send').on('click', sendMessage);



function sendMessage(){

    let state = pca.connectionState;
    if(state != "connected"){
        announceSystem("no connection");
        return;
    }

    let message = $('#message').val();

    if(message == "") {
        console.log('empty message');
        return;
    };

    let chat = $('<div/>').text(getTime()+message);
    chat.addClass('msg');

    chat.css('color', '#009000');
    // chat.css('color', '#468847');
    // $('#inbox').append(chat);
    $('#chatbox').append(chat);

    $('#outbox').append(message);

    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight)
    
    setTimeout(() => {
        dcg.send(message);
        // dcx.send("xxx"+message);
    }, 100)
    
    // dcg.send(message);
    
    msgCount++;
    let placeholder = "";
    // let placeholder = "_msg"+msgCount;
    $('#message').val(placeholder);    

    // setTimeout(() => {
    //     $('#message').val("");    
    // }, 0)



}

// function inMsg2(event){
//     let data = event.data;
//     $('#inbox').append("channel2"+data);
// }

function incomingMessage(event){
    let data = event.data;
    let chat = $('<div/>').text(getTime()+data);
    chat.addClass('msg');
    chat.css('color', 'darkviolet');
    // chat.css('color', '#3a87ad');
    // $('#inbox').append(chat);
    $('#chatbox').append(chat);
    // $('#inbox').append(data);
    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight)
    // $('#chatbox').scrollTop(0)
    // console.log($('#chatbox'))
    // console.log($('#chatbox')[0])
    // console.log($('#chatbox')[0].scrollHeight)

}

function getTime(){
    let time = new Date();
    let hours = formatClock(time.getHours())
    let minutes = formatClock(time.getMinutes())
    let seconds = formatClock(time.getSeconds())
    let stamp = "["+hours+":"+minutes+":"+seconds+"] ";
    return stamp;
}

function formatClock(num){
    if(num < 10) return "0" + num;
    return num;
}


//combine this into sendmessage fxn
function announceSystem(str){
    let chat = $('<div/>').text(getTime()+"SYSTEM: "+str);
    chat.addClass('msg');
    chat.css('color', '#3a87ad');
    $('#chatbox').append(chat);
    $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight)
}


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



// SAMPLE TEXT

//Here's your "offer" -- it tells someone else how to connect to you. Send the whole thing to them, for example in an instant message or e-mail.

//Now paste in the "answer" that was sent back to you.

//The person who created the room will send you an "offer" string -- paste it here.

//Here's your "answer" -- it tells someone else how to connect to you. Send the whole thing to them, for example in an instant message or e-mail.



async function cheatSetup(){
    console.log('cheat setup');
    let pc1 = new RTCPeerConnection();
    dc = pc1.createDataChannel('default');
    pca = pc1;
    dcg = dc;


    pc1.onconnectionstatechange = statusUpdate;

    // dc.onmessage = incomingMessage;
    let offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);
    // console.log('desc: ',desc);
    
    pc1.onicecandidate = (candidate) => {
        if(candidate.candidate == null){
            finishSetup();
        }
    }
    async function finishSetup(){
        let pc2 = new RTCPeerConnection();
        pc2.ondatachannel = (event) => {
            // let channel = event.channel;
            // channel.onmessage = incomingMessage;
            event.channel.onmessage = incomingMessage;
            // channel.onmessage = inMsg2;
            // dcg = event.channel;
            // dcx = channel;
        }

        offer = await pc1.createOffer();
        await pc2.setRemoteDescription(offer);
        let answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        // pcb = pc;
        await pc1.setRemoteDescription(answer);
        setupArea.hide();
        chatArea.show();
    }
}

//done:
//replace globals with pasting
// 
//input boxes and such
//make git add/commit shortcuts
//add cheat connection
// show/hide fields
//copy-paste button for fields
//rename room key -- asymmetric?  vs passcode?
//add prompts
// 
//fix bugs
//tweak spacing format
// test disable button
//better formatted ID/address
//obfuscate chat-id
// review open tabs/docs for info
    // close open tabs/docs
    // review/close other codes
// fix text overflow
// format chat window
// 
//make text look good
//add timestamps
//center it maybe?
//format clock
// add chat connected msg
//enter to send!
//scroll to bottom when sent
//transition for ergonomic key-turnaround
//add chat connected system message
    //add disconnection messages
//add better section transitions
//error-checks
    //for common errors
    //empty boxes mostly
//add exit and close button(s)
//drop test messages
//handle invalid keys (try/catch?)
//add read receipts?
//bigger typing box?
//OH and load script & css into single html file------
    //for portability
//allow multi-line input

// ========================================================================================

//ok now what

//add names to chat
//add name prompt
//limit to alexandras

//update app name

//test across machines

//write build script-----------------------
//auto-delete comments?--------------------

//switch vanilla instead of JQ

//improve function organization

//more callbacks?
//onclose and such?

//implement try/catch blocks also?

//files/audio------------------------------

//sockets----------------------------------
//add who is online
//on the host Websockets site

// email chats to save history-------------

//encode favicon image as base-64?------------------

//hover for modal explanation--------------
//of e.g. what's the handshake
//or is distinct tooltip class

//let drag box around the page-------------

//combine send-message functions-----------

//
//

//list what didn't need!

//all that SDP crap!

//deactivate buttons
//i had a different solution here

//declaring the STUN servers??

//
