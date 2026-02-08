import WaveSurfer from './wavesurfer.esm.js'

let activeWS = null;
let currentVolume = 0.7; // Global volume state

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.floor(seconds % 60);
    return `${minutes}:${secondsRemainder.toString().padStart(2, '0')}`;
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. MASTER VOLUME CONTROL
    const masterVol = document.getElementById('master-vol');
    if (masterVol) {
        masterVol.addEventListener('input', (e) => {
            currentVolume = e.target.value;
            if (activeWS) {
                activeWS.setVolume(currentVolume);
            }
        });
    }

    // Setting up the observer for Lazy Loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const btn = entry.target.querySelector('.play-btn');
                initWaveSurfer(btn);
                observer.unobserve(entry.target);
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
        volume: currentVolume, // Start every track at the master volume level
        fetchParams: { cache: 'default' }
    });

    const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

    ws.on('play', () => {
        // KILL ALL OTHER AUDIO: Stop any track that isn't this one
        if (activeWS && activeWS !== ws) {
            activeWS.stop(); // Snap back to start
        }

        // RESET ALL UI: Force every button on the page back to "Play" icon
        document.querySelectorAll('.play-btn').forEach(btnEl => {
            btnEl.innerHTML = playIcon;
        });

        // RESET ALL CLOCKS: Force every timer back to 0:00 except this one
        document.querySelectorAll('.current-time').forEach(timeEl => {
            timeEl.textContent = "0:00";
        });

        // SET ACTIVE: Set this track as the one and only active track
        activeWS = ws;
        activeWS.setVolume(currentVolume); // Ensure correct volume on start
        btn.innerHTML = pauseIcon;

        // UPDATE GLOW:
        document.querySelectorAll('.track-card').forEach(card => card.classList.remove('is-playing'));
        btn.closest('.track-card').classList.add('is-playing');
    });

    ws.on('pause', () => btn.innerHTML = playIcon);
    ws.on('ready', () => { if (durationEl) durationEl.textContent = formatTime(ws.getDuration()); });
    ws.on('timeupdate', (time) => { if (currentEl) currentEl.textContent = formatTime(time); });
    ws.on('interaction', () => { if (currentEl) currentEl.textContent = formatTime(ws.getCurrentTime()); });

    btn.onclick = () => ws.playPause();
}
