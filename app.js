import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

const myTracks = [
    { id: 1, title: "Solid State", file: "solid-state.mp3", art: "solid-state-cover.jpg" },
    { id: 2, title: "Ethereal", file: "ethereal.mp3", art: "ethereal-cover.jpg" },
    { id: 3, title: "The Nature of Miracles", file: "nature-of-miracles.mp3", art: "miracles-cover.jpg" },
    { id: 4, title: "A Stitch in Time", file: "stitch-in-time.mp3", art: "stitch-cover.jpg" }
];

const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

let activeWS = null;
const container = document.getElementById('tracks-container');

myTracks.forEach(track => {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.innerHTML = `
        <img src="./images/${track.art}" class="cover-art" alt="${track.title}">
        <div class="track-info">
            <div class="play-row">
                <button class="play-btn" id="btn-${track.id}">${playIcon}</button>
                <div>
                    <p class="artist-name">Electronic Dream Plant</p>
                    <h2 class="track-title">${track.title}</h2>
                </div>
            </div>
            <div id="wave-${track.id}" class="waveform-container"></div>
        </div>
    `;
    container.appendChild(card);

    const ws = WaveSurfer.create({
        container: `#wave-${track.id}`,
        waveColor: '#444',
        progressColor: '#f50',
        url: `./audio/${track.file}`,
        barWidth: 2,
        barGap: 1,
        height: 70,
    });

    const btn = document.getElementById(`btn-${track.id}`);
    
    ws.on('play', () => {
        if (activeWS && activeWS !== ws) activeWS.pause();
        activeWS = ws;
        btn.innerHTML = pauseIcon;
    });

    ws.on('pause', () => btn.innerHTML = playIcon);
    btn.onclick = () => ws.playPause();
});
