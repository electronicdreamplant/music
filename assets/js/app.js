import WaveSurfer from './wavesurfer.esm.js'

let activeWS = null;

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
};

document.addEventListener('DOMContentLoaded', () => {
    // Setting up the observer for Lazy Loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const btn = entry.target.querySelector('.play-btn');
                initWaveSurfer(btn);
                observer.unobserve(entry.target); // Only load it once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.track-card').forEach(card => observer.observe(card));
});

function initWaveSurfer(btn) {
    const audioUrl = btn.getAttribute('data-url');
    const id = btn.id.split('-')[1];
    const currentEl = document.getElementById(`current-${id}`);
    const durationEl = document.getElementById(`duration-${id}`);

    const ws = WaveSurfer.create({
        container: `#wave-${id}`,
        waveColor: '#555',
        progressColor: '#b366ff',
        cursorColor: '#b366ff',
        cursorWidth: 3,
        url: audioUrl,
        barWidth: 2,
        barGap: 2,
        barRadius: 4,
        height: 75,
        responsive: true,
        normalize: true,
        // Only fetch what's needed for the duration initially
        fetchParams: { cache: 'default' }
    });

    const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

    ws.on('play', () => {
        // 1. If another track is playing, stop it and snap back to 0:00
        if (activeWS && activeWS !== ws) {
            activeWS.stop(); // This resets the playhead

            // 2. Explicitly find the OLD button and reset its icon
            const oldId = activeWS.container.id.split('-')[1];
            const oldBtn = document.getElementById(`btn-${oldId}`);
            const oldCurrentEl = document.getElementById(`current-${oldId}`);

            if (oldBtn) oldBtn.innerHTML = playIcon; // Changes icon back to Triangle
            if (oldCurrentEl) oldCurrentEl.textContent = "0:00"; // Resets timer text
        }

        // 3. Set this track as the Active track and change its button to Pause
        activeWS = ws;
        btn.innerHTML = pauseIcon;

        // 4. Glow Logic: Toggle the CSS class
        document.querySelectorAll('.track-card').forEach(card => card.classList.remove('is-playing'));
        btn.closest('.track-card').classList.add('is-playing');
    });

    ws.on('pause', () => btn.innerHTML = playIcon);
    ws.on('ready', () => { if (durationEl) durationEl.textContent = formatTime(ws.getDuration()); });
    ws.on('timeupdate', (time) => { if (currentEl) currentEl.textContent = formatTime(time); });
    ws.on('interaction', () => { if (currentEl) currentEl.textContent = formatTime(ws.getCurrentTime()); });

    btn.onclick = () => ws.playPause();
}
