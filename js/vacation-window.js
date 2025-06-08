class VacationWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
  }
  
  create() {
    const windowOptions = {
      id: 'vacation',
      title: 'FAIT Vacation Mode',
      width: 600,
      height: 450,
      x: 250,
      y: 150,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="vacation-container">
        <div class="vacation-header">
          <h2>🏖️ FAIT Vacation Mode</h2>
          <p>Take a break and let the music transport you to paradise</p>
        </div>
        
        <div class="vacation-content">
          <div class="vacation-scene">
            <div class="scene-container">
              <div class="sky">
                <div class="sun">☀️</div>
                <div class="clouds">
                  <span class="cloud">☁️</span>
                  <span class="cloud">☁️</span>
                  <span class="cloud">☁️</span>
                </div>
              </div>
              <div class="ocean">
                <div class="waves">🌊🌊🌊🌊🌊</div>
              </div>
              <div class="beach">
                <div class="palm-trees">🌴🌴🌴</div>
                <div class="beach-items">
                  <span class="item">🏖️</span>
                  <span class="item">🍹</span>
                  <span class="item">🕶️</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="vacation-controls">
            <h3>Vacation Vibes</h3>
            <div class="vibe-buttons">
              <button class="vibe-btn" data-vibe="tropical">🌺 Tropical</button>
              <button class="vibe-btn" data-vibe="beach">🏖️ Beach</button>
              <button class="vibe-btn" data-vibe="sunset">🌅 Sunset</button>
              <button class="vibe-btn" data-vibe="island">🏝️ Island</button>
            </div>
            
            <div class="vacation-playlist">
              <h4>Vacation Playlist</h4>
              <div class="playlist-items">
                <div class="playlist-item">
                  <span class="track-icon">🎵</span>
                  <span class="track-name">Tropical House Vibes</span>
                  <button class="btn-small play-track">▶</button>
                </div>
                <div class="playlist-item">
                  <span class="track-icon">🎵</span>
                  <span class="track-name">Beach Sunset Chill</span>
                  <button class="btn-small play-track">▶</button>
                </div>
                <div class="playlist-item">
                  <span class="track-icon">🎵</span>
                  <span class="track-name">Island Breeze</span>
                  <button class="btn-small play-track">▶</button>
                </div>
                <div class="playlist-item">
                  <span class="track-icon">🎵</span>
                  <span class="track-name">Ocean Waves Ambient</span>
                  <button class="btn-small play-track">▶</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="vacation-actions">
          <button class="btn-primary" id="start-vacation-btn">🏖️ Start Vacation Mode</button>
          <button class="btn-secondary" id="postcard-btn">📮 Send Postcard</button>
          <button class="btn-secondary" id="weather-btn">🌤️ Check Weather</button>
        </div>
        
        <div class="vacation-status" id="vacation-status">
          <p>Ready to escape? Click "Start Vacation Mode" to begin your musical journey!</p>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Vibe buttons
    this.windowElement.querySelectorAll('.vibe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setVibe(e.target.dataset.vibe);
        
        // Update active state
        this.windowElement.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Play track buttons
    this.windowElement.querySelectorAll('.play-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackName = e.target.parentElement.querySelector('.track-name').textContent;
        this.playTrack(trackName);
      });
    });
    
    // Action buttons
    this.windowElement.querySelector('#start-vacation-btn').addEventListener('click', () => {
      this.startVacationMode();
    });
    
    this.windowElement.querySelector('#postcard-btn').addEventListener('click', () => {
      this.sendPostcard();
    });
    
    this.windowElement.querySelector('#weather-btn').addEventListener('click', () => {
      this.checkWeather();
    });
    
    // Start animation
    this.startAnimation();
  }
  
  setVibe(vibe) {
    const status = this.windowElement.querySelector('#vacation-status');
    const vibeMessages = {
      tropical: '🌺 Tropical vibes activated! Feel the warm breeze and exotic rhythms.',
      beach: '🏖️ Beach mode on! Time for some sun, sand, and chill beats.',
      sunset: '🌅 Sunset ambiance set! Watch the colors dance with the music.',
      island: '🏝️ Island paradise mode! Escape to your own private getaway.'
    };
    
    status.innerHTML = `<p>${vibeMessages[vibe]}</p>`;
    
    // Change scene based on vibe
    this.updateScene(vibe);
  }
  
  updateScene(vibe) {
    const scene = this.windowElement.querySelector('.vacation-scene');
    scene.className = `vacation-scene ${vibe}-mode`;
    
    // Add some visual effects
    const sceneContainer = this.windowElement.querySelector('.scene-container');
    sceneContainer.style.filter = this.getVibeFilter(vibe);
  }
  
  getVibeFilter(vibe) {
    const filters = {
      tropical: 'hue-rotate(30deg) saturate(1.2)',
      beach: 'brightness(1.1) contrast(1.1)',
      sunset: 'hue-rotate(15deg) saturate(1.3) brightness(0.9)',
      island: 'hue-rotate(60deg) saturate(1.1)'
    };
    return filters[vibe] || 'none';
  }
  
  playTrack(trackName) {
    const status = this.windowElement.querySelector('#vacation-status');
    status.innerHTML = `<p>🎵 Now playing: ${trackName}</p>`;
    
    // In a real app, this would integrate with the music player
    setTimeout(() => {
      status.innerHTML = `<p>🎵 Enjoying ${trackName}... Let the vacation vibes flow!</p>`;
    }, 2000);
  }
  
  startVacationMode() {
    const btn = this.windowElement.querySelector('#start-vacation-btn');
    const status = this.windowElement.querySelector('#vacation-status');
    
    btn.textContent = '🏖️ Vacation Mode Active';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    status.innerHTML = `
      <p>🏖️ <strong>Vacation Mode Activated!</strong></p>
      <p>You are now in paradise. Relax and enjoy the music.</p>
      <div class="vacation-timer">
        <span id="vacation-time">00:00</span>
        <button class="btn-small" id="end-vacation-btn">End Vacation</button>
      </div>
    `;
    
    // Start vacation timer
    this.startVacationTimer();
    
    // Add end vacation listener
    this.windowElement.querySelector('#end-vacation-btn').addEventListener('click', () => {
      this.endVacationMode();
    });
  }
  
  startVacationTimer() {
    let seconds = 0;
    this.vacationInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const timeDisplay = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      
      const timeElement = this.windowElement.querySelector('#vacation-time');
      if (timeElement) {
        timeElement.textContent = timeDisplay;
      }
    }, 1000);
  }
  
  endVacationMode() {
    if (this.vacationInterval) {
      clearInterval(this.vacationInterval);
    }
    
    const btn = this.windowElement.querySelector('#start-vacation-btn');
    const status = this.windowElement.querySelector('#vacation-status');
    
    btn.textContent = '🏖️ Start Vacation Mode';
    btn.disabled = false;
    btn.style.opacity = '1';
    
    status.innerHTML = '<p>Welcome back from vacation! Hope you enjoyed your musical getaway.</p>';
  }
  
  sendPostcard() {
    const message = prompt('Send a vacation postcard!\n\nWhat message would you like to share?');
    if (message) {
      alert(`📮 Postcard sent!\n\n"${message}"\n\nFrom: FAIT Paradise\n\nYour friends will receive this musical postcard!`);
    }
  }
  
  checkWeather() {
    const weatherConditions = [
      '☀️ Sunny and perfect for beach vibes',
      '🌤️ Partly cloudy with gentle breezes',
      '🌅 Beautiful sunset colors in the sky',
      '🌺 Tropical paradise weather',
      '🏖️ Perfect beach day conditions'
    ];
    
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const status = this.windowElement.querySelector('#vacation-status');
    status.innerHTML = `<p>🌤️ <strong>Paradise Weather Report:</strong><br>${randomWeather}</p>`;
  }
  
  startAnimation() {
    // Animate clouds
    const clouds = this.windowElement.querySelectorAll('.cloud');
    clouds.forEach((cloud, index) => {
      cloud.style.animation = `float ${3 + index}s ease-in-out infinite`;
      cloud.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Animate waves
    const waves = this.windowElement.querySelector('.waves');
    if (waves) {
      waves.style.animation = 'wave 2s ease-in-out infinite';
    }
    
    // Animate sun
    const sun = this.windowElement.querySelector('.sun');
    if (sun) {
      sun.style.animation = 'glow 4s ease-in-out infinite';
    }
    
    // Add CSS animations
    this.addAnimationStyles();
  }
  
  addAnimationStyles() {
    if (document.querySelector('#vacation-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'vacation-animations';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes wave {
        0%, 100% { transform: translateX(0px); }
        50% { transform: translateX(5px); }
      }
      
      @keyframes glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
      }
      
      .vacation-scene {
        background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 50%, #F0E68C 100%);
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        min-height: 200px;
        position: relative;
        overflow: hidden;
      }
      
      .scene-container {
        position: relative;
        height: 100%;
      }
      
      .sky {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 60%;
      }
      
      .sun {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 24px;
      }
      
      .clouds {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
      }
      
      .cloud {
        display: inline-block;
        margin: 0 10px;
        font-size: 18px;
      }
      
      .ocean {
        position: absolute;
        bottom: 30%;
        left: 0;
        right: 0;
        height: 20%;
      }
      
      .waves {
        font-size: 16px;
        color: #4682B4;
      }
      
      .beach {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30%;
      }
      
      .palm-trees {
        position: absolute;
        bottom: 20px;
        left: 20px;
        font-size: 20px;
      }
      
      .beach-items {
        position: absolute;
        bottom: 10px;
        right: 20px;
      }
      
      .beach-items .item {
        display: inline-block;
        margin: 0 5px;
        font-size: 16px;
      }
    `;
    
    document.head.appendChild(style);
  }
}

window.VacationWindow = VacationWindow;
