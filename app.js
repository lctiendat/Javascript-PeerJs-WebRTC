import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3EoOnj0Ka42iul1ltA8kGXRNnNppg0l8",
    authDomain: "callvideo-bb197.firebaseapp.com",
    projectId: "callvideo-bb197",
    storageBucket: "callvideo-bb197.appspot.com",
    messagingSenderId: "1001320655290",
    appId: "1:1001320655290:web:74a93aa7b704fe43f99583"
};

initializeApp(firebaseConfig);

const db = getFirestore();
var peer = new Peer();
const myCamera = $('#my-camera');
const friendCamera = $('#friend-camera');
const server = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
const randomID = Math.floor(Math.random() * 1000000000000000);
var seftRemote = null
var friendRemote = null
const PC = new RTCPeerConnection(server);
var resource = null
var video = null

function userMedia() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
}

function showCamera(whereRemote, stream) {
    window.localStream = stream;
    whereRemote.get(0).srcObject = stream;
}

$('#creat-hangout').click(e => {
    $('.show-camera').addClass('d-block').removeClass('d-none')
    $('.show-room').addClass('d-block').removeClass('d-none')
    $('.action').addClass('d-none').removeClass('d-block')
    userMedia().then(stream => {
        showCamera(myCamera, stream);
    })
})

$('#join-hangout').click(e => {
    Swal.fire({
        title: 'Nhập ID phòng muốn tham gia',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'on'
        },
        showCancelButton: true,
        confirmButtonText: 'Tham gia',
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.value !== '') {
                $('.show-camera').addClass('d-block').removeClass('d-none')
                $('.show-camera-friend').removeClass('d-none').addClass('d-block')
                $('.action').addClass('d-none').removeClass('d-block')
                const idRoom = result.value
                userMedia().then(stream => {
                    showCamera(myCamera, stream);
                    const call = peer.call(idRoom, stream);
                    call.on('stream', friendStream => {
                        showCamera(friendCamera, friendStream);
                    })
                })
            } else {
                alert(`ID Room not empty`)
            }
        }
    })
})



peer.on('call', call => {
    userMedia().then(stream => {
        $('.show-camera-friend').removeClass('d-none').addClass('d-block')
        call.answer(stream);
        call.on('stream', friendStream => {
            showCamera(friendCamera, friendStream);
        })
        call.on('error', err => {
            alert(err)
        })
    })
})

$(document).on('click', '.turnoff-camera', (e) => {
    $('.turnoff-camera').addClass('bi-camera-video-off turnon-camera').removeClass('bi-camera-video turnoff-camera')
        // userMedia().then(stream => {
        //         stream.getVideoTracks()[0].enabled = false;
        //         showCamera(myCamera, stream);
        //     })
    localStream.getVideoTracks()[0].stop()
})

$(document).on('click', '.turnon-camera', (e) => {
    $('.turnon-camera').addClass('bi-camera-video turnoff-camera').removeClass('bi-camera-video-off turnon-camera')

    userMedia().then(stream => {
        stream.getVideoTracks()[0].enabled = true;
        showCamera(myCamera, stream);
    })
})

$(document).on('click', '.turnoff-volume', (e) => {
    $('.turnoff-volume').addClass('bi-volume-mute turnon-volume').removeClass('bi-volume-down turnoff-volume')
    userMedia().then(stream => {
        stream.getAudioTracks()[0].enabled = false;
        showCamera(myCamera, stream);
    })
})

$(document).on('click', '.turnon-volume', (e) => {
    $('.turnon-volume').addClass('bi-volume-down turnoff-volume').removeClass('bi-volume-mute turnon-volume')
    userMedia().then(stream => {
        stream.getAudioTracks()[0].enabled = true;
        showCamera(myCamera, stream);
    })
})

peer.on('open', id => {
    $('#roomID').append(id)
})

peer.on('disconnected', () => {
    console.log('disconnect');
})