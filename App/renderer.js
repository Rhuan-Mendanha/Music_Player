document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  //Player controls (UI Elements)
  const selectFolderButton = document.getElementById("select-folder"); // Button to select the folder of audios
  const player = document.getElementById("player"); // The audio element
  const trackList = document.getElementById("track-list"); // The list of tracks
  const playPauseButton = document.getElementById("play-pause");// Play/pause button
  const nextTrackButton = document.getElementById("next-track");// Next trackbutton
  const prevTrackButton = document.getElementById("previous-track");// Previous track button
  const shuffleButton = document.getElementById("shuffle");// Shuffle mode
  const repeatButton = document.getElementById("repeat"); // Button to toggle repeat mode
  const themeToggle = document.getElementById("theme-toggle");// Button to toggle dark/light theme
  const trackTitle = document.getElementById("track-title");// Title of the current track
  const trackArtist = document.getElementById("track-artist");// Artist of the current track
  const visualizerCanvas = document.getElementById("visualizer"); //Visualizing audio
  const canvasContext = visualizerCanvas.getContext("2d"); // Waves animation

  // Setup variables for tracks, current track, and settings like shuffle and repeat
  let tracks = [];
  let currentTrackIndex = 0;
  let isShuffle = false;
  let isRepeat = false;

  // Audio player and effect
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Equalizer filters
  const bassFilter = audioContext.createBiquadFilter(); // Bass filter
  bassFilter.type = "lowshelf";
  bassFilter.frequency.value = 200;// Set frequency for the bass
  bassFilter.gain.value = 0; // Set the gain for the bass

  const midFilter = audioContext.createBiquadFilter();// Mid filter
  midFilter.type = "peaking";
  midFilter.frequency.value = 1000;// Set frequency for the mid
  midFilter.gain.value = 0; // Set the gain for the mid 

  const trebleFilter = audioContext.createBiquadFilter(); // Treble filter
  trebleFilter.type = "highshelf";
  trebleFilter.frequency.value = 3000;// Set frequency for the treble
  trebleFilter.gain.value = 0;// Set the gain for the treble

// Connecting the filters to audio player
  const sourceNode = audioContext.createMediaElementSource(player);
  sourceNode.connect(bassFilter);
  bassFilter.connect(midFilter);
  midFilter.connect(trebleFilter);
  trebleFilter.connect(analyser);
  analyser.connect(audioContext.destination);// Connect to output destination

  // Updating the theme icon (light and dark mode)
  function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-theme") ? "🌞" : "🌙";
  }

//Change theme when button is clicked
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
    updateThemeIcon();
  });

  // Open folder  to select file with audios 
  selectFolderButton.addEventListener("click", async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      tracks = [];

      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(mp3|wav|ogg)$/i)) {
          const file = await entry.getFile();
          const url = URL.createObjectURL(file);
          tracks.push({ file, name: file.name, url });
        }
      }

      displayTracks();
      if (tracks.length > 0) {
        currentTrackIndex = 0;
        playTrack(currentTrackIndex);
      }
    } catch (err) {
      console.error("Error selecting folder:", err);
    }
  });

// Show tracks in the UI
  function displayTracks() {
    trackList.innerHTML = "";
    tracks.forEach((track, index) => {
      const trackElement = document.createElement("div");
      trackElement.className = "track";
      trackElement.textContent = track.name;
      trackElement.addEventListener("click", () => {
        currentTrackIndex = index;
        playTrack(index);
      });
      trackList.appendChild(trackElement);
    });
  }

 // Show tracks in the UI
  function playTrack(index) {
    const track = tracks[index];
    if (!track) return;

    console.log("Playing track:", track.name);
    player.src = track.url;
    trackTitle.textContent = track.name;
    trackArtist.textContent = "Unknown Artist";

    player.play();
    if (audioContext.state === "suspended") audioContext.resume();
  }

 // Play or pause the music when the button is clicked
  playPauseButton.addEventListener("click", () => {
    player.paused ? player.play() : player.pause();
  });

 // Play or pause the music when the button is clicked
  nextTrackButton.addEventListener("click", () => {
    currentTrackIndex = isShuffle
      ? Math.floor(Math.random() * tracks.length)
      : (currentTrackIndex + 1) % tracks.length;
    playTrack(currentTrackIndex);
  });
