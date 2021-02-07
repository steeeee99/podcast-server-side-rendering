function audioPlay(player){
    player.play();
}

function audioPause(player){
    player.pause();
}


let player;
let listenButton;

const playerContainer = document.querySelector('#audio-player');

const playButton = playerContainer.querySelector('#play-button');
playButton.addEventListener('click',()=>{
    audioPlay(player);
    playButton.classList.add('d-none');
    pauseButton.classList.remove('d-none');
});

const playerTitle = playerContainer.querySelector('.player-title');


const pauseButton = playerContainer.querySelector('#pause-button')
pauseButton.addEventListener('click',()=>{
    audioPause(player);
    pauseButton.classList.add('d-none');
    playButton.classList.remove('d-none');
});


const closePlayerButton = playerContainer.querySelector('#close-player-button');
closePlayerButton.addEventListener('click',()=>{
    audioPause(player);
    pauseButton.classList.add('d-none');
    playButton.classList.remove('d-none');
    playerContainer.classList.add('d-none');
    listenButton.disabled = false;
})

document.querySelectorAll('.listen-buttons').forEach((btn)=>{
    
    btn.addEventListener('click',()=>{
    
    listenButton = btn;
    const audioId = btn.dataset.id;

    const title = document.querySelector(`#title-episode-${audioId}`).innerText;
    document.querySelector('#player-title').innerText = title;

    listenButton.disabled = true;

    player = new Audio(`/audios/${audioId}.mp3`);
    
    playerContainer.classList.remove('d-none');
})});