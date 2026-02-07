import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

// Helper function to format seconds into M:SS
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-btn').forEach((btn) => {
        const audioUrl = btn.getAttribute('data-url');
        const id = btn.id.split('-')[1];
        
        // Grab our time display elements
        const currentEl = document.getElementById(`current-${id}`);
        const durationEl = document.getElementById(`duration-${id}`);

        const ws = WaveSurfer.create({
            container: `#wave-${id}`,
            waveColor: '#555',
            progressColor: '#800080',
            cursorColor: '#800080',
            cursorWidth: 3,
            url: audioUrl,
            barWidth: 3,
            barGap: 3,
            barRadius: 4,
            height: 80,
            responsive: true,
            normalize: true
        });

        // 1. When the file is loaded, show the total duration
        ws.on('ready', () => {
            durationEl.textContent = formatTime(ws.getDuration());
        });

        // 2. As it plays, update the current time
        ws.on('audioprocess', () => {
            currentEl.textContent = formatTime(ws.getCurrentTime());
        });

        // 3. If the user clicks the waveform to skip, update the time
        ws.on('interaction', () => {
            currentEl.textContent = formatTime(ws.getCurrentTime());
        });

        // Play/Pause logic
        const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
        const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

        ws.on('play', () => btn.innerHTML = pauseIcon);
        ws.on('pause', () => btn.innerHTML = playIcon);
        
        btn.onclick = () => ws.playPause();
    });
});
