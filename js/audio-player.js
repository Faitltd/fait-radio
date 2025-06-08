class AudioPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
    this.isPlaying = false;
    this.volume = 0.8;
    
    // Set up audio event listeners
    this.audio.addEventListener('ended', this.onTrackEnded.bind(this));
    this.audio.addEventListener('error', this.onError.bind(this));
  }
  
  loadTrack(trackUrl, trackInfo) {
    this.currentTrack = trackInfo;
    this.audio.src = trackUrl;
    this.audio.load();
    
    // Update UI with track info
    this.updateTrackInfo(trackInfo);
  }
  
  play() {
    if (this.audio.src) {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          this.updatePlayButton();
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }
  
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  setVolume(value) {
    this.volume = value;
    this.audio.volume = value;
    // Update volume UI
    this.updateVolumeUI();
  }
  
  updateTrackInfo(trackInfo) {
    const titleElement = document.querySelector('.track-title');
    const artistElement = document.querySelector('.track-artist');
    
    if (titleElement && trackInfo.title) {
      titleElement.textContent = trackInfo.title;
    }
    
    if (artistElement && trackInfo.artist) {
      artistElement.textContent = trackInfo.artist;
    }
  }
  
  updatePlayButton() {
    const playButton = document.querySelector('.play-button');
    if (playButton) {
      if (this.isPlaying) {
        playButton.classList.add('playing');
      } else {
        playButton.classList.remove('playing');
      }
    }
  }
  
  updateVolumeUI() {
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
      volumeSlider.value = this.volume;
    }
  }
  
  onTrackEnded() {
    this.isPlaying = false;
    this.updatePlayButton();
    // Could implement auto-next track functionality here
  }
  
  onError(error) {
    console.error('Audio error:', error);
    this.isPlaying = false;
    this.updatePlayButton();
  }
}

// Export the player
window.AudioPlayer = AudioPlayer;