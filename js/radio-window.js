class RadioWindow {
  constructor(windowManager, youtubePlayer, backgroundManager) {
    this.windowManager = windowManager;
    this.youtubePlayer = youtubePlayer;
    this.backgroundManager = backgroundManager;
    this.currentStation = null;
    this.windowElement = null;
    this.isMinimized = false;
    this.hasUserInteracted = false; // Track if user has interacted with player
    this.wasPlayingBeforeStationChange = false; // Track if music was playing before station change

    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Listen to YouTube player events
    this.youtubePlayer.addEventListener('play', () => {
      this.updatePlayButton(true);
      this.updateStatus('Playing');
    });

    this.youtubePlayer.addEventListener('pause', () => {
      this.updatePlayButton(false);
      this.updateStatus('Paused');
    });

    this.youtubePlayer.addEventListener('stationLoaded', (event) => {
      this.updateStationInfo(event.station);
      this.updateStatus('Ready');
    });

    this.youtubePlayer.addEventListener('volumeChange', (event) => {
      this.updateVolumeSlider(event.volume);
    });

    this.youtubePlayer.addEventListener('buffering', () => {
      this.updateStatus('Buffering...');
    });

    this.youtubePlayer.addEventListener('error', (event) => {
      console.error('Radio player error:', event);
      this.updateStatus('Error: ' + (event.message || 'Playback failed'));
      this.updatePlayButton(false);
    });
  }
  
  create() {
    console.log('Creating radio window...');

    const windowOptions = {
      id: 'radio-player',
      title: 'FAIT FM RADIO STATION',
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
      content: this.generateContent()
    };

    this.windowElement = this.windowManager.createWindow(windowOptions);

    if (!this.windowElement) {
      console.error('Failed to create radio window element');
      return null;
    }

    try {
      this.setupWindowControls();
      this.setupYouTubePlayerEvents();
      this.loadDefaultStation();
      console.log('Radio window created successfully');
    } catch (error) {
      console.error('Error setting up radio window:', error);
    }

    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="radio-player">
        <div class="radio-header">
          <div class="station-logo">FM</div>
          <div class="station-info">
            <h2 class="station-name">FAIT FM</h2>
            <p class="station-description">SELECT STATION TO START</p>
          </div>
        </div>

        <div class="radio-controls">
          <div class="playback-section">
            <button class="play-btn" id="radio-play-btn">
              <span class="play-icon">PLAY</span>
              <span class="pause-icon" style="display: none;">STOP</span>
            </button>
          </div>

          <div class="station-selector">
            <label for="station-select">STATION SELECT</label>
            <select id="station-select">
              <option value="">CHOOSE STATION...</option>
            </select>
          </div>

          <div class="volume-section">
            <label for="radio-volume">VOLUME CONTROL</label>
            <input type="range" class="volume-slider" id="radio-volume"
                   min="0" max="100" value="50">
          </div>
        </div>

        <div class="radio-status">
          <p class="status-text">READY TO ROCK</p>
        </div>
      </div>
    `;
  }
  
  setupWindowControls() {
    if (!this.windowElement) return;
    
    // Play/Pause button
    const playBtn = this.windowElement.querySelector('#radio-play-btn');
    playBtn.addEventListener('click', () => {
      console.log('🎵 Play button clicked');

      // Mark that user has interacted with the player
      this.hasUserInteracted = true;

      // Handle autoplay restrictions by requiring user interaction
      if (!this.youtubePlayer.isPlaying) {
        console.log('🎵 Starting playback via user interaction');
        this.youtubePlayer.play();
        this.updateStatus('🎵 Starting playback...');
      } else {
        console.log('⏸️ Pausing playback');
        this.youtubePlayer.pause();
        this.updateStatus('⏸️ Paused');
      }
    });
    
    // Volume slider
    const volumeSlider = this.windowElement.querySelector('#radio-volume');
    volumeSlider.addEventListener('input', (e) => {
      this.youtubePlayer.setVolume(parseInt(e.target.value));
    });
    
    // Station selector
    const stationSelect = this.windowElement.querySelector('#station-select');
    this.populateStationSelector(stationSelect);
    stationSelect.addEventListener('change', (e) => {
      console.log('🎵 Station selector changed:', e.target.value);
      if (e.target.value) {
        // Track if music was playing before station change
        this.wasPlayingBeforeStationChange = this.youtubePlayer.isPlaying;
        console.log('🎵 Was playing before station change:', this.wasPlayingBeforeStationChange);

        this.updateStatus('Loading station...');
        this.loadStation(e.target.value);
      } else {
        console.warn('No station value selected');
        this.updateStatus('No station selected');
      }
    });

    // Listen for station updates from admin panel
    stationSelect.addEventListener('stationsUpdated', () => {
      this.populateStationSelector(stationSelect);
    });
  }

  setupYouTubePlayerEvents() {
    if (!this.youtubePlayer) {
      console.error('❌ YouTube player not available for event setup');
      return;
    }

    // Listen for station loaded events
    this.youtubePlayer.addEventListener('stationLoaded', (event) => {
      console.log('✅ Station loaded successfully:', event.station?.name);

      // Auto-start playback if user was previously playing music and has interacted with player
      if (this.hasUserInteracted && this.wasPlayingBeforeStationChange) {
        console.log('🎵 Auto-starting playback after station change');
        setTimeout(() => {
          this.youtubePlayer.play();
        }, 500); // Small delay to ensure player is ready
        this.updateStatus('🎵 Playing: ' + (event.station?.name || 'Unknown'));
        this.updatePlayButton(true);
      } else {
        this.updateStatus('🎵 Ready: ' + (event.station?.name || 'Unknown'));
        this.updatePlayButton(false);
      }

      // Reset the flag
      this.wasPlayingBeforeStationChange = false;
    });

    // Listen for play events
    this.youtubePlayer.addEventListener('play', () => {
      console.log('▶️ Playback started');
      this.updatePlayButton(true);
      this.updateStatus('🎵 Playing');
    });

    // Listen for pause events
    this.youtubePlayer.addEventListener('pause', () => {
      console.log('⏸️ Playback paused');
      this.updatePlayButton(false);
      this.updateStatus('⏸️ Paused');
    });

    // Listen for buffering events
    this.youtubePlayer.addEventListener('buffering', () => {
      console.log('⏳ Buffering...');
      this.updateStatus('⏳ Buffering...');
    });

    // Listen for error events
    this.youtubePlayer.addEventListener('error', (event) => {
      console.error('❌ YouTube player error:', event);
      console.error('❌ Current station:', this.currentStation?.name, 'YouTube ID:', this.currentStation?.youtubeId);

      // Show more specific error messages
      let errorMessage = 'Playback failed';
      if (event.message) {
        errorMessage = event.message;
      } else if (event.error) {
        switch (event.error) {
          case 101:
          case 150:
            errorMessage = 'Video embedding not allowed - trying fallback';
            break;
          case 100:
            errorMessage = 'Video not found - trying fallback';
            break;
          case 2:
            errorMessage = 'Invalid video ID - trying fallback';
            break;
          default:
            errorMessage = `Error code ${event.error}`;
        }
      }

      this.updateStatus('❌ Error: ' + errorMessage);
      this.updatePlayButton(false);
    });

    // Listen for volume change events
    this.youtubePlayer.addEventListener('volumeChange', (event) => {
      console.log('🔊 Volume changed:', event.volume);
      this.updateVolumeSlider(event.volume);
    });

    // Listen for ended events
    this.youtubePlayer.addEventListener('ended', () => {
      console.log('🔚 Playback ended');
      this.updatePlayButton(false);
      this.updateStatus('🔚 Ended');
    });

    console.log('✅ YouTube player events set up successfully');
  }

  populateStationSelector(selectElement) {
    // Get stations from localStorage if available, otherwise use default
    let stations = window.stationData;
    const savedStations = localStorage.getItem('radioStations');
    if (savedStations) {
      try {
        stations = JSON.parse(savedStations);
        // Update global station data
        window.stationData = stations;
      } catch (error) {
        console.error('Error loading saved stations:', error);
      }
    }

    if (!stations) return;

    // Clear existing options except the first one
    selectElement.innerHTML = '<option value="">Choose Station...</option>';

    // Add station options
    stations.forEach(station => {
      const option = document.createElement('option');
      option.value = station.id;
      option.textContent = station.name;
      selectElement.appendChild(option);
    });
  }
  
  loadStation(stationId) {
    console.log('🎵 Radio window loading station:', stationId);
    console.log('📊 Current station data:', window.stationData);

    // Ensure we have valid station data
    if (!window.stationData || !Array.isArray(window.stationData)) {
      console.error('❌ Invalid or missing station data');
      console.error('Station data type:', typeof window.stationData);
      console.error('Station data value:', window.stationData);
      this.updateStatus('❌ No station data available');
      return;
    }

    console.log(`📋 Available stations: ${window.stationData.length}`);

    // Get current stations (might be updated from admin panel)
    let stations = [...window.stationData]; // Create a copy
    const savedStations = localStorage.getItem('radioStations');
    if (savedStations) {
      try {
        const parsed = JSON.parse(savedStations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          stations = parsed;
          window.stationData = stations;
          console.log('Loaded', stations.length, 'stations from localStorage');
        }
      } catch (error) {
        console.error('Error loading saved stations:', error);
        // Use default stations if localStorage is corrupted
        stations = window.stationData;
      }
    }

    console.log('Available stations:', stations.map(s => `${s.name} (${s.id})`));

    const station = stations.find(s => s.id === stationId);
    if (!station) {
      console.error('❌ Station not found:', stationId);
      console.error('📋 Available stations:', stations.map(s => `${s.name} (${s.id})`));
      this.updateStatus('❌ Station not found - loading default');

      // Try to load the first available station as fallback
      if (stations.length > 0) {
        console.log('🔄 Loading first available station as fallback:', stations[0].name);
        this.loadStation(stations[0].id);
      } else {
        console.error('❌ No stations available for fallback');
        this.updateStatus('❌ No stations available');
      }
      return;
    }

    console.log('✅ Station found:', station.name, 'YouTube ID:', station.youtubeId);

    // Validate station has required properties
    if (!station.name) {
      console.error('Station missing name:', station);
      this.updateStatus('Invalid station data');
      return;
    }

    console.log('🎵 Found station:', station.name, 'YouTube ID:', station.youtubeId);
    this.currentStation = station;
    this.updateStatus('🔄 Loading...');

    // Validate station data
    if (!station.youtubeId || station.youtubeId.trim() === '') {
      console.error('❌ Station has no YouTube ID:', station.name);
      this.updateStatus('❌ Error: No YouTube ID');
      return;
    }

    // Check if YouTube player is available and ready
    if (!this.youtubePlayer) {
      console.error('❌ YouTube player not available');
      this.updateStatus('❌ YouTube player not available');
      return;
    }

    if (!this.youtubePlayer.isReady) {
      console.warn('⚠️ YouTube player not ready yet, waiting...');
      this.updateStatus('⚠️ YouTube player not ready');

      // Wait for player to be ready
      this.youtubePlayer.addEventListener('ready', () => {
        console.log('✅ YouTube player ready, retrying station load');
        this.loadStation(station.id);
      });
      return;
    }

    // Load station in YouTube player
    try {
      console.log('🎵 Calling YouTube player loadStation...');
      this.youtubePlayer.loadStation(station);
      console.log('✅ YouTube player loadStation called successfully');
      this.updateStatus('🎵 Loading station...');
    } catch (error) {
      console.error('❌ Error loading station in YouTube player:', error);
      this.updateStatus('❌ Error loading station: ' + error.message);
      return;
    }

    // Load background video
    this.backgroundManager.loadVideoForStation(station);

    // Update UI
    this.updateStationInfo(station);
  }
  
  loadDefaultStation() {
    console.log('Loading default station...');

    // Ensure we have station data
    if (!window.stationData || window.stationData.length === 0) {
      console.error('No station data available');
      this.updateStatus('No stations available');
      return;
    }

    // Find the default station (fait)
    let defaultStation = window.stationData.find(s => s.id === 'fait');

    // If 'fait' doesn't exist, use the first available station
    if (!defaultStation) {
      defaultStation = window.stationData[0];
      console.warn('Default station "fait" not found, using first available:', defaultStation.name);
    }

    console.log('Default station selected:', defaultStation.name, 'ID:', defaultStation.id);

    // Wait for YouTube API to be ready
    if (this.youtubePlayer.isReady) {
      this.loadStation(defaultStation.id);
    } else {
      this.youtubePlayer.addEventListener('ready', () => {
        this.loadStation(defaultStation.id);
      });
    }
  }
  
  updateStationInfo(station) {
    if (!this.windowElement || !station) return;
    
    const stationName = this.windowElement.querySelector('.station-name');
    const stationDesc = this.windowElement.querySelector('.station-description');
    const stationSelect = this.windowElement.querySelector('#station-select');
    
    if (stationName) stationName.textContent = station.name;
    if (stationDesc) stationDesc.textContent = station.description;
    if (stationSelect) stationSelect.value = station.id;
    
    this.updateStatus('Playing');
  }
  
  updatePlayButton(isPlaying) {
    if (!this.windowElement) return;
    
    const playIcon = this.windowElement.querySelector('.play-icon');
    const pauseIcon = this.windowElement.querySelector('.pause-icon');
    
    if (isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'inline';
    } else {
      playIcon.style.display = 'inline';
      pauseIcon.style.display = 'none';
    }
  }
  
  updateVolumeSlider(volume) {
    if (!this.windowElement) return;
    
    const volumeSlider = this.windowElement.querySelector('#radio-volume');
    if (volumeSlider) {
      volumeSlider.value = volume;
    }
  }
  
  updateStatus(status) {
    if (!this.windowElement) return;
    
    const statusText = this.windowElement.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = status;
    }
  }
  
  updateBackgroundToggle() {
    if (!this.windowElement) return;
    
    const bgToggle = this.windowElement.querySelector('#bg-toggle');
    const bgText = this.windowElement.querySelector('.bg-text');
    
    if (this.backgroundManager.isEnabled) {
      bgToggle.classList.add('active');
      bgText.textContent = 'Background ON';
    } else {
      bgToggle.classList.remove('active');
      bgText.textContent = 'Background OFF';
    }
  }
  
  minimize() {
    if (this.windowElement) {
      this.windowElement.style.display = 'none';
      this.isMinimized = true;
    }
  }
  
  restore() {
    if (this.windowElement) {
      this.windowElement.style.display = 'block';
      this.isMinimized = false;
    }
  }
  
  close() {
    if (this.windowElement) {
      this.windowElement.remove();
      this.windowElement = null;
    }
  }
  
  // Get current station info for external use
  getCurrentStation() {
    return this.currentStation;
  }
  
  // Check if radio is playing
  isPlaying() {
    return this.youtubePlayer.isPlaying;
  }
}

// Export the radio window
window.RadioWindow = RadioWindow;
