class MixtapesWindow {
  constructor(windowManager, youtubePlayer, backgroundManager) {
    this.windowManager = windowManager;
    this.youtubePlayer = youtubePlayer;
    this.backgroundManager = backgroundManager;
    this.windowElement = null;
    this.editorWindow = null;
    this.mixtapes = this.loadMixtapes();
    this.currentMixtape = null;
    this.currentEditingIndex = null;
  }
  
  create() {
    const windowOptions = {
      id: 'mixtapes',
      title: 'FAIT Mixtapes',
      width: 600,
      height: 450,
      x: 200,
      y: 150,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshMixtapeList();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="mixtapes-container">
        <div class="mixtapes-header">
          <h2>🎵 Mixtapes Collection</h2>
          <div class="mixtapes-controls">
            <button class="btn-primary" id="add-mixtape-btn">+ Add Mixtape</button>
            <button class="btn-secondary" id="import-mixtapes-btn">Import</button>
          </div>
        </div>
        
        <div class="mixtapes-content">
          <div class="mixtapes-grid" id="mixtapes-grid">
            <!-- Mixtapes will be populated here -->
          </div>
        </div>
        
        <div class="mixtape-player" id="mixtape-player" style="display: none;">
          <div class="player-header">
            <h3 id="current-mixtape-title">No mixtape selected</h3>
            <button class="btn-secondary" id="close-player-btn">×</button>
          </div>
          <div class="player-controls">
            <button class="btn-primary" id="play-mixtape-btn">▶ Play</button>
            <button class="btn-secondary" id="stop-mixtape-btn">⏹ Stop</button>
            <span class="track-info" id="track-info">Ready to play</span>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Add mixtape button
    this.windowElement.querySelector('#add-mixtape-btn').addEventListener('click', () => {
      this.showAddMixtapeDialog();
    });
    
    // Import mixtapes button
    this.windowElement.querySelector('#import-mixtapes-btn').addEventListener('click', () => {
      this.importMixtapes();
    });
    
    // Player controls
    this.windowElement.querySelector('#play-mixtape-btn').addEventListener('click', () => {
      this.playCurrentMixtape();
    });
    
    this.windowElement.querySelector('#stop-mixtape-btn').addEventListener('click', () => {
      this.stopCurrentMixtape();
    });
    
    this.windowElement.querySelector('#close-player-btn').addEventListener('click', () => {
      this.hidePlayer();
    });
  }
  
  refreshMixtapeList() {
    const grid = this.windowElement.querySelector('#mixtapes-grid');
    grid.innerHTML = '';
    
    if (this.mixtapes.length === 0) {
      grid.innerHTML = '<div class="no-mixtapes">No mixtapes yet. Add your first mixtape!</div>';
      return;
    }
    
    this.mixtapes.forEach((mixtape, index) => {
      const mixtapeCard = document.createElement('div');
      mixtapeCard.className = 'mixtape-card';
      mixtapeCard.innerHTML = `
        <div class="mixtape-artwork" style="background: linear-gradient(45deg, ${mixtape.color || '#FF1493'}, ${this.lightenColor(mixtape.color || '#FF1493')})">
          <div class="mixtape-icon">🎵</div>
        </div>
        <div class="mixtape-info">
          <h4>${mixtape.name}</h4>
          <p>${mixtape.description}</p>
          <div class="mixtape-meta">
            <span class="track-count">${mixtape.trackCount || '?'} tracks</span>
            <span class="duration">${mixtape.duration || 'Unknown'}</span>
          </div>
        </div>
        <div class="mixtape-actions">
          <button class="btn-play" data-index="${index}">▶</button>
          <button class="btn-edit" data-index="${index}">✏️</button>
          <button class="btn-delete" data-index="${index}">🗑️</button>
        </div>
      `;
      
      grid.appendChild(mixtapeCard);
    });
    
    // Add event listeners for mixtape actions
    grid.querySelectorAll('.btn-play').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.playMixtape(index);
      });
    });
    
    grid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editMixtape(index);
      });
    });
    
    grid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteMixtape(index);
      });
    });
  }
  
  showAddMixtapeDialog() {
    this.currentEditingIndex = null; // New mixtape
    this.openMixtapeEditor();
  }
  
  playMixtape(index) {
    const mixtape = this.mixtapes[index];
    if (!mixtape) return;
    
    this.currentMixtape = mixtape;
    this.showPlayer();
    
    // Create a station object for the YouTube player
    const stationData = {
      id: mixtape.id,
      name: mixtape.name,
      description: mixtape.description,
      youtubeId: mixtape.youtubePlaylistId,
      backgroundVideo: '',
      color: mixtape.color
    };
    
    // Load in YouTube player
    this.youtubePlayer.loadStation(stationData);
    
    // Update player UI
    this.windowElement.querySelector('#current-mixtape-title').textContent = mixtape.name;
    this.windowElement.querySelector('#track-info').textContent = 'Loading playlist...';
  }
  
  showPlayer() {
    this.windowElement.querySelector('#mixtape-player').style.display = 'block';
  }
  
  hidePlayer() {
    this.windowElement.querySelector('#mixtape-player').style.display = 'none';
    this.currentMixtape = null;
  }
  
  playCurrentMixtape() {
    if (this.youtubePlayer.player) {
      this.youtubePlayer.play();
    }
  }
  
  stopCurrentMixtape() {
    if (this.youtubePlayer.player) {
      this.youtubePlayer.pause();
    }
  }
  
  editMixtape(index) {
    this.currentEditingIndex = index;
    this.openMixtapeEditor();
  }

  openMixtapeEditor() {
    // Close existing editor if open
    if (this.editorWindow) {
      this.editorWindow.remove();
    }

    const isEditing = this.currentEditingIndex !== null;
    const mixtape = isEditing ? this.mixtapes[this.currentEditingIndex] : null;

    // Calculate safe window positioning
    const maxWidth = Math.min(600, window.innerWidth - 100);
    const maxHeight = Math.min(500, window.innerHeight - 100);
    const x = Math.max(50, (window.innerWidth - maxWidth) / 2);
    const y = Math.max(50, (window.innerHeight - maxHeight) / 2);

    const windowOptions = {
      id: 'mixtape-editor',
      title: isEditing ? `Edit Mixtape: ${mixtape.name}` : 'Create New Mixtape',
      width: maxWidth,
      height: maxHeight,
      x: x,
      y: y,
      content: this.generateEditorContent(mixtape)
    };

    this.editorWindow = this.windowManager.createWindow(windowOptions);
    this.setupEditorEventListeners();
  }

  generateEditorContent(mixtape = null) {
    const isEditing = mixtape !== null;

    return `
      <div class="mixtape-editor">
        <div class="editor-header">
          <h2>${isEditing ? '✏️ Edit Mixtape' : '🎵 Create New Mixtape'}</h2>
          <p class="editor-subtitle">
            ${isEditing ? 'Modify your mixtape details below' : 'Add a new mixtape to your collection'}
          </p>
        </div>

        <div class="editor-form">
          <div class="form-group">
            <label for="mixtape-name">Mixtape Name:</label>
            <input type="text" id="mixtape-name" value="${mixtape?.name || ''}"
                   placeholder="e.g., Synthwave Essentials" maxlength="50">
            <small>Give your mixtape a catchy name</small>
          </div>

          <div class="form-group">
            <label for="mixtape-description">Description:</label>
            <input type="text" id="mixtape-description" value="${mixtape?.description || ''}"
                   placeholder="e.g., The best synthwave tracks for late night coding" maxlength="100">
            <small>Describe what makes this mixtape special</small>
          </div>

          <div class="form-group">
            <label for="mixtape-youtube">YouTube Playlist:</label>
            <input type="text" id="mixtape-youtube" value="${mixtape?.youtubePlaylistId || ''}"
                   placeholder="Playlist ID or full YouTube playlist URL">
            <small>
              <strong>Supported formats:</strong><br>
              • Playlist ID: <code>PLrAl6rYAS4Z7hWOgOgKjKW8VaOtMnKGWz</code><br>
              • Full URL: <code>https://youtube.com/playlist?list=PLAYLIST_ID</code>
            </small>
          </div>

          <div class="form-group">
            <label for="mixtape-color">Theme Color:</label>
            <input type="color" id="mixtape-color" value="${mixtape?.color || this.getRandomColor()}">
            <small>Choose a color that represents your mixtape's vibe</small>
          </div>

          <div class="form-group">
            <label for="mixtape-tags">Tags (optional):</label>
            <input type="text" id="mixtape-tags" value="${mixtape?.tags?.join(', ') || ''}"
                   placeholder="e.g., synthwave, retro, chill">
            <small>Add tags separated by commas to help organize your mixtapes</small>
          </div>

          <div class="form-actions">
            <button class="btn-primary" id="save-mixtape-btn">
              ${isEditing ? '💾 Update Mixtape' : '✨ Create Mixtape'}
            </button>
            <button class="btn-info" id="test-mixtape-btn">🧪 Test Playlist</button>
            <button class="btn-secondary" id="cancel-mixtape-btn">❌ Cancel</button>
          </div>

          <div class="test-results" id="mixtape-test-results" style="display: none;">
            <h4>Test Results</h4>
            <div id="mixtape-test-output"></div>
          </div>
        </div>
      </div>
    `;
  }

  setupEditorEventListeners() {
    if (!this.editorWindow) return;

    // Save mixtape button
    this.editorWindow.querySelector('#save-mixtape-btn').addEventListener('click', () => {
      this.saveMixtapeFromEditor();
    });

    // Test playlist button
    this.editorWindow.querySelector('#test-mixtape-btn').addEventListener('click', () => {
      this.testMixtapePlaylist();
    });

    // Cancel button
    this.editorWindow.querySelector('#cancel-mixtape-btn').addEventListener('click', () => {
      this.closeMixtapeEditor();
    });
  }

  saveMixtapeFromEditor() {
    if (!this.editorWindow) return;

    // Get form values
    const name = this.editorWindow.querySelector('#mixtape-name').value.trim();
    const description = this.editorWindow.querySelector('#mixtape-description').value.trim();
    const youtubePlaylistId = this.editorWindow.querySelector('#mixtape-youtube').value.trim();
    const color = this.editorWindow.querySelector('#mixtape-color').value;
    const tagsInput = this.editorWindow.querySelector('#mixtape-tags').value.trim();

    // Validate required fields
    if (!name) {
      this.showMixtapeTestResult('Mixtape name is required', 'error');
      return;
    }

    if (!youtubePlaylistId) {
      this.showMixtapeTestResult('YouTube playlist is required', 'error');
      return;
    }

    // Parse tags
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    // Create or update mixtape
    const mixtapeData = {
      id: this.currentEditingIndex !== null ? this.mixtapes[this.currentEditingIndex].id : 'mixtape-' + Date.now(),
      name: name,
      description: description || 'No description',
      youtubePlaylistId: youtubePlaylistId,
      color: color,
      tags: tags,
      trackCount: '?',
      duration: 'Unknown'
    };

    if (this.currentEditingIndex !== null) {
      // Update existing mixtape
      this.mixtapes[this.currentEditingIndex] = mixtapeData;
      this.showMixtapeTestResult('✅ Mixtape updated successfully!', 'success');
    } else {
      // Add new mixtape
      this.mixtapes.push(mixtapeData);
      this.showMixtapeTestResult('✅ Mixtape created successfully!', 'success');
    }

    this.saveMixtapes();
    this.refreshMixtapeList();

    // Close editor after a short delay
    setTimeout(() => {
      this.closeMixtapeEditor();
    }, 1500);
  }

  testMixtapePlaylist() {
    if (!this.editorWindow) return;

    const youtubeInput = this.editorWindow.querySelector('#mixtape-youtube').value.trim();

    if (!youtubeInput) {
      this.showMixtapeTestResult('Please enter a YouTube playlist before testing', 'error');
      return;
    }

    this.showMixtapeTestResult('🔍 Testing playlist...', 'info');

    // Extract playlist ID
    let playlistId = youtubeInput;
    if (youtubeInput.includes('youtube.com') || youtubeInput.includes('youtu.be')) {
      try {
        const url = new URL(youtubeInput);
        const params = new URLSearchParams(url.search);
        playlistId = params.get('list') || youtubeInput;
      } catch (error) {
        this.showMixtapeTestResult('❌ Invalid YouTube URL format', 'error');
        return;
      }
    }

    // Test with YouTube API (similar to admin panel test)
    this.testPlaylistEmbedding(playlistId);
  }

  closeMixtapeEditor() {
    if (this.editorWindow) {
      this.editorWindow.remove();
      this.editorWindow = null;
    }
    this.currentEditingIndex = null;
  }

  deleteMixtape(index) {
    const mixtape = this.mixtapes[index];
    if (confirm(`Delete "${mixtape.name}"?`)) {
      this.mixtapes.splice(index, 1);
      this.saveMixtapes();
      this.refreshMixtapeList();
    }
  }
  
  loadMixtapes() {
    const saved = localStorage.getItem('faitMixtapes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading mixtapes:', error);
      }
    }
    return this.getDefaultMixtapes();
  }
  
  saveMixtapes() {
    localStorage.setItem('faitMixtapes', JSON.stringify(this.mixtapes));
  }
  
  getDefaultMixtapes() {
    return [
      {
        id: 'synthwave-essentials',
        name: 'Synthwave Essentials',
        description: 'The best of synthwave and retrowave',
        youtubePlaylistId: 'PLrAl6rYAS4Z7hWOgOgKjKW8VaOtMnKGWz',
        color: '#FF1493',
        trackCount: '42',
        duration: '2h 45m',
        tags: ['synthwave', 'retro']
      },
      {
        id: 'lofi-study',
        name: 'Lo-Fi Study Vibes',
        description: 'Perfect beats for studying and focus',
        youtubePlaylistId: 'PLOHoVaTp8R7eQDSiZifrpjsQy0WuCCYDr',
        color: '#8A2BE2',
        trackCount: '58',
        duration: '3h 12m',
        tags: ['lofi', 'study']
      }
    ];
  }
  
  getRandomColor() {
    const colors = ['#FF1493', '#8A2BE2', '#00FFFF', '#39FF14', '#FF6B9D', '#4ECDC4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  lightenColor(color) {
    // Simple color lightening
    return color + '80'; // Add transparency
  }
  
  showMixtapeTestResult(message, type = 'info') {
    if (!this.editorWindow) return;

    const testResults = this.editorWindow.querySelector('#mixtape-test-results');
    const testOutput = this.editorWindow.querySelector('#mixtape-test-output');

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
    testOutput.scrollTop = testOutput.scrollHeight;

    // Auto-clear old results if too many
    const results = testOutput.querySelectorAll('.test-result');
    if (results.length > 8) {
      results[0].remove();
    }
  }

  testPlaylistEmbedding(playlistId) {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      this.showMixtapeTestResult('⏳ Loading YouTube API...', 'info');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.testPlaylistEmbedding(playlistId);
      };
      return;
    }

    // Create a hidden test container
    let testContainer = document.getElementById('mixtape-test-container');
    if (!testContainer) {
      testContainer = document.createElement('div');
      testContainer.id = 'mixtape-test-container';
      testContainer.style.position = 'absolute';
      testContainer.style.top = '-1000px';
      testContainer.style.left = '-1000px';
      document.body.appendChild(testContainer);
    }

    // Create unique player container
    const playerId = `mixtape-test-player-${Date.now()}`;
    const playerDiv = document.createElement('div');
    playerDiv.id = playerId;
    testContainer.appendChild(playerDiv);

    let hasResponded = false;
    const timeout = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        this.showMixtapeTestResult('⏰ Test timeout - playlist may not be available', 'warning');
        cleanup();
      }
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      if (playerDiv.parentNode) {
        playerDiv.parentNode.removeChild(playerDiv);
      }
    }

    try {
      new YT.Player(playerId, {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          list: playlistId,
          listType: 'playlist'
        },
        events: {
          onReady: (event) => {
            if (!hasResponded) {
              hasResponded = true;
              this.showMixtapeTestResult('✅ Playlist test PASSED! This playlist can be embedded.', 'success');
              this.showMixtapeTestResult('💡 You can safely save this mixtape - it will work in the player.', 'info');
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
                  errorMessage = 'Invalid playlist ID';
                  suggestion = 'Check that the playlist ID is correct.';
                  break;
                case 5:
                  errorMessage = 'HTML5 player error';
                  suggestion = 'Try a different playlist - this one may have technical issues.';
                  break;
                case 100:
                  errorMessage = 'Playlist not found or private';
                  suggestion = 'Make sure the playlist is public and the ID is correct.';
                  break;
                case 101:
                case 150:
                  errorMessage = 'Playlist owner does not allow embedding';
                  suggestion = 'Find a different playlist that allows embedding.';
                  break;
                default:
                  errorMessage = `Error code: ${event.data}`;
                  suggestion = 'Try a different playlist.';
              }

              this.showMixtapeTestResult(`❌ Playlist test FAILED: ${errorMessage}`, 'error');
              this.showMixtapeTestResult(`💡 Suggestion: ${suggestion}`, 'warning');
              cleanup();
            }
          }
        }
      });
    } catch (error) {
      if (!hasResponded) {
        hasResponded = true;
        this.showMixtapeTestResult(`❌ Test failed: ${error.message}`, 'error');
        cleanup();
      }
    }
  }

  importMixtapes() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
              this.mixtapes = [...this.mixtapes, ...imported];
              this.saveMixtapes();
              this.refreshMixtapeList();
              // Use a simple alert for import success since it's not in the editor
              alert(`Imported ${imported.length} mixtapes!`);
            }
          } catch (error) {
            alert('Error importing mixtapes: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  }
}

window.MixtapesWindow = MixtapesWindow;
