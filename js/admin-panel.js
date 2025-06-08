class AdminPanel {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.stations = this.loadStations();
    this.currentEditingStation = null;
  }
  
  create() {
    // Calculate safe window positioning
    const maxWidth = Math.min(800, window.innerWidth - 100);
    const maxHeight = Math.min(600, window.innerHeight - 100);
    const x = Math.max(50, (window.innerWidth - maxWidth) / 2);
    const y = Math.max(50, (window.innerHeight - maxHeight) / 2);

    const windowOptions = {
      id: 'admin-panel',
      title: 'Admin Panel - Station Manager',
      width: maxWidth,
      height: maxHeight,
      x: x,
      y: y,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshStationList();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="admin-panel">
        <div class="admin-header">
          <h2>🎛️ Station Manager</h2>
          <div class="admin-stats">
            <span class="stat-item">Stations: <span id="station-count">0</span></span>
            <span class="stat-item">Status: <span class="status-online">ONLINE</span></span>
          </div>
        </div>
        
        <div class="admin-content">
          <div class="admin-sidebar">
            <div class="station-list-container">
              <h3>Stations</h3>
              <div class="station-list" id="station-list">
                <!-- Station list will be populated here -->
              </div>
              <button class="btn-primary" id="add-station-btn">+ Add New Station</button>
            </div>
          </div>
          
          <div class="admin-main">
            <div class="station-editor" id="station-editor">
              <h3>Station Editor</h3>
              <div class="editor-placeholder">
                Select a station to edit or create a new one
              </div>
            </div>
          </div>
        </div>
        
        <div class="admin-footer">
          <button class="btn-secondary" id="export-data-btn">Export Data</button>
          <button class="btn-secondary" id="import-data-btn">Import Data</button>
          <button class="btn-danger" id="reset-data-btn">Reset to Default</button>
          <button class="btn-success" id="save-changes-btn">Save All Changes</button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Add new station
    this.windowElement.querySelector('#add-station-btn').addEventListener('click', () => {
      this.createNewStation();
    });
    
    // Save changes
    this.windowElement.querySelector('#save-changes-btn').addEventListener('click', () => {
      this.saveChanges();
    });
    
    // Export data
    this.windowElement.querySelector('#export-data-btn').addEventListener('click', () => {
      this.exportData();
    });
    
    // Import data
    this.windowElement.querySelector('#import-data-btn').addEventListener('click', () => {
      this.importData();
    });
    
    // Reset data
    this.windowElement.querySelector('#reset-data-btn').addEventListener('click', () => {
      this.resetToDefault();
    });
  }
  
  refreshStationList() {
    const stationList = this.windowElement.querySelector('#station-list');
    const stationCount = this.windowElement.querySelector('#station-count');
    
    stationList.innerHTML = '';
    
    this.stations.forEach((station, index) => {
      const stationItem = document.createElement('div');
      stationItem.className = 'station-item';
      stationItem.innerHTML = `
        <div class="station-info">
          <div class="station-name">${station.name}</div>
          <div class="station-desc">${station.description}</div>
        </div>
        <div class="station-actions">
          <button class="btn-edit" data-index="${index}">Edit</button>
          <button class="btn-delete" data-index="${index}">Delete</button>
        </div>
      `;
      
      stationList.appendChild(stationItem);
    });
    
    // Update station count
    stationCount.textContent = this.stations.length;
    
    // Add event listeners for edit/delete buttons
    stationList.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editStation(index);
      });
    });
    
    stationList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteStation(index);
      });
    });
  }
  
  createNewStation() {
    const timestamp = Date.now();
    const examples = [
      {
        youtubeId: 'jfKfPfyJRdk',
        description: 'LoFi Hip Hop Radio - 24/7 stream'
      },
      {
        youtubeId: 'OLAK5uy_mZ_n0miNZPEDzY9Xf212_-ZVgH5S5yroo',
        description: 'Example Album Playlist'
      },
      {
        youtubeId: 'https://www.youtube.com/watch?v=4z3mpO76luc&list=OLAK5uy_mZ_n0miNZPEDzY9Xf212_-ZVgH5S5yroo',
        description: 'Full YouTube URL with playlist'
      }
    ];

    const randomExample = examples[Math.floor(Math.random() * examples.length)];

    const newStation = {
      id: 'station-' + timestamp,
      name: 'New Station ' + new Date().toLocaleTimeString(),
      description: randomExample.description,
      youtubeId: randomExample.youtubeId,
      backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
      color: '#FF1493',
      artwork: ''
    };

    this.stations.push(newStation);
    this.refreshStationList();
    this.editStation(this.stations.length - 1);

    // Show helpful message
    this.showMessage('✨ New station created with example content! Modify as needed and click "Update Station".', 'info');
  }
  
  editStation(index) {
    this.currentEditingStation = index;
    const station = this.stations[index];
    
    const editor = this.windowElement.querySelector('#station-editor');
    editor.innerHTML = `
      <h3>Editing: ${station.name}</h3>
      <div class="editor-form">
        <div class="form-group">
          <label>Station Name:</label>
          <input type="text" id="edit-name" value="${station.name}" placeholder="Station Name">
        </div>
        
        <div class="form-group">
          <label>Description:</label>
          <input type="text" id="edit-description" value="${station.description}" placeholder="Station Description">
        </div>
        
        <div class="form-group">
          <label>YouTube Content:</label>
          <input type="text" id="edit-youtube" value="${station.youtubeId}" placeholder="Video ID, Playlist ID, or full YouTube URL">
          <small>
            <strong>Supported formats:</strong><br>
            • Video ID: <code>jfKfPfyJRdk</code><br>
            • Playlist ID: <code>OLAK5uy_mZ_n0miNZPEDzY9Xf212_-ZVgH5S5yroo</code><br>
            • Full URL: <code>https://youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID</code><br>
            • Playlist URL: <code>https://youtube.com/playlist?list=PLAYLIST_ID</code>
          </small>
        </div>
        
        <div class="form-group">
          <label>Background Video URL:</label>
          <input type="text" id="edit-background" value="${station.backgroundVideo}" placeholder="Background Video URL">
        </div>
        
        <div class="form-group">
          <label>Station Color:</label>
          <input type="color" id="edit-color" value="${station.color}">
        </div>
        
        <div class="form-group">
          <label>Artwork URL:</label>
          <input type="text" id="edit-artwork" value="${station.artwork}" placeholder="Artwork Image URL">
        </div>
        
        <div class="form-actions">
          <button class="btn-primary" id="update-station-btn">Update Station</button>
          <button class="btn-secondary" id="cancel-edit-btn">Cancel</button>
          <button class="btn-info" id="test-embed-btn">Test Embed</button>
          <button class="btn-warning" id="test-station-btn">Test in Player</button>
        </div>

        <div class="test-results" id="test-results" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0;">Test Results</h4>
            <button class="btn-secondary" id="clear-test-btn" style="font-size: 11px; padding: 4px 8px;">Clear</button>
          </div>
          <div id="test-output"></div>
        </div>
      </div>
    `;
    
    // Add event listeners for form actions
    editor.querySelector('#update-station-btn').addEventListener('click', () => {
      this.updateStation();
    });
    
    editor.querySelector('#cancel-edit-btn').addEventListener('click', () => {
      this.cancelEdit();
    });
    
    editor.querySelector('#test-embed-btn').addEventListener('click', () => {
      this.testEmbedding();
    });

    editor.querySelector('#test-station-btn').addEventListener('click', () => {
      this.testStation();
    });

    editor.querySelector('#clear-test-btn').addEventListener('click', () => {
      this.clearTestResults();
    });
  }
  
  updateStation() {
    if (this.currentEditingStation === null) return;

    const station = this.stations[this.currentEditingStation];

    // Get form values
    const name = this.windowElement.querySelector('#edit-name').value.trim();
    const description = this.windowElement.querySelector('#edit-description').value.trim();
    const youtubeId = this.windowElement.querySelector('#edit-youtube').value.trim();
    const backgroundVideo = this.windowElement.querySelector('#edit-background').value.trim();
    const color = this.windowElement.querySelector('#edit-color').value;
    const artwork = this.windowElement.querySelector('#edit-artwork').value.trim();

    // Validate required fields
    if (!name) {
      this.showMessage('Station name is required', 'error');
      return;
    }

    if (!youtubeId) {
      this.showMessage('YouTube ID is required', 'error');
      return;
    }

    // Update station
    station.name = name;
    station.description = description || 'No description';
    station.youtubeId = youtubeId;
    station.backgroundVideo = backgroundVideo;
    station.color = color;
    station.artwork = artwork;

    // Update station ID based on name
    station.id = station.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Auto-save the changes
    this.saveStations();
    // Update global station data
    window.stationData = [...this.stations];

    this.refreshStationList();
    this.refreshRadioWindow();
    this.cancelEdit();

    // Show success message
    this.showMessage('✅ Station updated and saved successfully!', 'success');
  }
  
  deleteStation(index) {
    if (confirm('Are you sure you want to delete this station?')) {
      this.stations.splice(index, 1);
      this.refreshStationList();
      this.cancelEdit();
      this.showMessage('Station deleted successfully!', 'success');
    }
  }
  
  cancelEdit() {
    this.currentEditingStation = null;
    const editor = this.windowElement.querySelector('#station-editor');
    editor.innerHTML = `
      <h3>Station Editor</h3>
      <div class="editor-placeholder">
        Select a station to edit or create a new one
      </div>
    `;
  }
  
  testEmbedding() {
    if (this.currentEditingStation === null) return;

    const youtubeInput = this.windowElement.querySelector('#edit-youtube').value.trim();
    const stationName = this.windowElement.querySelector('#edit-name').value.trim() || 'Test Station';

    // Validate required fields
    if (!youtubeInput) {
      this.showTestResult('Please enter YouTube content before testing', 'error');
      return;
    }

    // Validate YouTube content format
    const contentValidation = this.validateYouTubeContent(youtubeInput);
    if (!contentValidation.isValid) {
      this.showTestResult(`❌ Invalid format: ${contentValidation.error}`, 'error');
      return;
    }

    this.showTestResult(`🔍 Testing ${contentValidation.type}: ${contentValidation.description}`, 'info');

    // Extract video/playlist ID for testing
    let testId = youtubeInput;
    if (youtubeInput.includes('youtube.com') || youtubeInput.includes('youtu.be')) {
      try {
        const urlObj = new URL(youtubeInput);
        const params = new URLSearchParams(urlObj.search);
        testId = params.get('v') || params.get('list') || youtubeInput;
      } catch (error) {
        this.showTestResult('❌ Could not parse YouTube URL', 'error');
        return;
      }
    }

    // Load YouTube API if not already loaded
    if (!window.YT) {
      this.showTestResult('⏳ Loading YouTube API...', 'info');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.testEmbedding();
      };
      return;
    }

    // Create a hidden test container
    let testContainer = document.getElementById('admin-test-container');
    if (!testContainer) {
      testContainer = document.createElement('div');
      testContainer.id = 'admin-test-container';
      testContainer.style.position = 'absolute';
      testContainer.style.top = '-1000px';
      testContainer.style.left = '-1000px';
      document.body.appendChild(testContainer);
    }

    // Create unique player container
    const playerId = `test-player-${Date.now()}`;
    const playerDiv = document.createElement('div');
    playerDiv.id = playerId;
    testContainer.appendChild(playerDiv);

    let hasResponded = false;
    const timeout = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        this.showTestResult('⏰ Test timeout - video may not be available', 'warning');
        cleanup();
      }
    }, 15000); // 15 second timeout

    function cleanup() {
      clearTimeout(timeout);
      if (playerDiv.parentNode) {
        playerDiv.parentNode.removeChild(playerDiv);
      }
    }

    try {
      const playerConfig = {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event) => {
            if (!hasResponded) {
              hasResponded = true;
              this.showTestResult(`✅ Embedding test PASSED! "${stationName}" can be embedded.`, 'success');
              this.showTestResult('💡 You can safely save this station - it will work in the radio player.', 'info');
              cleanup();
            }
          },
          onError: (event) => {
            if (!hasResponded) {
              hasResponded = true;
              let errorMessage = 'Unknown error';
              let suggestion = '';

              switch (event.data) {
                case 2:
                  errorMessage = 'Invalid video ID';
                  suggestion = 'Check that the video ID is correct.';
                  break;
                case 5:
                  errorMessage = 'HTML5 player error';
                  suggestion = 'Try a different video - this one may have technical issues.';
                  break;
                case 100:
                  errorMessage = 'Video not found or private';
                  suggestion = 'Make sure the video is public and the ID is correct.';
                  break;
                case 101:
                case 150:
                  errorMessage = 'Video owner does not allow embedding';
                  suggestion = 'Find a different video that allows embedding, or use a Creative Commons video.';
                  break;
                default:
                  errorMessage = `Error code: ${event.data}`;
                  suggestion = 'Try a different video.';
              }

              this.showTestResult(`❌ Embedding test FAILED: ${errorMessage}`, 'error');
              this.showTestResult(`💡 Suggestion: ${suggestion}`, 'warning');
              cleanup();
            }
          }
        }
      };

      // Set video or playlist based on content type
      if (contentValidation.type === 'playlist') {
        playerConfig.playerVars.list = testId;
        playerConfig.playerVars.listType = 'playlist';
      } else {
        playerConfig.videoId = testId;
      }

      new YT.Player(playerId, playerConfig);

    } catch (error) {
      if (!hasResponded) {
        hasResponded = true;
        this.showTestResult(`❌ Test failed: ${error.message}`, 'error');
        cleanup();
      }
    }
  }

  testStation() {
    if (this.currentEditingStation === null) return;

    const station = {
      id: 'test-station-' + Date.now(),
      name: this.windowElement.querySelector('#edit-name').value.trim(),
      description: this.windowElement.querySelector('#edit-description').value.trim(),
      youtubeId: this.windowElement.querySelector('#edit-youtube').value.trim(),
      backgroundVideo: this.windowElement.querySelector('#edit-background').value.trim(),
      color: this.windowElement.querySelector('#edit-color').value,
      artwork: this.windowElement.querySelector('#edit-artwork').value.trim()
    };

    // Validate required fields
    if (!station.name || !station.youtubeId) {
      this.showMessage('Please fill in station name and YouTube content before testing', 'error');
      return;
    }

    console.log('Testing station:', station);
    this.showMessage(`🔍 Testing station: ${station.name}...`, 'info');

    // Validate YouTube content format using the same parser as the player
    const contentValidation = this.validateYouTubeContent(station.youtubeId);
    if (!contentValidation.isValid) {
      this.showMessage(`❌ Invalid YouTube content: ${contentValidation.error}`, 'error');
      return;
    }

    this.showMessage(`✅ Valid ${contentValidation.type}: ${contentValidation.description}`, 'success');

    // Find the radio window and test the station
    const radioWindow = document.getElementById('window-radio-player');
    if (!radioWindow) {
      this.showMessage('📻 Please open the radio player first to test stations', 'warning');
      return;
    }

    // Get the radio window instance from the app
    if (!window.app || !window.app.youtubePlayer) {
      this.showMessage('❌ Radio player not available for testing', 'error');
      return;
    }

    this.showMessage('🎵 Loading station in radio player...', 'info');

    try {
      // Add error listener for testing
      const testErrorHandler = (event) => {
        console.error('Test station error:', event);
        this.showMessage(`❌ Test failed: ${event.message || 'YouTube playback error'}`, 'error');
        window.app.youtubePlayer.removeEventListener('error', testErrorHandler);
      };

      const testSuccessHandler = (event) => {
        console.log('Test station loaded successfully:', event);
        this.showMessage('🎵 Station test successful! Audio should be playing.', 'success');
        window.app.youtubePlayer.removeEventListener('stationLoaded', testSuccessHandler);
      };

      // Add temporary event listeners
      window.app.youtubePlayer.addEventListener('error', testErrorHandler);
      window.app.youtubePlayer.addEventListener('stationLoaded', testSuccessHandler);

      // Test YouTube loading
      window.app.youtubePlayer.loadStation(station);

      // Test background video if provided
      if (station.backgroundVideo && window.app.backgroundManager) {
        window.app.backgroundManager.loadVideoForStation(station);
      }

      // Remove listeners after 10 seconds if no response
      setTimeout(() => {
        window.app.youtubePlayer.removeEventListener('error', testErrorHandler);
        window.app.youtubePlayer.removeEventListener('stationLoaded', testSuccessHandler);
      }, 10000);

    } catch (error) {
      console.error('Station test error:', error);
      this.showMessage(`❌ Station test failed: ${error.message}`, 'error');
    }
  }
  
  saveChanges() {
    this.saveStations();
    // Update the global station data
    window.stationData = [...this.stations];

    // Refresh radio window if it exists
    this.refreshRadioWindow();

    this.showMessage('All changes saved successfully!', 'success');
  }

  refreshRadioWindow() {
    // Find radio window and refresh its station list
    const radioWindow = document.getElementById('window-radio-player');
    if (radioWindow) {
      const stationSelect = radioWindow.querySelector('#station-select');
      if (stationSelect) {
        // Store current selection
        const currentValue = stationSelect.value;

        // Clear and repopulate the station selector
        stationSelect.innerHTML = '<option value="">Choose Station...</option>';

        // Get updated stations
        const stations = this.stations;
        stations.forEach(station => {
          const option = document.createElement('option');
          option.value = station.id;
          option.textContent = station.name;
          stationSelect.appendChild(option);
        });

        // Restore selection if station still exists
        if (currentValue && stations.find(s => s.id === currentValue)) {
          stationSelect.value = currentValue;
        }

        console.log('Radio window station list refreshed with', stations.length, 'stations');
      }
    }
  }
  
  exportData() {
    const dataStr = JSON.stringify(this.stations, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'radio-stations.json';
    link.click();
    
    URL.revokeObjectURL(url);
    this.showMessage('Data exported successfully!', 'success');
  }
  
  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedStations = JSON.parse(e.target.result);
            this.stations = importedStations;
            this.refreshStationList();
            this.showMessage('Data imported successfully!', 'success');
          } catch (error) {
            this.showMessage('Error importing data: ' + error.message, 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  }
  
  resetToDefault() {
    if (confirm('Are you sure you want to reset to default stations? This will delete all custom stations.')) {
      this.stations = this.getDefaultStations();
      this.refreshStationList();
      this.cancelEdit();
      this.showMessage('Reset to default stations!', 'success');
    }
  }
  
  clearTestResults() {
    const testOutput = this.windowElement.querySelector('#test-output');
    const testResults = this.windowElement.querySelector('#test-results');

    if (testOutput) {
      testOutput.innerHTML = '';
    }

    if (testResults) {
      testResults.style.display = 'none';
    }
  }

  showTestResult(message, type = 'info') {
    const testResults = this.windowElement.querySelector('#test-results');
    const testOutput = this.windowElement.querySelector('#test-output');

    if (!testResults || !testOutput) return;

    // Show the test results section
    testResults.style.display = 'block';

    // Create result item
    const resultItem = document.createElement('div');
    resultItem.className = `test-result test-result-${type}`;
    resultItem.innerHTML = `
      <span class="test-timestamp">[${new Date().toLocaleTimeString()}]</span>
      <span class="test-message">${message}</span>
    `;

    testOutput.appendChild(resultItem);

    // Scroll to bottom of test output
    testOutput.scrollTop = testOutput.scrollHeight;

    // Auto-clear old results if too many
    const results = testOutput.querySelectorAll('.test-result');
    if (results.length > 10) {
      results[0].remove();
    }
  }

  showMessage(message, type = 'info') {
    // Remove any existing messages first
    const existingMessages = this.windowElement.querySelectorAll('.admin-message');
    existingMessages.forEach(msg => msg.remove());

    // Create a temporary message element
    const messageEl = document.createElement('div');
    messageEl.className = `admin-message admin-message-${type}`;
    messageEl.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'message-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => messageEl.remove();
    messageEl.appendChild(closeBtn);

    // Insert at the top of the admin content, not in header
    const adminContent = this.windowElement.querySelector('.admin-content');
    adminContent.insertBefore(messageEl, adminContent.firstChild);

    // Auto-remove after 5 seconds (longer for better readability)
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }
  
  // Data persistence methods
  loadStations() {
    const saved = localStorage.getItem('radioStations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved stations:', error);
      }
    }
    return this.getDefaultStations();
  }
  
  saveStations() {
    localStorage.setItem('radioStations', JSON.stringify(this.stations));
  }
  
  validateYouTubeContent(input) {
    if (!input || typeof input !== 'string') {
      return { isValid: false, error: 'Empty or invalid input' };
    }

    const trimmed = input.trim();

    // Check if it's a full YouTube URL
    const urlMatch = trimmed.match(/(?:youtube\.com\/watch\?|youtu\.be\/|youtube\.com\/playlist\?)/);
    if (urlMatch) {
      try {
        const urlObj = new URL(trimmed);
        const params = new URLSearchParams(urlObj.search);

        const videoId = params.get('v');
        const playlistId = params.get('list');

        if (playlistId) {
          return {
            isValid: true,
            type: 'playlist',
            description: `Playlist (${playlistId.substring(0, 20)}...)`
          };
        } else if (videoId) {
          return {
            isValid: true,
            type: 'video',
            description: `Video (${videoId})`
          };
        }

        return { isValid: false, error: 'No video or playlist ID found in URL' };
      } catch (error) {
        return { isValid: false, error: 'Invalid URL format' };
      }
    }

    // Check if it's a playlist ID (starts with PL, UU, LL, etc.)
    if (trimmed.match(/^(PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/)) {
      return {
        isValid: true,
        type: 'playlist',
        description: `Playlist ID (${trimmed.substring(0, 20)}...)`
      };
    }

    // Check if it's a video ID (11 characters, alphanumeric + - and _)
    if (trimmed.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return {
        isValid: true,
        type: 'video',
        description: `Video ID (${trimmed})`
      };
    }

    return {
      isValid: false,
      error: 'Must be a YouTube video ID, playlist ID, or valid YouTube URL'
    };
  }

  getDefaultStations() {
    return [
      {
        id: 'fait',
        name: 'FAIT FM',
        description: 'The original FAIT vibes',
        youtubeId: 'jfKfPfyJRdk',
        backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
        color: '#FF1493',
        artwork: 'img/stations/fait.jpg'
      },
      {
        id: 'synthwave',
        name: 'Synthwave Radio',
        description: 'Retro synthwave and outrun vibes',
        youtubeId: 'MVPTGNGiI-4',
        backgroundVideo: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/mp4',
        color: '#8A2BE2',
        artwork: 'img/stations/synthwave.jpg'
      },
      {
        id: 'lofi',
        name: 'Lo-Fi Beats',
        description: 'Chill beats to relax and study',
        youtubeId: '5qap5aO4i9A',
        backgroundVideo: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/mp4',
        color: '#4ECDC4',
        artwork: 'img/stations/lofi.jpg'
      },
      {
        id: 'jazz',
        name: 'Smooth Jazz',
        description: 'Relaxing jazz for any time of day',
        youtubeId: 'Dx5qFachd3A',
        backgroundVideo: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/mp4',
        color: '#95E1D3',
        artwork: 'img/stations/jazz.jpg'
      },
      {
        id: 'chillhop',
        name: 'Chillhop Cafe',
        description: 'Instrumental hip-hop and chill beats',
        youtubeId: 'rUxyKA_-grg',
        backgroundVideo: 'https://media.giphy.com/media/l0HlQoVLBOqMjKzQs/mp4',
        color: '#F38BA8',
        artwork: 'img/stations/chillhop.jpg'
      },
      {
        id: 'ambient',
        name: 'Ambient Space',
        description: 'Deep ambient soundscapes',
        youtubeId: 'kgx4WGK0oNU',
        backgroundVideo: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/mp4',
        color: '#A8E6CF',
        artwork: 'img/stations/ambient.jpg'
      },
      {
        id: 'playlist-example',
        name: 'Playlist Example',
        description: 'Example of YouTube playlist support',
        youtubeId: 'OLAK5uy_mZ_n0miNZPEDzY9Xf212_-ZVgH5S5yroo',
        backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
        color: '#FF6B9D',
        artwork: 'img/stations/playlist.jpg'
      }
    ];
  }
}

// Export the admin panel
window.AdminPanel = AdminPanel;
