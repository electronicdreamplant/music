import WaveSurfer from './wavesurfer.esm.js'

let activeWS = null;
let currentVolume = 0.5; // Set a default starting volume
const allWaveSurfers = []; // Array to track all instances for volume control

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
            currentVolume = e.target.value / 100; // Convert 0-100 slider to 0-1

            // Update every track that has been initialized so far
            allWaveSurfers.forEach(ws => {
                if (ws) ws.setVolume(currentVolume);
            });
        });
    }

    // 2. LAZY LOADING OBSERVER
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const btn = entry.target.querySelector('.play-btn');
                if (btn) {
                    initWaveSurfer(btn);
                }
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
    const currentCard = btn.closest('.track-card');

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
        height: 60, // Matches your updated CSS height
        responsive: true,
        normalize: true,
        volume: currentVolume, // Uses the current slider position
        fetchParams: { cache: 'default' }
    });

    // Add this instance to our global list
    allWaveSurfers.push(ws);

    const playIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M8 5v14l11-7z" fill="white"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24" width="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

    ws.on('play', () => {
        // Stop any other track currently playing
        if (activeWS && activeWS !== ws) {
            activeWS.stop();
        }

        // Reset all buttons to Play
        document.querySelectorAll('.play-btn').forEach(btnEl => {
            btnEl.innerHTML = playIcon;
        });

        activeWS = ws;
        btn.innerHTML = pauseIcon;

        // Highlight the current card
        document.querySelectorAll('.track-card').forEach(card => card.classList.remove('is-playing'));
        currentCard.classList.add('is-playing');
    });

    // AUTO-PLAY NEXT LOGIC
    ws.on('finish', () => {
        btn.innerHTML = playIcon;
        currentCard.classList.remove('is-playing');

        const nextCard = currentCard.nextElementSibling;
        if (nextCard && nextCard.classList.contains('track-card')) {
            const nextBtn = nextCard.querySelector('.play-btn');
            if (nextBtn) {
                setTimeout(() => {
                    nextBtn.click();
                }, 100);
            }
        } else {
            activeWS = null;
        }
    });

    ws.on('pause', () => btn.innerHTML = playIcon);

    ws.on('ready', () => {
        if (durationEl) durationEl.textContent = formatTime(ws.getDuration());
    });

    ws.on('timeupdate', (time) => {
        if (currentEl) currentEl.textContent = formatTime(time);
    });

    ws.on('interaction', () => {
        if (currentEl) currentEl.textContent = formatTime(ws.getCurrentTime());
    });

    btn.onclick = () => ws.playPause();
}
