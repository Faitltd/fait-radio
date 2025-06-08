class YouTubePlayer {
  constructor() {
    this.player = null;
    this.currentStation = null;
    this.isPlaying = false;
    this.volume = 50;
    this.isReady = false;
    this.iframe = null;
    
    // Initialize YouTube API
    this.initializeYouTubeAPI();
  }
  
  initializeYouTubeAPI() {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      // Set up the callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        this.onAPIReady();
      };
    } else {
      this.onAPIReady();
    }
  }
  
  onAPIReady() {
    console.log('YouTube API Ready');
    this.isReady = true;
    
    // Create hidden iframe container if it doesn't exist
    if (!document.getElementById('youtube-container')) {
      const container = document.createElement('div');
      container.id = 'youtube-container';
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    
    // Trigger ready event
    this.dispatchEvent('ready');
  }
  
  loadStation(station) {
    if (!this.isReady) {
      console.warn('YouTube API not ready yet');
      return;
    }

    console.log('Loading station:', station.name, 'with YouTube content:', station.youtubeId);
    this.currentStation = station;

    // Parse YouTube content (could be video ID or playlist ID)
    console.log('Parsing YouTube content for station:', station.name, 'Content:', station.youtubeId);
    const contentInfo = this.parseYouTubeContent(station.youtubeId);
    if (!contentInfo.isValid) {
      console.error('Invalid YouTube content for station:', station.name);
      console.error('YouTube content provided:', station.youtubeId);
      console.error('Parse error:', contentInfo.error);
      this.dispatchEvent('error', {
        error: 'Invalid YouTube content: ' + contentInfo.error,
        station: station.name,
        content: station.youtubeId
      });
      return;
    }

    console.log('Parsed content:', contentInfo);

    // If player exists, try to load new content instead of destroying
    if (this.player && (this.player.loadVideoById || this.player.loadPlaylist)) {
      try {
        if (contentInfo.type === 'playlist') {
          console.log('Loading playlist in existing player:', contentInfo.playlistId);
          this.player.loadPlaylist({
            list: contentInfo.playlistId,
            listType: 'playlist',
            index: contentInfo.videoIndex || 0
          });
        } else {
          console.log('Loading video in existing player:', contentInfo.videoId);
          this.player.loadVideoById(contentInfo.videoId);
        }
        this.setVolume(this.volume);
        this.dispatchEvent('stationLoaded', { station: this.currentStation });
        return;
      } catch (error) {
        console.warn('Failed to load content in existing player, creating new player:', error);
      }
    }

    // Destroy existing player if it exists
    if (this.player) {
      try {
        this.player.destroy();
      } catch (error) {
        console.warn('Error destroying existing player:', error);
      }
    }

    // Ensure container exists
    let container = document.getElementById('youtube-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-container';
      container.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    // Create new player
    try {
      console.log('Creating new YouTube player for:', contentInfo);

      const playerConfig = {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0, // Disable autoplay initially to avoid restrictions
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          // Only set origin for non-local environments
          ...(window.location.protocol !== 'file:' && { origin: window.location.origin })
        },
        events: {
          onReady: (event) => {
            console.log('Player ready for station:', station.name);
            this.onPlayerReady(event);
          },
          onStateChange: (event) => {
            this.onPlayerStateChange(event);
          },
          onError: (event) => {
            this.onPlayerError(event);
          }
        }
      };

      // Set content based on type
      if (contentInfo.type === 'playlist') {
        playerConfig.playerVars.list = contentInfo.playlistId;
        playerConfig.playerVars.listType = 'playlist';
        if (contentInfo.videoIndex !== undefined) {
          playerConfig.playerVars.index = contentInfo.videoIndex;
        }
        // For playlists, we can optionally set a specific video as starting point
        if (contentInfo.videoId) {
          playerConfig.videoId = contentInfo.videoId;
        }
      } else {
        playerConfig.videoId = contentInfo.videoId;
      }

      this.player = new YT.Player('youtube-container', playerConfig);
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      this.dispatchEvent('error', { error: 'Failed to create player: ' + error.message });
    }
  }

  parseYouTubeContent(input) {
    if (!input || typeof input !== 'string') {
      return { isValid: false, error: 'Empty or invalid input' };
    }

    const trimmed = input.trim();

    // Check if it's a full YouTube URL
    const urlMatch = trimmed.match(/(?:youtube\.com\/watch\?|youtu\.be\/)([^&\n?#]+)/);
    if (urlMatch) {
      return this.parseYouTubeURL(trimmed);
    }

    // Check if it's a playlist ID (starts with PL, UU, LL, etc.)
    if (trimmed.match(/^(PL|UU|LL|FL|RD)[a-zA-Z0-9_-]+$/)) {
      return {
        isValid: true,
        type: 'playlist',
        playlistId: trimmed,
        original: input
      };
    }

    // Check if it's a video ID (11 characters, alphanumeric + - and _)
    if (trimmed.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return {
        isValid: true,
        type: 'video',
        videoId: trimmed,
        original: input
      };
    }

    return { isValid: false, error: 'Unrecognized format' };
  }

  parseYouTubeURL(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      const videoId = params.get('v');
      const playlistId = params.get('list');
      const index = params.get('index');

      if (playlistId) {
        const result = {
          isValid: true,
          type: 'playlist',
          playlistId: playlistId,
          original: url
        };

        if (videoId) {
          result.videoId = videoId;
        }

        if (index) {
          result.videoIndex = parseInt(index, 10);
        }

        return result;
      } else if (videoId) {
        return {
          isValid: true,
          type: 'video',
          videoId: videoId,
          original: url
        };
      }

      return { isValid: false, error: 'No video or playlist ID found in URL' };
    } catch (error) {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }
  
  onPlayerReady(event) {
    console.log('🎵 YouTube player ready, setting volume');
    this.setVolume(this.volume);

    // Don't auto-start playback - wait for user interaction
    console.log('✅ Player ready - waiting for user interaction to start playback');

    this.dispatchEvent('stationLoaded', { station: this.currentStation });
  }
  
  onPlayerStateChange(event) {
    const state = event.data;
    
    switch (state) {
      case YT.PlayerState.PLAYING:
        this.isPlaying = true;
        this.dispatchEvent('play');
        break;
      case YT.PlayerState.PAUSED:
        this.isPlaying = false;
        this.dispatchEvent('pause');
        break;
      case YT.PlayerState.ENDED:
        this.isPlaying = false;
        this.dispatchEvent('ended');
        break;
      case YT.PlayerState.BUFFERING:
        this.dispatchEvent('buffering');
        break;
    }
  }
  
  onPlayerError(event) {
    const errorCode = event.data;
    let errorMessage = 'Unknown error';
    let shouldTryFallback = false;

    switch (errorCode) {
      case 2:
        errorMessage = 'Invalid YouTube video ID';
        shouldTryFallback = true;
        break;
      case 5:
        errorMessage = 'Video cannot be played in HTML5 player';
        shouldTryFallback = true;
        break;
      case 100:
        errorMessage = 'Video not found or private';
        shouldTryFallback = true;
        break;
      case 101:
      case 150:
        errorMessage = 'Video owner does not allow embedding';
        shouldTryFallback = true;
        break;
      default:
        errorMessage = `YouTube error code: ${errorCode}`;
    }

    console.error('YouTube Player Error:', errorCode, '-', errorMessage);
    console.error('Current station:', this.currentStation?.name, 'YouTube ID:', this.currentStation?.youtubeId);

    // Try fallback stations if available and this isn't already a fallback attempt
    if (shouldTryFallback && window.stationData) {
      // List of fallback stations in order of preference
      const fallbackStations = ['test', 'chill', 'study'];

      for (const fallbackId of fallbackStations) {
        if (this.currentStation?.id !== fallbackId) {
          const fallbackStation = window.stationData.find(s => s.id === fallbackId);
          if (fallbackStation) {
            console.log(`🔄 Trying fallback to ${fallbackStation.name} due to embedding error`);
            setTimeout(() => {
              this.loadStation(fallbackStation);
            }, 1000);
            return;
          }
        }
      }

      console.warn('⚠️ No suitable fallback stations available');
    }

    this.dispatchEvent('error', {
      error: errorCode,
      message: errorMessage,
      station: this.currentStation
    });
  }
  
  play() {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    }
  }
  
  pause() {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }
  
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.player && this.player.setVolume) {
      this.player.setVolume(this.volume);
    }
    this.dispatchEvent('volumeChange', { volume: this.volume });
  }
  
  getVolume() {
    return this.volume;
  }
  
  getCurrentTime() {
    if (this.player && this.player.getCurrentTime) {
      return this.player.getCurrentTime();
    }
    return 0;
  }
  
  getDuration() {
    if (this.player && this.player.getDuration) {
      return this.player.getDuration();
    }
    return 0;
  }
  
  // Event system
  addEventListener(event, callback) {
    if (!this.eventListeners) {
      this.eventListeners = {};
    }
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }
  
  removeEventListener(event, callback) {
    if (this.eventListeners && this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(callback);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }
  
  dispatchEvent(event, data = {}) {
    if (this.eventListeners && this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        callback({ type: event, ...data });
      });
    }
  }
  
  // Cleanup
  destroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    this.currentStation = null;
    this.isPlaying = false;
    this.eventListeners = {};
  }
}

// Export the player
window.YouTubePlayer = YouTubePlayer;
