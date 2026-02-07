import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

// Track the currently playing instance globally
let activeWS = null;

// Define icons as constants to keep the logic clean
const playIcon = '<svg viewBox="0 0 24 24" width="24"><path d="M8 5v14l11-7z" fill="white"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" width="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="white"/></svg>';

// Wait for the DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
    
    // Find every play button Jekyll created in the loop
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach((btn) => {
        // 1. Get the path to the audio file from the button's data attribute
        const audioUrl = btn.getAttribute('data-url');
        
        // 2. Determine the unique ID (e.g., from btn-1, btn-2)
        const id = btn.id.split('-')[1];
        const containerSelector = `#wave-${id}`;

        // 3. Initialize the WaveSurfer instance for this track
        const ws = WaveSurfer.create({
            container: containerSelector,
            waveColor: '#555',       // Subtle gray for the unplayed wave
            progressColor: '#f50',    // SoundCloud Orange for the played part
            url: audioUrl,
            barWidth: 2,
            barGap: 2,
            barRadius: 2,
            height: 60,
            responsive: true,
            normalize: true           // Evens out the volume peaks visually
        });

        // --- EVENT LOGIC ---

        // Successfully loaded
        ws.on('ready', () => {
            console.log(`✅ Waveform ready: ${audioUrl}`);
        });

        // Failed to load (This is where your 404s will show up)
        ws.on('error', (err) => {
            console.error(`❌ WaveSurfer Error for ${audioUrl}:`, err);
            btn.style.opacity = "0.5";
            btn.title = "File not found";
        });

        // Global Switching Logic: Stop other tracks when this one plays
        ws.on('play', () => {
            if (activeWS && activeWS !== ws) {
                activeWS.pause();
            }
            activeWS = ws;
            btn.innerHTML = pauseIcon;
        });

        // Revert icon when paused
        ws.on('pause', () => {
            btn.innerHTML = playIcon;
        });

        // Click interaction
        btn.onclick = () => {
            ws.playPause();
        };
    });
});
