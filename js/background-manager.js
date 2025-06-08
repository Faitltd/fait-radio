class BackgroundManager {
  constructor() {
    this.currentVideo = null;
    this.videoElement = null;
    this.isEnabled = false; // Start disabled to prevent errors
    this.opacity = 0.3;
    this.hasVideoSupport = true;
    this.failedVideos = new Set(); // Track failed video URLs
    this.isLocalEnvironment = this.detectLocalEnvironment();

    this.initializeBackground();

    // Enable after a short delay to ensure everything is loaded
    setTimeout(() => {
      if (this.isLocalEnvironment) {
        console.log('Local environment detected - using static background only');
        this.hasVideoSupport = false;
        this.fallbackToStaticBackground();
      } else {
        this.isEnabled = true;
        console.log('Background video system ready');
      }
    }, 1000);
  }

  detectLocalEnvironment() {
    // Check if running from file:// protocol or localhost
    return window.location.protocol === 'file:' ||
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '';
  }
  
  initializeBackground() {
    // Create background video container
    const container = document.createElement('div');
    container.id = 'background-video-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
    `;
    
    // Create video element
    this.videoElement = document.createElement('video');
    this.videoElement.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: ${this.opacity};
      filter: blur(1px);
    `;
    this.videoElement.autoplay = true;
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    
    // Add video to container
    container.appendChild(this.videoElement);
    
    // Insert container as first child of desktop
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.insertBefore(container, desktop.firstChild);
    } else {
      document.body.appendChild(container);
    }
    
    // Set up event listeners
    this.videoElement.addEventListener('loadstart', () => {
      console.log('Background video loading...');
    });
    
    this.videoElement.addEventListener('canplay', () => {
      console.log('Background video ready to play');
      this.videoElement.playbackRate = 0.5; // Slow down for relaxing effect
    });
    
    this.videoElement.addEventListener('error', (e) => {
      // Only log errors for valid video sources (not empty src)
      if (this.videoElement.src && this.videoElement.src.trim() !== '' && this.videoElement.src !== window.location.href) {
        console.error('Background video failed to load:', this.videoElement.src);
        console.error('Error details:', e.target.error?.message || 'Unknown video error');
      }
      this.fallbackToStaticBackground();
    });
  }
  
  loadVideo(videoUrl) {
    if (!this.isEnabled || !this.videoElement || !this.hasVideoSupport) {
      return;
    }

    // Skip video loading in local environment
    if (this.isLocalEnvironment) {
      console.log('Local environment - skipping video load, using static background');
      this.fallbackToStaticBackground();
      return;
    }

    // Validate video URL
    if (!this.isValidVideoUrl(videoUrl)) {
      console.warn('Invalid background video URL provided:', videoUrl);
      this.fallbackToStaticBackground();
      return;
    }

    // Skip if this video has already failed
    if (this.failedVideos.has(videoUrl)) {
      console.log('Skipping previously failed video:', videoUrl);
      this.fallbackToStaticBackground();
      return;
    }

    console.log('Loading background video:', videoUrl);
    this.currentVideo = videoUrl;

    // Fade out current video
    this.fadeOut(() => {
      // Set up error handler for this specific load
      const errorHandler = (e) => {
        console.warn('Background video failed to load:', videoUrl);
        this.failedVideos.add(videoUrl); // Remember this failed URL
        this.fallbackToStaticBackground();
        this.videoElement.removeEventListener('error', errorHandler);

        // If too many videos fail, disable video support
        if (this.failedVideos.size >= 3) {
          console.warn('Multiple background videos failed, disabling video support');
          this.hasVideoSupport = false;
        }
      };

      const successHandler = () => {
        this.fadeIn();
        this.videoElement.removeEventListener('error', errorHandler);
        this.videoElement.removeEventListener('canplay', successHandler);
      };

      this.videoElement.addEventListener('error', errorHandler);
      this.videoElement.addEventListener('canplay', successHandler);

      // Load new video
      this.videoElement.src = videoUrl;
      this.videoElement.load();
    });
  }
  
  loadVideoForStation(station) {
    if (station && station.backgroundVideo && this.isValidVideoUrl(station.backgroundVideo)) {
      this.loadVideo(station.backgroundVideo);
    } else {
      console.log('No valid background video for station:', station?.name || 'unknown');
      this.fallbackToStaticBackground();
    }
  }

  isValidVideoUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const trimmed = url.trim();

    // Check if it's empty
    if (trimmed === '') {
      return false;
    }

    // Check if it's a valid URL (basic check)
    try {
      new URL(trimmed);
      return trimmed.startsWith('http://') || trimmed.startsWith('https://');
    } catch {
      return false;
    }
  }
  
  fadeOut(callback) {
    if (!this.videoElement) return;
    
    const startOpacity = parseFloat(this.videoElement.style.opacity) || this.opacity;
    const duration = 500; // ms
    const steps = 30;
    const stepTime = duration / steps;
    const opacityStep = startOpacity / steps;
    
    let currentStep = 0;
    
    const fade = () => {
      currentStep++;
      const newOpacity = startOpacity - (opacityStep * currentStep);
      this.videoElement.style.opacity = Math.max(0, newOpacity);
      
      if (currentStep < steps) {
        setTimeout(fade, stepTime);
      } else if (callback) {
        callback();
      }
    };
    
    fade();
  }
  
  fadeIn() {
    if (!this.videoElement) return;
    
    const targetOpacity = this.opacity;
    const duration = 500; // ms
    const steps = 30;
    const stepTime = duration / steps;
    const opacityStep = targetOpacity / steps;
    
    let currentStep = 0;
    this.videoElement.style.opacity = 0;
    
    const fade = () => {
      currentStep++;
      const newOpacity = opacityStep * currentStep;
      this.videoElement.style.opacity = Math.min(targetOpacity, newOpacity);
      
      if (currentStep < steps) {
        setTimeout(fade, stepTime);
      }
    };
    
    fade();
  }
  
  setOpacity(opacity) {
    this.opacity = Math.max(0, Math.min(1, opacity));
    if (this.videoElement) {
      this.videoElement.style.opacity = this.opacity;
    }
  }
  
  enable() {
    this.isEnabled = true;
    if (this.videoElement) {
      this.videoElement.style.display = 'block';
    }
  }
  
  disable() {
    this.isEnabled = false;
    if (this.videoElement) {
      this.videoElement.style.display = 'none';
    }
  }
  
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }
  
  fallbackToStaticBackground() {
    console.log('Using static background fallback');
    if (this.videoElement) {
      this.videoElement.style.display = 'none';
      this.videoElement.src = ''; // Clear the failed source
    }

    // Apply a synthwave gradient background as fallback
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.style.background = `
        linear-gradient(45deg,
          rgba(255, 20, 147, 0.1) 0%,
          rgba(138, 43, 226, 0.1) 50%,
          rgba(0, 255, 255, 0.1) 100%
        )
      `;
      desktop.style.backgroundSize = 'cover';
      console.log('Applied synthwave gradient background');
    }
  }
  
  // Preset video moods
  loadMoodVideo(mood) {
    const moodVideos = {
      relaxed: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
      urban: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/mp4',
      retro: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/mp4',
      peaceful: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/mp4'
    };
    
    if (moodVideos[mood]) {
      this.loadVideo(moodVideos[mood]);
    }
  }
  
  // Get random background video
  getRandomVideo() {
    if (window.backgroundVideoData && window.backgroundVideoData.length > 0) {
      const randomIndex = Math.floor(Math.random() * window.backgroundVideoData.length);
      return window.backgroundVideoData[randomIndex].url;
    }
    return null;
  }
  
  loadRandomVideo() {
    const randomVideo = this.getRandomVideo();
    if (randomVideo) {
      this.loadVideo(randomVideo);
    }
  }
  
  // Cleanup
  destroy() {
    if (this.videoElement) {
      this.videoElement.remove();
    }
    const container = document.getElementById('background-video-container');
    if (container) {
      container.remove();
    }
  }
}

// Export the manager
window.BackgroundManager = BackgroundManager;
