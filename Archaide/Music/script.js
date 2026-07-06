// Real Playlist Data with streamable audio URLs
const playlist = [
    { 
        title: "Soft Spot", 
        artist: "Keshi", 
        image: "https://imgs.search.brave.com/jk9ZAs3O0-DOJKxwatxr4byEily0QUtGzBYrg9tdGks/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTFKTTA3/VGVObDlzQy0wLXQx/MDgweDEwODAuanBn", 
        url: "https://www.image2url.com/r2/default/audio/1782634125801-65dd3997-e486-4712-b96a-7992169747ba.mp3" 
    },
    { 
        title: "ur pretty", 
        artist: "I'll never let you go", 
        image: "https://imgs.search.brave.com/qroIyjVuTW6SeJQ6YsybVIjVRx_63fZLbRFGkpYmpwo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYXN0/Zm0uZnJlZXRscy5m/YXN0bHkubmV0L2kv/dS9hdmF0YXIxNzBz/LzIwMmM1Nzc2MmRk/M2M2YWI1NDk0YTc2/OTZlMTA0MTQw", 
        url: "https://cdn.imageurlgenerator.com/uploads/166c8b05-9083-42a8-8eaa-7b6c3a15f1b1.mp3" 
    },
    { 
        title: "Kiss Me Now", 
        artist: "Pierce the Veil", 
        image: "https://imgs.search.brave.com/DlTxEXafs65ET7KYm0kYE2kv-v-ZvJn4fY5MYGJv9Ec/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDF6ajJPd2NRdUwu/anBn", 
        url: "https://cdn.imageurlgenerator.com/uploads/bf21066e-9c07-4392-bba9-42994b5c2d88.mp3" 
    },

    { 
        title: "Burnout ", 
        artist: "Sugar Free", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZJ90wWrWE7ifRfdspIIiwNXh68we5JL9BZHvx4AIkOg&s=10", 
        url: "https://www.image2url.com/r2/default/audio/1783309174601-01de0680-fc28-4f0d-b213-eb090fb88094.mp3" 
    }

];

let currentIndex = 0;
let isPlaying = false;

// Create the real HTML5 Audio object
let audioObject = new Audio();

// DOM Elements
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumArt = document.getElementById('album-art');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon').querySelector('i');

// Format seconds into M:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Load a track into the player
function loadTrack(track) {
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.src = track.image;
    
    audioObject.src = track.url;
    audioObject.load(); // Prepare the file
    
    // Reset layout elements
    progress.style.width = '0%';
    currentTimeEl.textContent = "0:00";
}

// Play & Pause controls
function togglePlay() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        audioObject.pause();
        isPlaying = false;
        icon.className = 'fas fa-play';
    } else {
        // Browsers block autoplay until the user interacts with the page
        audioObject.play().catch(error => console.log("Playback interrupted:", error));
        isPlaying = true;
        icon.className = 'fas fa-pause';
    }
}

// Listen to the actual audio track updating its time
audioObject.addEventListener('timeupdate', () => {
    const currTime = audioObject.currentTime;
    const duration = audioObject.duration;
    
    if (duration) {
        currentTimeEl.textContent = formatTime(currTime);
        const percent = (currTime / duration) * 100;
        progress.style.width = `${percent}%`;
    }
});

// Update total time layout once metadata loads
audioObject.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioObject.duration);
});

// Skip track automatically when song ends
audioObject.addEventListener('ended', () => {
    nextTrack();
});

// Skip forward & backward logic
function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(playlist[currentIndex]);
    if (isPlaying) audioObject.play();
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(playlist[currentIndex]);
    if (isPlaying) audioObject.play();
}

// Manual Time Scrubbing
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioObject.duration;
    
    if (duration) {
        const newTime = (clickX / width) * duration;
        audioObject.currentTime = newTime;
    }
});

// Real Volume Tracking
function updateVolume(value) {
    // Audio volume ranges from 0.0 to 1.0 in JavaScript
    audioObject.volume = value / 100;
    volumeSlider.style.setProperty('--volume-perc', `${value}%`);
    
    if (value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

volumeSlider.addEventListener('input', (e) => {
    updateVolume(e.target.value);
});

// Mute button logic
document.getElementById('volume-icon').addEventListener('click', () => {
    if (volumeSlider.value > 0) {
        volumeSlider.dataset.prevValue = volumeSlider.value;
        volumeSlider.value = 0;
        updateVolume(0);
    } else {
        const prev = volumeSlider.dataset.prevValue || 70;
        volumeSlider.value = prev;
        updateVolume(prev);
    }
});

// Controls Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
shuffleBtn.addEventListener('click', () => shuffleBtn.classList.toggle('active'));
repeatBtn.addEventListener('click', () => repeatBtn.classList.toggle('active'));

// Initialize basic audio setup
loadTrack(playlist[currentIndex]);
updateVolume(70);

// ... (Keep all your existing playlist arrays, variables, and functions exactly the same) ...

// NEW: Function to handle seamless auto-play initialization
function handleAutoplay() {
    // Check if the track isn't already playing
    if (!isPlaying) {
        isPlaying = true;
        const icon = playPauseBtn.querySelector('i');
        icon.className = 'fas fa-pause'; // Change play icon to pause
        
        audioObject.play().catch(error => {
            console.log("Autoplay blocked by browser. Awaiting user click.", error);
            // Fallback: reset states if browser rejects it completely
            isPlaying = false;
            icon.className = 'fas fa-play';
        });
    }
    
    // Clean up the event listener so it only runs once on the first interaction
    document.removeEventListener('click', handleAutoplay);
}

// Controls Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
shuffleBtn.addEventListener('click', () => shuffleBtn.classList.toggle('active'));
repeatBtn.addEventListener('click', () => repeatBtn.classList.toggle('active'));

// Initialize basic audio setup
loadTrack(playlist[currentIndex]);
updateVolume(70);

// NEW: Automatically try to play, but hook a listener if the browser blocks it
audioObject.play()
    .then(() => {
        // If the browser permits it immediately (rare, but possible depending on user history)
        isPlaying = true;
        playPauseBtn.querySelector('i').className = 'fas fa-pause';
    })
    .catch(() => {
        // If blocked, wait for the user to click ANYWHERE on the window to start playing
        document.addEventListener('click', handleAutoplay);
    });