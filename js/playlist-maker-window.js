class PlaylistMakerWindow {
  constructor(windowManager, youtubePlayer) {
    this.windowManager = windowManager;
    this.youtubePlayer = youtubePlayer;
    this.windowElement = null;
    this.currentPlaylist = [];
    this.searchResults = [];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.playlists = this.loadPlaylists();
  }
  
  create() {
    const windowOptions = {
      id: 'playlist-maker',
      title: 'FAIT Playlist Maker',
      width: 800,
      height: 600,
      x: 100,
      y: 50,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshPlaylistsList();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="playlist-maker-container">
        <div class="playlist-maker-header">
          <h2>🎵 Playlist Maker</h2>
          <div class="header-controls">
            <button class="btn-primary" id="new-playlist-btn">+ New Playlist</button>
            <button class="btn-secondary" id="save-playlist-btn">💾 Save</button>
            <button class="btn-secondary" id="load-playlist-btn">📂 Load</button>
          </div>
        </div>
        
        <div class="playlist-maker-content">
          <div class="search-section">
            <h3>🔍 Search Videos</h3>
            <div class="search-controls">
              <input type="text" id="search-input" placeholder="Search for music videos, artists, genres..." value="lofi">
              <button class="btn-primary" id="search-btn">Search</button>
              <button class="btn-secondary" id="test-search-btn">🧪 Test</button>
              <select id="search-type">
                <option value="video">Videos</option>
                <option value="channel">Channels</option>
                <option value="playlist">Playlists</option>
              </select>
            </div>
            <div class="search-results" id="search-results">
              <div class="no-results">Enter a search term to find videos</div>
            </div>
          </div>
          
          <div class="playlist-section">
            <h3>📋 Current Playlist</h3>
            <div class="playlist-info">
              <input type="text" id="playlist-name" placeholder="Enter playlist name..." value="My Playlist">
              <span class="track-count">0 tracks</span>
              <span class="total-duration">0:00</span>
            </div>
            <div class="playlist-tracks" id="playlist-tracks">
              <div class="no-tracks">No tracks added yet. Search and add videos above.</div>
            </div>
          </div>
        </div>
        
        <div class="playlist-player">
          <div class="player-controls">
            <button class="btn-control" id="prev-btn">⏮️</button>
            <button class="btn-control" id="play-pause-btn">▶️</button>
            <button class="btn-control" id="next-btn">⏭️</button>
            <button class="btn-control" id="shuffle-btn">🔀</button>
            <button class="btn-control" id="repeat-btn">🔁</button>
          </div>
          <div class="now-playing" id="now-playing">
            <span class="track-title">No track selected</span>
            <div class="progress-bar">
              <div class="progress" id="progress"></div>
            </div>
          </div>
        </div>
        
        <div class="saved-playlists">
          <h3>💾 Saved Playlists</h3>
          <div class="playlists-list" id="playlists-list">
            <!-- Saved playlists will appear here -->
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Search functionality
    this.windowElement.querySelector('#search-btn').addEventListener('click', () => {
      this.performSearch();
    });
    
    this.windowElement.querySelector('#search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // Test search button
    this.windowElement.querySelector('#test-search-btn').addEventListener('click', () => {
      this.testSearch();
    });
    
    // Playlist controls
    this.windowElement.querySelector('#new-playlist-btn').addEventListener('click', () => {
      this.createNewPlaylist();
    });
    
    this.windowElement.querySelector('#save-playlist-btn').addEventListener('click', () => {
      this.saveCurrentPlaylist();
    });
    
    this.windowElement.querySelector('#load-playlist-btn').addEventListener('click', () => {
      this.showLoadPlaylistDialog();
    });
    
    // Player controls
    this.windowElement.querySelector('#play-pause-btn').addEventListener('click', () => {
      this.togglePlayback();
    });
    
    this.windowElement.querySelector('#prev-btn').addEventListener('click', () => {
      this.previousTrack();
    });
    
    this.windowElement.querySelector('#next-btn').addEventListener('click', () => {
      this.nextTrack();
    });
    
    this.windowElement.querySelector('#shuffle-btn').addEventListener('click', () => {
      this.toggleShuffle();
    });
    
    this.windowElement.querySelector('#repeat-btn').addEventListener('click', () => {
      this.toggleRepeat();
    });
    
    // Listen for YouTube player events
    if (this.youtubePlayer) {
      this.youtubePlayer.addEventListener('ended', () => {
        console.log('🔚 Track ended, playing next');
        this.nextTrack();
      });

      this.youtubePlayer.addEventListener('play', () => {
        console.log('▶️ YouTube player started playing');
        this.isPlaying = true;
        this.updatePlaylistDisplay();
        this.updatePlayPauseButton();
      });

      this.youtubePlayer.addEventListener('pause', () => {
        console.log('⏸️ YouTube player paused');
        this.isPlaying = false;
        this.updatePlaylistDisplay();
        this.updatePlayPauseButton();
      });

      this.youtubePlayer.addEventListener('stateChange', (event) => {
        this.updatePlayerState(event.state);
      });
    }
  }
  
  performSearch() {
    const query = this.windowElement.querySelector('#search-input').value.trim();
    const searchType = this.windowElement.querySelector('#search-type').value;

    console.log('🔍 Starting search...');
    console.log('Query:', query);
    console.log('Search type:', searchType);
    console.log('Window element:', this.windowElement);

    if (!query) {
      console.log('❌ Empty query');
      alert('Please enter a search term');
      return;
    }

    console.log('🔍 Searching for:', query, 'Type:', searchType);
    this.updateSearchResults('Searching...', 'info');

    // Simulate YouTube search (in a real app, you'd use YouTube Data API)
    this.simulateYouTubeSearch(query, searchType);
  }

  testSearch() {
    console.log('🧪 Running test search...');

    // Test with hardcoded data
    const testResults = [
      {
        id: 'jfKfPfyJRdk',
        title: 'LoFi Hip Hop Radio - Beats to Relax/Study to',
        channel: 'LoFi Girl',
        duration: 'LIVE',
        thumbnail: '🎵',
        description: '24/7 chill beats for studying and relaxing'
      },
      {
        id: 'MVPTGNGiI-4',
        title: 'Synthwave Radio - 24/7 Retro Music',
        channel: 'Synthwave Radio',
        duration: 'LIVE',
        thumbnail: '🌆',
        description: 'Non-stop synthwave and retrowave music'
      }
    ];

    console.log('🎯 Setting test results:', testResults);
    this.searchResults = testResults;
    this.displaySearchResults();
  }
  
  simulateYouTubeSearch(query, type) {
    console.log('🎵 Simulating YouTube search...');

    // Simulate search results with realistic data
    const mockResults = this.generateMockSearchResults(query, type);
    console.log('📊 Generated results:', mockResults.length, 'tracks');

    setTimeout(() => {
      this.searchResults = mockResults;
      console.log('✅ Search results set:', this.searchResults.length);
      this.displaySearchResults();
    }, 1000);
  }
  
  generateMockSearchResults(query, type) {
    // Comprehensive mock database of music content
    const musicDatabase = [
      // LoFi & Chill
      { id: 'jfKfPfyJRdk', title: 'LoFi Hip Hop Radio - Beats to Relax/Study to', channel: 'LoFi Girl', duration: 'LIVE', thumbnail: '🎵', genre: 'lofi', description: '24/7 chill beats for studying and relaxing' },
      { id: '5qap5aO4i9A', title: 'Chillhop Radio - jazzy & lofi hip hop beats', channel: 'Chillhop Music', duration: 'LIVE', thumbnail: '🎧', genre: 'lofi', description: 'Relaxing beats for work and study' },
      { id: 'rUxyKA_-grg', title: 'Chillhop Cafe - Study & Relax Music', channel: 'Chillhop Music', duration: '1:45:20', thumbnail: '☕', genre: 'lofi', description: 'Perfect background music for productivity' },

      // Synthwave & Retro
      { id: 'MVPTGNGiI-4', title: 'Synthwave Radio - 24/7 Retro Music', channel: 'Synthwave Radio', duration: 'LIVE', thumbnail: '🌆', genre: 'synthwave', description: 'Non-stop synthwave and retrowave music' },
      { id: 'WQFioUONjQs', title: 'Cyberpunk 2077 Radio - Outrun Mix', channel: 'Retro Future', duration: '2:30:15', thumbnail: '🚗', genre: 'synthwave', description: 'Futuristic synthwave for night drives' },
      { id: 'MV_3Dpw-BRY', title: 'Miami Vice Synthwave Mix', channel: 'Neon Nights', duration: '1:20:45', thumbnail: '🌴', genre: 'synthwave', description: '80s inspired electronic music' },

      // Jazz & Classical
      { id: 'Dx5qFachd3A', title: 'Smooth Jazz Radio - 24/7 Live Stream', channel: 'Jazz Radio', duration: 'LIVE', thumbnail: '🎷', genre: 'jazz', description: 'Smooth jazz for relaxation and ambiance' },
      { id: 'vmDDOFXSgAs', title: 'Coffee Shop Jazz - Relaxing Instrumental', channel: 'Jazz Cafe', duration: '3:15:30', thumbnail: '☕', genre: 'jazz', description: 'Perfect jazz for coffee shops and study' },
      { id: 'jgpJVI3tDbY', title: 'Classical Music for Studying', channel: 'Classical Focus', duration: '4:00:00', thumbnail: '🎼', genre: 'classical', description: 'Concentration music from the masters' },

      // Ambient & Focus
      { id: 'kgx4WGK0oNU', title: 'Deep Focus - Music For Studying, Concentration', channel: 'Ambient Worlds', duration: '2:15:30', thumbnail: '🧘', genre: 'ambient', description: 'Ambient music for deep concentration' },
      { id: 'DWcJFNfaw9c', title: 'Space Ambient Music - 8 Hours', channel: 'Space Sounds', duration: '8:00:00', thumbnail: '🌌', genre: 'ambient', description: 'Journey through the cosmos with ambient sounds' },
      { id: 'lFcSrYw-ARY', title: 'Rain Sounds for Sleep', channel: 'Nature Sounds', duration: '10:00:00', thumbnail: '🌧️', genre: 'ambient', description: 'Natural rain sounds for relaxation' },

      // Electronic & Dance
      { id: 'bM7SZ5SBzyY', title: 'House Music Mix 2024', channel: 'Electronic Vibes', duration: '1:30:45', thumbnail: '🎛️', genre: 'electronic', description: 'Latest house and electronic beats' },
      { id: 'fBYVlFXsEME', title: 'Techno Underground Mix', channel: 'Underground Beats', duration: '2:00:00', thumbnail: '🔊', genre: 'electronic', description: 'Deep techno for late night sessions' },
      { id: 'QcZKDSk4wP4', title: 'Drum & Bass Energy Mix', channel: 'DNB Radio', duration: '1:15:20', thumbnail: '⚡', genre: 'electronic', description: 'High energy drum and bass' },

      // Hip Hop & Rap
      { id: 'fOGwVaEPassA', title: 'Old School Hip Hop Mix', channel: 'Hip Hop Classics', duration: '2:45:30', thumbnail: '🎤', genre: 'hiphop', description: 'Classic hip hop from the golden era' },
      { id: 'YQHsXMglC9A', title: 'Chill Rap & Hip Hop Beats', channel: 'Chill Rap', duration: '1:55:15', thumbnail: '🎯', genre: 'hiphop', description: 'Laid back rap and hip hop vibes' },

      // Rock & Alternative
      { id: 'tkzY_VwNIek', title: 'Classic Rock Hits Radio', channel: 'Rock Legends', duration: 'LIVE', thumbnail: '🎸', genre: 'rock', description: 'Non-stop classic rock hits' },
      { id: 'HSvn_r2E-60', title: 'Indie Rock Playlist 2024', channel: 'Indie Central', duration: '2:20:30', thumbnail: '🎵', genre: 'rock', description: 'Best indie rock tracks of the year' },

      // World & Cultural
      { id: 'UfcAVejslrU', title: 'Japanese City Pop Mix', channel: 'Tokyo Nights', duration: '1:40:25', thumbnail: '🏙️', genre: 'world', description: 'Nostalgic Japanese city pop from the 80s' },
      { id: 'kxopViU98Xo', title: 'Bossa Nova Cafe Music', channel: 'Brazilian Vibes', duration: '2:10:15', thumbnail: '🇧🇷', genre: 'world', description: 'Smooth bossa nova from Brazil' },

      // Gaming & Anime
      { id: 'tum-jJVKzPE', title: 'Video Game Music Mix', channel: 'Gaming Beats', duration: '3:30:00', thumbnail: '🎮', genre: 'gaming', description: 'Epic video game soundtracks' },
      { id: 'sEQf5lcnj_o', title: 'Anime Opening Songs Mix', channel: 'Anime Music', duration: '2:00:45', thumbnail: '🌸', genre: 'anime', description: 'Best anime opening themes' }
    ];

    // Smart search algorithm
    const searchTerms = query.toLowerCase().split(' ');
    const results = musicDatabase.filter(track => {
      const searchableText = `${track.title} ${track.channel} ${track.description} ${track.genre}`.toLowerCase();

      // Check if any search term matches
      return searchTerms.some(term =>
        searchableText.includes(term) ||
        track.genre.includes(term) ||
        this.fuzzyMatch(term, searchableText)
      );
    });

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aRelevance = this.calculateRelevance(query, a);
      const bRelevance = this.calculateRelevance(query, b);
      return bRelevance - aRelevance;
    });

    return results.slice(0, 15); // Return top 15 results
  }

  calculateRelevance(query, track) {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Exact title match gets highest score
    if (track.title.toLowerCase().includes(queryLower)) score += 10;

    // Channel match
    if (track.channel.toLowerCase().includes(queryLower)) score += 5;

    // Genre match
    if (track.genre.toLowerCase().includes(queryLower)) score += 8;

    // Description match
    if (track.description.toLowerCase().includes(queryLower)) score += 3;

    // Bonus for live streams
    if (track.duration === 'LIVE') score += 2;

    return score;
  }

  fuzzyMatch(term, text) {
    // Simple fuzzy matching for typos
    if (term.length < 3) return false;

    const variations = [
      term,
      term.slice(0, -1), // Remove last character
      term + 's', // Add plural
      term.replace(/(.)\1+/g, '$1') // Remove duplicate characters
    ];

    return variations.some(variation => text.includes(variation));
  }
  
  displaySearchResults() {
    console.log('🎯 Displaying search results...');
    const resultsContainer = this.windowElement.querySelector('#search-results');
    console.log('Results container:', resultsContainer);
    console.log('Search results:', this.searchResults);

    if (!resultsContainer) {
      console.error('❌ Results container not found!');
      return;
    }

    if (this.searchResults.length === 0) {
      console.log('⚠️ No results to display');
      resultsContainer.innerHTML = '<div class="no-results">No results found. Try a different search term.</div>';
      return;
    }

    console.log('✅ Displaying', this.searchResults.length, 'results');
    
    resultsContainer.innerHTML = this.searchResults.map((result, index) => `
      <div class="search-result-item">
        <div class="result-thumbnail">${result.thumbnail}</div>
        <div class="result-info">
          <h4>${result.title}</h4>
          <p class="result-channel">${result.channel}</p>
          <p class="result-description">${result.description}</p>
          <span class="result-duration">${result.duration}</span>
        </div>
        <div class="result-actions">
          <button class="btn-small add-to-playlist" data-index="${index}">+ Add</button>
          <button class="btn-small preview-track" data-index="${index}">👁️ Preview</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners for result actions
    this.setupSearchResultActions();
  }
  
  setupSearchResultActions() {
    // Add to playlist buttons
    this.windowElement.querySelectorAll('.add-to-playlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.addToPlaylist(this.searchResults[index]);
      });
    });
    
    // Preview buttons
    this.windowElement.querySelectorAll('.preview-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.previewTrack(this.searchResults[index]);
      });
    });
  }
  
  addToPlaylist(track) {
    // Add unique ID to track
    const playlistTrack = {
      ...track,
      playlistId: Date.now() + Math.random(),
      addedAt: new Date().toISOString()
    };
    
    this.currentPlaylist.push(playlistTrack);
    this.updatePlaylistDisplay();
    this.updatePlaylistInfo();
    
    console.log('🎵 Added to playlist:', track.title);
  }
  
  updatePlaylistDisplay() {
    const tracksContainer = this.windowElement.querySelector('#playlist-tracks');
    
    if (this.currentPlaylist.length === 0) {
      tracksContainer.innerHTML = '<div class="no-tracks">No tracks added yet. Search and add videos above.</div>';
      return;
    }
    
    tracksContainer.innerHTML = this.currentPlaylist.map((track, index) => `
      <div class="playlist-track ${index === this.currentTrackIndex ? 'current' : ''}">
        <div class="track-number">${index + 1}</div>
        <div class="track-thumbnail">${track.thumbnail}</div>
        <div class="track-info">
          <h4>${track.title}</h4>
          <p>${track.channel}</p>
          <span class="track-duration">${track.duration}</span>
        </div>
        <div class="track-actions">
          <button class="btn-small play-pause-track ${index === this.currentTrackIndex && this.isPlaying ? 'playing' : ''}" data-index="${index}">
            ${index === this.currentTrackIndex && this.isPlaying ? '⏸️' : '▶️'}
          </button>
          <button class="btn-small move-up" data-index="${index}">⬆️</button>
          <button class="btn-small move-down" data-index="${index}">⬇️</button>
          <button class="btn-small remove-track" data-index="${index}">🗑️</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners for track actions
    this.setupPlaylistTrackActions();
  }
  
  setupPlaylistTrackActions() {
    // Play/Pause track buttons
    this.windowElement.querySelectorAll('.play-pause-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.toggleTrackPlayback(index);
      });
    });
    
    // Move up buttons
    this.windowElement.querySelectorAll('.move-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.moveTrack(index, -1);
      });
    });
    
    // Move down buttons
    this.windowElement.querySelectorAll('.move-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.moveTrack(index, 1);
      });
    });
    
    // Remove track buttons
    this.windowElement.querySelectorAll('.remove-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeTrack(index);
      });
    });
  }
  
  updatePlaylistInfo() {
    const trackCount = this.windowElement.querySelector('.track-count');
    const totalDuration = this.windowElement.querySelector('.total-duration');
    
    trackCount.textContent = `${this.currentPlaylist.length} tracks`;
    
    // Calculate total duration (simplified)
    let totalMinutes = 0;
    this.currentPlaylist.forEach(track => {
      if (track.duration !== 'LIVE') {
        // Parse duration like "2:15:30" or "3:45"
        const parts = track.duration.split(':');
        if (parts.length === 3) {
          totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 2) {
          totalMinutes += parseInt(parts[0]);
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    totalDuration.textContent = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:00` : `${minutes}:00`;
  }
  
  toggleTrackPlayback(index) {
    console.log('🎵 Toggle playback for track index:', index);

    // If clicking on the currently playing track, toggle play/pause
    if (index === this.currentTrackIndex && this.isPlaying) {
      console.log('⏸️ Pausing current track');
      this.youtubePlayer.pause();
      this.isPlaying = false;
    } else if (index === this.currentTrackIndex && !this.isPlaying) {
      console.log('▶️ Resuming current track');
      this.youtubePlayer.play();
      this.isPlaying = true;
    } else {
      // Play a different track
      console.log('🎵 Playing new track:', index);
      this.playTrack(index);
    }

    this.updatePlaylistDisplay();
    this.updatePlayPauseButton();
  }

  playTrack(index) {
    if (index < 0 || index >= this.currentPlaylist.length) return;

    this.currentTrackIndex = index;
    const track = this.currentPlaylist[index];

    console.log('🎵 Playing track:', track.title);

    // Update now playing display
    this.updateNowPlaying(track);

    // Load track in YouTube player
    if (this.youtubePlayer) {
      const stationData = {
        id: track.playlistId,
        name: track.title,
        description: track.channel,
        youtubeId: track.id
      };

      this.youtubePlayer.loadStation(stationData);
    }

    this.isPlaying = true;
    this.updatePlaylistDisplay();
    this.updatePlayPauseButton();
  }
  
  updateNowPlaying(track) {
    const nowPlaying = this.windowElement.querySelector('#now-playing .track-title');
    nowPlaying.textContent = `${track.title} - ${track.channel}`;
  }
  
  togglePlayback() {
    console.log('🎵 Main play/pause button clicked');

    if (this.currentPlaylist.length === 0) {
      alert('Add some tracks to the playlist first!');
      return;
    }

    if (this.isPlaying) {
      console.log('⏸️ Pausing playback');
      this.youtubePlayer.pause();
      this.isPlaying = false;
    } else {
      if (this.currentTrackIndex >= 0) {
        console.log('▶️ Resuming playback');
        this.youtubePlayer.play();
        this.isPlaying = true;
      } else {
        console.log('🎵 Starting first track');
        this.playTrack(0);
      }
    }

    this.updatePlaylistDisplay();
    this.updatePlayPauseButton();
  }
  
  updatePlayPauseButton() {
    const btn = this.windowElement.querySelector('#play-pause-btn');
    if (btn) {
      btn.textContent = this.isPlaying ? '⏸️' : '▶️';

      // Add/remove playing class for visual feedback
      if (this.isPlaying) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    }
  }

  updatePlayerState(state) {
    console.log('🎵 YouTube player state changed:', state);

    // Handle different YouTube player states
    switch (state) {
      case 1: // PLAYING
        this.isPlaying = true;
        break;
      case 2: // PAUSED
        this.isPlaying = false;
        break;
      case 0: // ENDED
        this.isPlaying = false;
        this.nextTrack();
        break;
      case 3: // BUFFERING
        // Keep current playing state during buffering
        break;
    }

    this.updatePlaylistDisplay();
    this.updatePlayPauseButton();
  }
  
  nextTrack() {
    if (this.currentTrackIndex < this.currentPlaylist.length - 1) {
      this.playTrack(this.currentTrackIndex + 1);
    } else if (this.repeatMode) {
      this.playTrack(0); // Loop back to start
    } else {
      this.isPlaying = false;
      this.updatePlayPauseButton();
      console.log('🔚 Playlist ended');
    }
  }
  
  previousTrack() {
    if (this.currentTrackIndex > 0) {
      this.playTrack(this.currentTrackIndex - 1);
    }
  }
  
  moveTrack(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.currentPlaylist.length) return;
    
    // Swap tracks
    const track = this.currentPlaylist[index];
    this.currentPlaylist[index] = this.currentPlaylist[newIndex];
    this.currentPlaylist[newIndex] = track;
    
    // Update current track index if needed
    if (this.currentTrackIndex === index) {
      this.currentTrackIndex = newIndex;
    } else if (this.currentTrackIndex === newIndex) {
      this.currentTrackIndex = index;
    }
    
    this.updatePlaylistDisplay();
  }
  
  removeTrack(index) {
    this.currentPlaylist.splice(index, 1);
    
    // Adjust current track index
    if (this.currentTrackIndex > index) {
      this.currentTrackIndex--;
    } else if (this.currentTrackIndex === index) {
      this.currentTrackIndex = -1;
      this.isPlaying = false;
      this.updatePlayPauseButton();
    }
    
    this.updatePlaylistDisplay();
    this.updatePlaylistInfo();
  }
  
  createNewPlaylist() {
    if (this.currentPlaylist.length > 0) {
      if (!confirm('Create new playlist? Current playlist will be cleared.')) {
        return;
      }
    }
    
    this.currentPlaylist = [];
    this.currentTrackIndex = -1;
    this.isPlaying = false;
    
    this.windowElement.querySelector('#playlist-name').value = 'New Playlist';
    this.updatePlaylistDisplay();
    this.updatePlaylistInfo();
    this.updatePlayPauseButton();
    
    console.log('📋 New playlist created');
  }
  
  saveCurrentPlaylist() {
    const name = this.windowElement.querySelector('#playlist-name').value.trim();
    
    if (!name) {
      alert('Please enter a playlist name');
      return;
    }
    
    if (this.currentPlaylist.length === 0) {
      alert('Add some tracks to the playlist first');
      return;
    }
    
    const playlist = {
      id: 'playlist-' + Date.now(),
      name: name,
      tracks: [...this.currentPlaylist],
      createdAt: new Date().toISOString(),
      trackCount: this.currentPlaylist.length
    };
    
    this.playlists.push(playlist);
    this.savePlaylists();
    this.refreshPlaylistsList();
    
    alert(`Playlist "${name}" saved successfully!`);
    console.log('💾 Playlist saved:', name);
  }
  
  refreshPlaylistsList() {
    const listContainer = this.windowElement.querySelector('#playlists-list');
    
    if (this.playlists.length === 0) {
      listContainer.innerHTML = '<div class="no-playlists">No saved playlists yet.</div>';
      return;
    }
    
    listContainer.innerHTML = this.playlists.map((playlist, index) => `
      <div class="saved-playlist-item">
        <div class="playlist-info">
          <h4>${playlist.name}</h4>
          <p>${playlist.trackCount} tracks • ${new Date(playlist.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="playlist-actions">
          <button class="btn-small load-playlist" data-index="${index}">📂 Load</button>
          <button class="btn-small delete-playlist" data-index="${index}">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners
    this.setupSavedPlaylistActions();
  }
  
  setupSavedPlaylistActions() {
    this.windowElement.querySelectorAll('.load-playlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.loadPlaylist(this.playlists[index]);
      });
    });
    
    this.windowElement.querySelectorAll('.delete-playlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deletePlaylist(index);
      });
    });
  }
  
  loadPlaylist(playlist) {
    if (confirm(`Load playlist "${playlist.name}"? Current playlist will be replaced.`)) {
      this.currentPlaylist = [...playlist.tracks];
      this.currentTrackIndex = -1;
      this.isPlaying = false;
      
      this.windowElement.querySelector('#playlist-name').value = playlist.name;
      this.updatePlaylistDisplay();
      this.updatePlaylistInfo();
      this.updatePlayPauseButton();
      
      console.log('📂 Playlist loaded:', playlist.name);
    }
  }
  
  deletePlaylist(index) {
    const playlist = this.playlists[index];
    if (confirm(`Delete playlist "${playlist.name}"?`)) {
      this.playlists.splice(index, 1);
      this.savePlaylists();
      this.refreshPlaylistsList();
      console.log('🗑️ Playlist deleted:', playlist.name);
    }
  }
  
  loadPlaylists() {
    const saved = localStorage.getItem('faitCustomPlaylists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading playlists:', error);
      }
    }
    return [];
  }
  
  savePlaylists() {
    localStorage.setItem('faitCustomPlaylists', JSON.stringify(this.playlists));
  }
  
  previewTrack(track) {
    console.log('👁️ Previewing track:', track.title);
    // In a real implementation, this could open a small preview player
    alert(`Preview: ${track.title}\nChannel: ${track.channel}\nDuration: ${track.duration}`);
  }
  
  toggleShuffle() {
    this.shuffleMode = !this.shuffleMode;
    const btn = this.windowElement.querySelector('#shuffle-btn');
    btn.style.opacity = this.shuffleMode ? '1' : '0.5';
    console.log('🔀 Shuffle:', this.shuffleMode ? 'ON' : 'OFF');
  }
  
  toggleRepeat() {
    this.repeatMode = !this.repeatMode;
    const btn = this.windowElement.querySelector('#repeat-btn');
    btn.style.opacity = this.repeatMode ? '1' : '0.5';
    console.log('🔁 Repeat:', this.repeatMode ? 'ON' : 'OFF');
  }
  
  updateSearchResults(message, type) {
    const resultsContainer = this.windowElement.querySelector('#search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = `<div class="${type}">${message}</div>`;
      console.log('✅ Updated search results with message:', message);
    } else {
      console.error('❌ Could not find search results container');
    }
  }
}

window.PlaylistMakerWindow = PlaylistMakerWindow;
