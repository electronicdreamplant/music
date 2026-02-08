import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

// Global variable to track the currently playing instance
let activeWS = null;

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-btn').forEach((btn) => {
        const audioUrl = btn.getAttribute('data-url');
        const id = btn.id.split('-')[1];
        
        const currentEl = document.getElementById(`current-${id}`);
        const durationEl = document.getElementById(`duration-${id}`);

        const ws = WaveSurfer.create({
            container: `#wave-${id}`,
            waveColor: '#555',
            progressColor: '#b366ff', // Your updated light purple
            cursorColor: '#b366ff',   // Matching cursor
            cursorWidth: 3,
            url: audioUrl,
            barWidth: 2,             // Your updated bar width
            barGap: 2,               // Your updated gap
            barRadius: 4,
            height: 75,              // Your updated height
            responsive: true,
            normalize: true,
            backend: 'WebAudio', 
            autoCenter: false,
            hideScrollbar: true,
        });

        const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
        const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

        // Logic to prevent multiple tracks playing at once
        ws.on('play', () => {
            if (activeWS && activeWS !== ws) {
                activeWS.pause();
            }
            activeWS = ws;
            btn.innerHTML = pauseIcon;
        });

        ws.on('pause', () => {
            btn.innerHTML = playIcon;
        });

        // Time and Duration Updates
        ws.on('ready', () => {
            if (durationEl) durationEl.textContent = formatTime(ws.getDuration());
        });

        ws.on('timeupdate', (currentTime) => {
            if (currentEl) currentEl.textContent = formatTime(currentTime);
        });

        ws.on('interaction', () => {
            if (currentEl) currentEl.textContent = formatTime(ws.getCurrentTime());
        });
        
        btn.onclick = () => ws.playPause();
    });
});
