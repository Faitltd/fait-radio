document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  const app = {
    // Initialize core components
    windowManager: null,
    youtubePlayer: null,
    backgroundManager: null,
    radioWindow: null,
    adminPanel: null,
    mixtapesWindow: null,
    newsroomWindow: null,
    membersWindow: null,
    eventsWindow: null,
    socialWindow: null,
    vacationWindow: null,
    guestbookWindow: null,
    playlistMakerWindow: null,
    currentWindow: null, // Track current full-screen window

    init: function() {
      console.log('Starting FAIT Radio initialization...');

      // Check if required DOM elements exist
      if (!document.getElementById('content-area')) {
        console.error('Content area not found!');
        return;
      }

      if (!document.getElementById('dock-items')) {
        console.error('Dock items container not found!');
        return;
      }

      try {
        this.initializeComponents();
        this.setupClock();
        this.createDockItems();
        this.setupEventListeners();
        this.openDefaultWindow();
        console.log('FAIT Radio initialized successfully!');
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    },

    initializeComponents: function() {
      console.log('Initializing components...');

      // Clear any corrupted localStorage data if needed
      this.validateAndCleanStorage();

      // Initialize window manager
      this.windowManager = new WindowManager();
      console.log('Window manager initialized');

      // Initialize YouTube player
      this.youtubePlayer = new YouTubePlayer();
      console.log('YouTube player initialized');

      // Initialize background manager
      this.backgroundManager = new BackgroundManager();
      console.log('Background manager initialized');

      // Initialize radio window (but don't create it yet)
      this.radioWindow = new RadioWindow(
        this.windowManager,
        this.youtubePlayer,
        this.backgroundManager
      );
      console.log('Radio window initialized');

      // Initialize admin panel
      this.adminPanel = new AdminPanel(this.windowManager);
      console.log('Admin panel initialized');

      // Initialize additional windows (with error handling)
      try {
        if (typeof MixtapesWindow !== 'undefined') {
          this.mixtapesWindow = new MixtapesWindow(this.windowManager, this.youtubePlayer, this.backgroundManager);
          console.log('Mixtapes window initialized');
        } else {
          console.warn('MixtapesWindow class not available');
        }

        if (typeof NewsroomWindow !== 'undefined') {
          this.newsroomWindow = new NewsroomWindow(this.windowManager);
          console.log('Newsroom window initialized');
        } else {
          console.warn('NewsroomWindow class not available');
        }

        if (typeof MembersWindow !== 'undefined') {
          this.membersWindow = new MembersWindow(this.windowManager);
          console.log('Members window initialized');
        } else {
          console.warn('MembersWindow class not available');
        }

        if (typeof EventsWindow !== 'undefined') {
          this.eventsWindow = new EventsWindow(this.windowManager);
          console.log('Events window initialized');
        } else {
          console.warn('EventsWindow class not available');
        }

        if (typeof SocialWindow !== 'undefined') {
          this.socialWindow = new SocialWindow(this.windowManager);
          console.log('Social window initialized');
        } else {
          console.warn('SocialWindow class not available');
        }

        if (typeof VacationWindow !== 'undefined') {
          this.vacationWindow = new VacationWindow(this.windowManager);
          console.log('Vacation window initialized');
        } else {
          console.warn('VacationWindow class not available');
        }

        if (typeof GuestbookWindow !== 'undefined') {
          this.guestbookWindow = new GuestbookWindow(this.windowManager);
          console.log('Guestbook window initialized');
        } else {
          console.warn('GuestbookWindow class not available');
        }

        if (typeof PlaylistMakerWindow !== 'undefined') {
          this.playlistMakerWindow = new PlaylistMakerWindow(this.windowManager, this.youtubePlayer);
          console.log('Playlist Maker window initialized');
        } else {
          console.warn('PlaylistMakerWindow class not available');
        }

        console.log('Additional windows initialization completed');
      } catch (error) {
        console.error('Error initializing additional windows:', error);
      }
    },

    setupClock: function() {
      const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const clockElement = document.querySelector('#clock');
        if (clockElement) {
          clockElement.textContent = `${hours}:${minutes}`;
        }
      };

      updateClock();
      setInterval(updateClock, 60000);
    },

    createDockItems: function() {
      const dockItems = [
        { id: 'player', name: 'RADIO' },
        { id: 'mixtapes', name: 'TAPES' },
        { id: 'admin', name: 'ADMIN' },
        { id: 'playlist-maker', name: 'MAKER' }
      ];

      const dockList = document.getElementById('dock-items');

      dockItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<button id="dock-${item.id}">${item.name}</button>`;
        dockList.appendChild(li);

        // Add click event to open window
        li.querySelector('button').addEventListener('click', () => {
          this.openWindow(item.id);
        });
      });
    },

    setupEventListeners: function() {
      // Add global event listeners here
      console.log('Setting up retro game event listeners');

      // Add keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.altKey) {
          switch (e.key) {
            case '1':
              e.preventDefault();
              this.openWindow('player');
              break;
            case '2':
              e.preventDefault();
              this.openWindow('mixtapes');
              break;
            case '3':
              e.preventDefault();
              this.openWindow('admin');
              break;
            case '4':
              e.preventDefault();
              this.openWindow('playlist-maker');
              break;
          }
        }
      });
    },

    openDefaultWindow: function() {
      // Open the radio player window by default
      this.openWindow('player');
    },

    closeCurrentWindow: function() {
      if (this.currentWindow && this.currentWindow.close) {
        this.currentWindow.close();
      }
      this.currentWindow = null;
    },

    openWindow: function(windowId) {
      console.log(`🎮 Opening ${windowId} window...`);

      // Close current window first (full-screen mode)
      this.closeCurrentWindow();

      // Create window based on type
      switch(windowId) {
        case 'player':
          this.createRadioWindow();
          break;
        case 'admin':
          this.createAdminWindow();
          break;
        case 'newsroom':
          this.createNewsroomWindow();
          break;
        case 'mixtapes':
          this.createMixtapesWindow();
          break;
        case 'members':
          this.createMembersWindow();
          break;
        case 'events':
          this.createEventsWindow();
          break;
        case 'instagram':
          this.createInstagramWindow();
          break;
        case 'vacation':
          this.createVacationWindow();
          break;
        case 'guestbook':
          this.createGuestbookWindow();
          break;
        case 'playlist-maker':
          this.createPlaylistMakerWindow();
          break;
        case 'settings':
          this.createSettingsWindow();
          break;
        default:
          console.log(`Window type ${windowId} not implemented yet`);
      }
    },

    createRadioWindow: function() {
      console.log('Creating radio window...');
      try {
        // Use the RadioWindow class to create the radio player
        this.radioWindow.create();
        this.currentWindow = this.radioWindow;
        console.log('Radio window created successfully');
      } catch (error) {
        console.error('Error creating radio window:', error);
        // Fallback to basic window
        const windowOptions = {
          id: 'radio-player-fallback',
          title: 'Radio Player',
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          content: '<div class="placeholder">Radio player loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createAdminWindow: function() {
      console.log('Creating admin window...');
      try {
        this.adminPanel.create();
        this.currentWindow = this.adminPanel;
        console.log('Admin panel created successfully');
      } catch (error) {
        console.error('Error creating admin panel:', error);
        // Fallback to basic window
        const windowOptions = {
          id: 'admin-panel-fallback',
          title: 'Admin Panel',
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          content: '<div class="placeholder">Admin panel loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createNewsroomWindow: function() {
      console.log('Creating newsroom window...');
      try {
        this.newsroomWindow.create();
        console.log('Newsroom window created successfully');
      } catch (error) {
        console.error('Error creating newsroom window:', error);
        const windowOptions = {
          id: 'newsroom-fallback',
          title: 'Newsroom',
          width: 600,
          height: 400,
          content: '<div class="placeholder">Newsroom loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createMixtapesWindow: function() {
      console.log('Creating mixtapes window...');
      try {
        this.mixtapesWindow.create();
        this.currentWindow = this.mixtapesWindow;
        console.log('Mixtapes window created successfully');
      } catch (error) {
        console.error('Error creating mixtapes window:', error);
        const windowOptions = {
          id: 'mixtapes-fallback',
          title: 'Mixtapes',
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          content: '<div class="placeholder">Mixtapes loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createMembersWindow: function() {
      console.log('Creating members window...');
      try {
        this.membersWindow.create();
        console.log('Members window created successfully');
      } catch (error) {
        console.error('Error creating members window:', error);
        const windowOptions = {
          id: 'members-fallback',
          title: 'Members',
          width: 450,
          height: 300,
          content: '<div class="placeholder">Members loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createEventsWindow: function() {
      console.log('Creating events window...');
      try {
        this.eventsWindow.create();
        console.log('Events window created successfully');
      } catch (error) {
        console.error('Error creating events window:', error);
        const windowOptions = {
          id: 'events-fallback',
          title: 'Events',
          width: 550,
          height: 400,
          content: '<div class="placeholder">Events loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createInstagramWindow: function() {
      console.log('Creating social window...');
      try {
        this.socialWindow.create();
        console.log('Social window created successfully');
      } catch (error) {
        console.error('Error creating social window:', error);
        const windowOptions = {
          id: 'social-fallback',
          title: 'Social',
          width: 400,
          height: 500,
          content: '<div class="placeholder">Social feed loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createVacationWindow: function() {
      console.log('Creating vacation window...');
      try {
        this.vacationWindow.create();
        console.log('Vacation window created successfully');
      } catch (error) {
        console.error('Error creating vacation window:', error);
        const windowOptions = {
          id: 'vacation-fallback',
          title: 'Vacation',
          width: 600,
          height: 450,
          content: '<div class="placeholder">Vacation loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createGuestbookWindow: function() {
      console.log('Creating guestbook window...');
      try {
        this.guestbookWindow.create();
        console.log('Guestbook window created successfully');
      } catch (error) {
        console.error('Error creating guestbook window:', error);
        const windowOptions = {
          id: 'guestbook-fallback',
          title: 'Guestbook',
          width: 500,
          height: 400,
          content: '<div class="placeholder">Guestbook loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createPlaylistMakerWindow: function() {
      console.log('Creating playlist maker window...');
      try {
        this.playlistMakerWindow.create();
        this.currentWindow = this.playlistMakerWindow;
        console.log('Playlist maker window created successfully');
      } catch (error) {
        console.error('Error creating playlist maker window:', error);
        const windowOptions = {
          id: 'playlist-maker-fallback',
          title: 'Playlist Maker',
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
          content: '<div class="placeholder">Playlist maker loading...</div>'
        };
        this.windowManager.createWindow(windowOptions);
      }
    },

    createSettingsWindow: function() {
      const windowOptions = {
        id: 'settings',
        title: 'Settings',
        width: 400,
        height: 300,
        content: this.generateSettingsContent()
      };
      this.windowManager.createWindow(windowOptions);
    },

    validateAndCleanStorage: function() {
      try {
        // Check if radioStations data is corrupted
        const savedStations = localStorage.getItem('radioStations');
        if (savedStations) {
          const stations = JSON.parse(savedStations);

          // Validate the data structure
          if (!Array.isArray(stations)) {
            console.warn('Invalid stations data in localStorage, clearing...');
            localStorage.removeItem('radioStations');
            return;
          }

          // Check if stations have required properties
          const validStations = stations.filter(station =>
            station &&
            typeof station === 'object' &&
            station.id &&
            station.name &&
            station.youtubeId
          );

          if (validStations.length !== stations.length) {
            console.warn('Some stations have invalid data, cleaning...');
            localStorage.setItem('radioStations', JSON.stringify(validStations));
          }

          console.log('Found', validStations.length, 'valid stations in localStorage');
        }
      } catch (error) {
        console.error('Error validating localStorage, clearing:', error);
        localStorage.removeItem('radioStations');
      }
    },

    generateSettingsContent: function() {
      return `
        <div class="settings-panel">
          <h3>Background Settings</h3>
          <div class="setting-group">
            <label>
              <input type="checkbox" id="bg-enabled" ${this.backgroundManager.isEnabled ? 'checked' : ''}>
              Enable Background Videos
            </label>
          </div>
          <div class="setting-group">
            <label>Background Opacity:</label>
            <input type="range" id="bg-opacity" min="0" max="100" value="${this.backgroundManager.opacity * 100}">
          </div>

          <h3>Audio Settings</h3>
          <div class="setting-group">
            <label>Master Volume:</label>
            <input type="range" id="master-volume" min="0" max="100" value="${this.youtubePlayer.getVolume()}">
          </div>
        </div>
      `;
    },

    makeWindowDraggable: function(windowEl) {
      const header = windowEl.querySelector('.window-header');
      let isDragging = false;
      let offsetX, offsetY;

      header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - windowEl.getBoundingClientRect().left;
        offsetY = e.clientY - windowEl.getBoundingClientRect().top;
        this.bringToFront(windowEl);
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        windowEl.style.left = `${x}px`;
        windowEl.style.top = `${y}px`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    },

    bringToFront: function(windowEl) {
      // Get all windows and set their z-index to 1
      const windows = document.querySelectorAll('.window');
      windows.forEach(win => {
        win.style.zIndex = '1';
      });
      
      // Set the active window's z-index to 2
      windowEl.style.zIndex = '2';
    }
  };

  // Initialize the app
  app.init();

  // Make app globally accessible for admin panel testing
  window.app = app;
});