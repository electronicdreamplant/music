import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

let activeWS = null;
const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

document.querySelectorAll('.play-btn').forEach((btn, index) => {
    const audioUrl = btn.getAttribute('data-url');
    const waveId = `#wave-${index + 1}`;

    const ws = WaveSurfer.create({
        container: waveId,
        waveColor: '#444',
        progressColor: '#f50',
        url: audioUrl,
        barWidth: 2,
        height: 60
    });

    ws.on('play', () => {
        if (activeWS && activeWS !== ws) activeWS.pause();
        activeWS = ws;
        btn.innerHTML = pauseIcon;
    });

    ws.on('pause', () => btn.innerHTML = playIcon);
    btn.onclick = () => ws.playPause();
});
