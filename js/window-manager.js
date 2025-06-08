class WindowManager {
  constructor() {
    this.windows = [];
    this.activeWindow = null;
    this.zIndexCounter = 100;
  }
  
  createWindow(options) {
    const defaults = {
      id: 'window-' + Date.now(),
      title: 'Window',
      content: '',
      width: 600,
      height: 400,
      x: 50,
      y: 50,
      resizable: true,
      closable: true,
      minimizable: true,
      maximizable: true
    };
    
    const windowOptions = { ...defaults, ...options };
    
    // Create window element
    const windowEl = document.createElement('div');
    windowEl.id = windowOptions.id;
    windowEl.className = 'window';
    windowEl.style.width = windowOptions.width + 'px';
    windowEl.style.height = windowOptions.height + 'px';
    windowEl.style.left = windowOptions.x + 'px';
    windowEl.style.top = windowOptions.y + 'px';
    
    // Create window structure
    windowEl.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          ${windowOptions.closable ? '<button class="window-close"></button>' : ''}
          ${windowOptions.minimizable ? '<button class="window-minimize"></button>' : ''}
          ${windowOptions.maximizable ? '<button class="window-maximize"></button>' : ''}
        </div>
        <div class="window-title">${windowOptions.title}</div>
      </div>
      <div class="window-content">
        ${windowOptions.content}
      </div>
    `;
    
    // Add to DOM
    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
      console.error('Content area not found! Cannot create window.');
      return null;
    }
    contentArea.appendChild(windowEl);
    
    // Setup event handlers
    this.setupWindowEvents(windowEl, windowOptions);
    
    // Add to windows array
    this.windows.push({
      el: windowEl,
      options: windowOptions
    });
    
    // Activate the window
    this.activateWindow(windowEl);
    
    return windowEl;
  }
  
  setupWindowEvents(windowEl, options) {
    // Make window draggable
    this.makeWindowDraggable(windowEl);
    
    // Window controls
    if (options.closable) {
      const closeBtn = windowEl.querySelector('.window-close');
      closeBtn.addEventListener('click', () => {
        this.closeWindow(windowEl);
      });
    }
    
    if (options.minimizable) {
      const minBtn = windowEl.querySelector('.window-minimize');
      minBtn.addEventListener('click', () => {
        this.minimizeWindow(windowEl);
      });
    }

    if (options.maximizable) {
      const maxBtn = windowEl.querySelector('.window-maximize');
      maxBtn.addEventListener('click', () => {
        this.toggleMaximizeWindow(windowEl);
      });
    }

    // Click to activate window
    windowEl.addEventListener('mousedown', () => {
      this.activateWindow(windowEl);
    });
  }

  makeWindowDraggable(windowEl) {
    const header = windowEl.querySelector('.window-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      // Don't drag if clicking on window controls
      if (e.target.closest('.window-controls')) return;

      isDragging = true;
      offsetX = e.clientX - windowEl.getBoundingClientRect().left;
      offsetY = e.clientY - windowEl.getBoundingClientRect().top;
      this.activateWindow(windowEl);

      // Prevent text selection while dragging
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // Keep window within viewport bounds
      const maxX = window.innerWidth - windowEl.offsetWidth;
      const maxY = window.innerHeight - windowEl.offsetHeight;

      windowEl.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      windowEl.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  activateWindow(windowEl) {
    // Remove active class from all windows
    this.windows.forEach(win => {
      win.el.classList.remove('active');
      win.el.style.zIndex = this.zIndexCounter;
    });

    // Activate the clicked window
    windowEl.classList.add('active');
    windowEl.style.zIndex = this.zIndexCounter + 1;
    this.activeWindow = windowEl;
  }

  closeWindow(windowEl) {
    // Remove from windows array
    this.windows = this.windows.filter(win => win.el !== windowEl);

    // Remove from DOM
    windowEl.remove();

    // Update active window
    if (this.activeWindow === windowEl) {
      this.activeWindow = this.windows.length > 0 ? this.windows[this.windows.length - 1].el : null;
    }
  }

  minimizeWindow(windowEl) {
    windowEl.style.display = 'none';
    // Could add to taskbar here
  }

  restoreWindow(windowEl) {
    windowEl.style.display = 'block';
    this.activateWindow(windowEl);
  }

  toggleMaximizeWindow(windowEl) {
    if (windowEl.classList.contains('maximized')) {
      // Restore window
      windowEl.classList.remove('maximized');
      windowEl.style.width = windowEl.dataset.originalWidth || '600px';
      windowEl.style.height = windowEl.dataset.originalHeight || '400px';
      windowEl.style.left = windowEl.dataset.originalLeft || '50px';
      windowEl.style.top = windowEl.dataset.originalTop || '50px';
    } else {
      // Maximize window
      windowEl.dataset.originalWidth = windowEl.style.width;
      windowEl.dataset.originalHeight = windowEl.style.height;
      windowEl.dataset.originalLeft = windowEl.style.left;
      windowEl.dataset.originalTop = windowEl.style.top;

      windowEl.classList.add('maximized');
      windowEl.style.width = '100vw';
      windowEl.style.height = 'calc(100vh - 120px)'; // Account for dock
      windowEl.style.left = '0px';
      windowEl.style.top = '32px'; // Account for top bar
    }
  }

  // Get window by ID
  getWindow(id) {
    return this.windows.find(win => win.el.id === id);
  }

  // Get all windows
  getAllWindows() {
    return this.windows;
  }

  // Close all windows
  closeAllWindows() {
    this.windows.forEach(win => {
      win.el.remove();
    });
    this.windows = [];
    this.activeWindow = null;
  }
}

// Export the window manager
window.WindowManager = WindowManager;