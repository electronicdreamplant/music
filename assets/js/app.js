import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

let activeWS = null;
const playIcon = '<svg viewBox="0 0 24 24" width="24"><path d="M8 5v14l11-7z" fill="white"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" width="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-btn').forEach((btn) => {
        const audioUrl = btn.getAttribute('data-url');
        const id = btn.id.split('-')[1];

        const ws = WaveSurfer.create({
            container: `#wave-${id}`,
            waveColor: '#555',
            progressColor: '#f50',
            url: audioUrl,
            barWidth: 2,
            height: 60,
            responsive: true
        });

        ws.on('play', () => {
            if (activeWS && activeWS !== ws) activeWS.pause();
            activeWS = ws;
            btn.innerHTML = pauseIcon;
        });

        ws.on('pause', () => { btn.innerHTML = playIcon; });
        btn.onclick = () => ws.playPause();

        // Error logging to find the EXACT broken link
        ws.on('error', (err) => console.error("WaveSurfer failed to load:", audioUrl));
    });
});