// Play the previous track when the button is clicked
  prevTrackButton.addEventListener("click", () => {
    currentTrackIndex =
      (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(currentTrackIndex);
  });
// Shuffle mode
  shuffleButton.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleButton.classList.toggle("active", isShuffle);
    shuffleButton.style.border = isShuffle ? "2px solid limegreen" : "none";
  });
// Repeat button
  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatButton.classList.toggle("active", isRepeat);
    repeatButton.style.border = isRepeat ? "2px solid limegreen" : "none";
  });
 // Go to the next track or repeat the current one
  player.addEventListener("ended", () => {
    isRepeat ? playTrack(currentTrackIndex) : nextTrackButton.click();
  });

  // Visualizer
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

    const barWidth = (visualizerCanvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      canvasContext.fillRect(
        x,
        visualizerCanvas.height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }

    //  Draw waveform on top of the bars
    analyser.getByteTimeDomainData(dataArray);
    canvasContext.beginPath();
    const sliceWidth = visualizerCanvas.width / bufferLength;
    let drawX = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * visualizerCanvas.height) / 2;
      if (i === 0) {
        canvasContext.moveTo(drawX, y);
      } else {
        canvasContext.lineTo(drawX, y);
      }
      drawX += sliceWidth;
    }

    canvasContext.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
    canvasContext.strokeStyle = "#00ff99";
    canvasContext.lineWidth = 2;
    canvasContext.stroke();
  }

  drawVisualizer(); // Start the visualizer loop

  // Equalizer buttons
  const eqBassButton = document.getElementById("eq-bass");
  const eqBoomButton = document.getElementById("eq-boom");
  const eqTrebleButton = document.getElementById("eq-treble");
// Apply different equalizer pre-sets when buttons are clicked
  eqBassButton.addEventListener("click", () => applyEqualizerPreset("bass"));
  eqBoomButton.addEventListener("click", () => applyEqualizerPreset("boom"));
  eqTrebleButton.addEventListener("click", () => applyEqualizerPreset("treble"));
 // Set the equalizer effect based one was selected 
  function applyEqualizerPreset(preset) {
    bassFilter.gain.value = 0;
    midFilter.gain.value = 0;
    trebleFilter.gain.value = 0;
    resetButtonOutlines();

    if (preset === "bass") {
      bassFilter.gain.value = 8;
      eqBassButton.style.border = "2px solid limegreen";
    } else if (preset === "boom") {
      bassFilter.gain.value = 10;
      trebleFilter.gain.value = 6;
      eqBoomButton.style.border = "2px solid limegreen";
    } else if (preset === "treble") {
      trebleFilter.gain.value = 10;
      eqTrebleButton.style.border = "2px solid limegreen";
    }
  }
 //Reset button borders to default
  function resetButtonOutlines() {
    eqBassButton.style.border = "none";
    eqBoomButton.style.border = "none";
    eqTrebleButton.style.border = "none";
  }

  document.body.classList.add("light-theme"); // Default to light theme
  updateThemeIcon();// and update the icon
  console.log("Renderer.js initialized successfully.");

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
      case "k": // Spacebar or K for play/pause
        playPauseButton.click();
        break;
      case "ArrowRight":
      case "l": // Right arrow or L for next track
        nextTrackButton.click();
        break;
      case "ArrowLeft":
      case "j": // Left arrow or J for previous track
        prevTrackButton.click();
        break;
      case "s": // S for shuffle
        shuffleButton.click();
        break;
      case "r": // R for repeat
        repeatButton.click();
        break;
      case "t": // T for theme toggle (dark/light)
        themeToggle.click();
        break;
      default:
        break;
    }
  });
});
