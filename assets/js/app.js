import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.play-btn').forEach((btn) => {
        const audioUrl = btn.getAttribute('data-url');
        const id = btn.id.split('-')[1];

        const ws = WaveSurfer.create({
            container: `#wave-${id}`,
            waveColor: '#444',       // Darker gray for the unplayed part
            progressColor: '#800080', // Your Purple for the played part
            url: audioUrl,
            barWidth: 3,             // Slightly thicker bars look better with purple
            barGap: 3,
            barRadius: 4,
            height: 80,
            responsive: true,
            normalize: true
        });

        // Toggle Play/Pause logic
        btn.onclick = () => ws.playPause();

        // Optional: Change button icon based on state
        ws.on('play', () => {
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';
        });
        ws.on('pause', () => {
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="white"/></svg>';
        });
    });
});
