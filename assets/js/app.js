import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-btn').forEach((btn) => {
        const audioUrl = btn.getAttribute('data-url');
        const id = btn.id.split('-')[1];

        const ws = WaveSurfer.create({
            container: `#wave-${id}`,
            waveColor: '#555',       // The "unplayed" gray bars
            progressColor: '#800080', // YOUR PURPLE: The "played" bars
            cursorColor: '#800080',   // The vertical playhead line
            url: audioUrl,
            barWidth: 3,             
            barGap: 3,
            barRadius: 4,
            height: 100,
            responsive: true,
            normalize: true
        });

        // Icon management
        const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
        const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

        ws.on('play', () => btn.innerHTML = pauseIcon);
        ws.on('pause', () => btn.innerHTML = playIcon);
        
        btn.onclick = () => ws.playPause();
    });
});
