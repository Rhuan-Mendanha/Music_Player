// This function plays a music file from the path you give it
function playMusic(filePath) {
  // Create a new audio object using the file path
  const audio = new Audio(filePath);

  // Start playing the sound
  audio.play();
}

// This function stops the music that’s currently playing
function stopMusic() {
  // Look for the <audio> element on the page
  const audio = document.querySelector('audio');

  // If there is audio playing, pause it
  if (audio) audio.pause();
}

// When the user clicks the play button, start the music
document.getElementById('playButton').addEventListener('click', () => {
  // Replace this with the real path to your song file
  playMusic('path/to/music/file.mp3');
});
