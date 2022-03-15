const randomID = Math.floor(Math.random() * 10000);
var peer = new Peer(randomID);
const myCamera = $('#my-camera');
const friendCamera = $('#friend-camera');


function userMedia() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
}

function showCamera(whereRemote, stream) {
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
        title: 'Enter the room id you want to join',
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
    userMedia().then(stream => {
        stream.getVideoTracks()[0].stop();
        showCamera(myCamera, stream);
    })
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