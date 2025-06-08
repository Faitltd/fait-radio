class GuestbookWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.entries = this.loadEntries();
  }
  
  create() {
    const windowOptions = {
      id: 'guestbook',
      title: 'FAIT Guestbook',
      width: 550,
      height: 500,
      x: 300,
      y: 120,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshEntries();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="guestbook-container">
        <div class="guestbook-header">
          <h2>📝 FAIT Guestbook</h2>
          <p>Share your thoughts about FAIT Radio with the community</p>
        </div>
        
        <div class="guestbook-form">
          <h3>Sign the Guestbook</h3>
          <div class="form-group">
            <label>Your Name:</label>
            <input type="text" id="guest-name" placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label>Location:</label>
            <input type="text" id="guest-location" placeholder="Where are you listening from?">
          </div>
          <div class="form-group">
            <label>Favorite Genre:</label>
            <select id="guest-genre">
              <option value="">Select your favorite</option>
              <option value="synthwave">Synthwave</option>
              <option value="lofi">Lo-Fi</option>
              <option value="electronic">Electronic</option>
              <option value="ambient">Ambient</option>
              <option value="chillhop">Chillhop</option>
              <option value="jazz">Jazz</option>
            </select>
          </div>
          <div class="form-group">
            <label>Your Message:</label>
            <textarea id="guest-message" placeholder="Share your thoughts about FAIT Radio, your favorite tracks, or just say hello!"></textarea>
          </div>
          <div class="form-group">
            <label>Rating:</label>
            <div class="rating-stars" id="rating-stars">
              <span class="star" data-rating="1">⭐</span>
              <span class="star" data-rating="2">⭐</span>
              <span class="star" data-rating="3">⭐</span>
              <span class="star" data-rating="4">⭐</span>
              <span class="star" data-rating="5">⭐</span>
            </div>
          </div>
          <button class="btn-primary" id="sign-guestbook-btn">📝 Sign Guestbook</button>
        </div>
        
        <div class="guestbook-entries">
          <h3>Recent Entries (${this.entries.length})</h3>
          <div class="entries-list" id="entries-list">
            <!-- Entries will be populated here -->
          </div>
        </div>
        
        <div class="guestbook-stats">
          <div class="stat-item">
            <span class="stat-number">${this.entries.length}</span>
            <span class="stat-label">Total Entries</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${this.getAverageRating()}</span>
            <span class="stat-label">Avg Rating</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${this.getUniqueCountries()}</span>
            <span class="stat-label">Countries</span>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Rating stars
    this.windowElement.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', (e) => {
        this.setRating(parseInt(e.target.dataset.rating));
      });
      
      star.addEventListener('mouseover', (e) => {
        this.highlightStars(parseInt(e.target.dataset.rating));
      });
    });
    
    this.windowElement.querySelector('#rating-stars').addEventListener('mouseleave', () => {
      this.resetStarHighlight();
    });
    
    // Sign guestbook button
    this.windowElement.querySelector('#sign-guestbook-btn').addEventListener('click', () => {
      this.signGuestbook();
    });
  }
  
  setRating(rating) {
    this.selectedRating = rating;
    this.updateStarDisplay(rating);
  }
  
  highlightStars(rating) {
    const stars = this.windowElement.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.style.color = '#FFD700';
        star.style.textShadow = '0 0 10px #FFD700';
      } else {
        star.style.color = '#666';
        star.style.textShadow = 'none';
      }
    });
  }
  
  updateStarDisplay(rating) {
    this.highlightStars(rating);
  }
  
  resetStarHighlight() {
    if (this.selectedRating) {
      this.updateStarDisplay(this.selectedRating);
    } else {
      this.highlightStars(0);
    }
  }
  
  signGuestbook() {
    const name = this.windowElement.querySelector('#guest-name').value.trim();
    const location = this.windowElement.querySelector('#guest-location').value.trim();
    const genre = this.windowElement.querySelector('#guest-genre').value;
    const message = this.windowElement.querySelector('#guest-message').value.trim();
    const rating = this.selectedRating || 5;
    
    if (!name || !message) {
      alert('Please fill in your name and message');
      return;
    }
    
    const newEntry = {
      id: 'entry-' + Date.now(),
      name: name,
      location: location || 'Unknown',
      genre: genre || 'Not specified',
      message: message,
      rating: rating,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    this.entries.unshift(newEntry); // Add to beginning
    this.saveEntries();
    
    // Clear form
    this.clearForm();
    
    // Refresh display
    this.refreshEntries();
    this.updateStats();
    
    // Show success message
    alert('Thank you for signing our guestbook! 🎵');
  }
  
  clearForm() {
    this.windowElement.querySelector('#guest-name').value = '';
    this.windowElement.querySelector('#guest-location').value = '';
    this.windowElement.querySelector('#guest-genre').value = '';
    this.windowElement.querySelector('#guest-message').value = '';
    this.selectedRating = null;
    this.resetStarHighlight();
  }
  
  refreshEntries() {
    const list = this.windowElement.querySelector('#entries-list');
    list.innerHTML = '';
    
    if (this.entries.length === 0) {
      list.innerHTML = '<div class="no-entries">No entries yet. Be the first to sign!</div>';
      return;
    }
    
    // Show latest 10 entries
    const recentEntries = this.entries.slice(0, 10);
    
    recentEntries.forEach((entry, index) => {
      const entryElement = document.createElement('div');
      entryElement.className = 'guestbook-entry';
      entryElement.innerHTML = `
        <div class="entry-header">
          <div class="entry-info">
            <strong>${entry.name}</strong>
            ${entry.location !== 'Unknown' ? `<span class="location">📍 ${entry.location}</span>` : ''}
            ${entry.genre !== 'Not specified' ? `<span class="genre">🎵 ${entry.genre}</span>` : ''}
          </div>
          <div class="entry-meta">
            <div class="entry-rating">
              ${this.generateStarRating(entry.rating)}
            </div>
            <div class="entry-date">${this.formatDate(entry.timestamp)}</div>
          </div>
        </div>
        <div class="entry-message">
          "${entry.message}"
        </div>
        <div class="entry-actions">
          <button class="btn-small like-btn" data-index="${index}">
            ${entry.liked ? '❤️' : '🤍'} ${entry.likes}
          </button>
          <button class="btn-small reply-btn" data-index="${index}">💬 Reply</button>
        </div>
      `;
      
      list.appendChild(entryElement);
    });
    
    // Add event listeners for entry actions
    this.setupEntryActions();
  }
  
  setupEntryActions() {
    // Like buttons
    this.windowElement.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.toggleLike(index);
      });
    });
    
    // Reply buttons
    this.windowElement.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.replyToEntry(index);
      });
    });
  }
  
  toggleLike(index) {
    const entry = this.entries[index];
    entry.liked = !entry.liked;
    entry.likes += entry.liked ? 1 : -1;
    
    this.saveEntries();
    this.refreshEntries();
  }
  
  replyToEntry(index) {
    const entry = this.entries[index];
    const reply = prompt(`Reply to ${entry.name}:\n\n"${entry.message.substring(0, 100)}..."\n\nYour reply:`);
    
    if (reply) {
      alert(`Reply sent to ${entry.name}!\n\nIn a real app, this would notify the user.`);
    }
  }
  
  generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<span class="star filled">⭐</span>';
      } else {
        stars += '<span class="star empty">☆</span>';
      }
    }
    return stars;
  }
  
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  updateStats() {
    // Update the header with new count
    const header = this.windowElement.querySelector('.guestbook-entries h3');
    header.textContent = `Recent Entries (${this.entries.length})`;
    
    // Update stats
    const statNumbers = this.windowElement.querySelectorAll('.stat-number');
    statNumbers[0].textContent = this.entries.length;
    statNumbers[1].textContent = this.getAverageRating();
    statNumbers[2].textContent = this.getUniqueCountries();
  }
  
  getAverageRating() {
    if (this.entries.length === 0) return '0.0';
    
    const totalRating = this.entries.reduce((sum, entry) => sum + entry.rating, 0);
    return (totalRating / this.entries.length).toFixed(1);
  }
  
  getUniqueCountries() {
    const countries = new Set();
    this.entries.forEach(entry => {
      if (entry.location && entry.location !== 'Unknown') {
        // Extract country from location (simple approach)
        const parts = entry.location.split(',');
        const country = parts[parts.length - 1].trim();
        countries.add(country);
      }
    });
    return countries.size;
  }
  
  loadEntries() {
    const saved = localStorage.getItem('faitGuestbook');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading guestbook entries:', error);
      }
    }
    return this.getDefaultEntries();
  }
  
  saveEntries() {
    localStorage.setItem('faitGuestbook', JSON.stringify(this.entries));
  }
  
  getDefaultEntries() {
    return [
      {
        id: 'entry-1',
        name: 'Alex Chen',
        location: 'Tokyo, Japan',
        genre: 'synthwave',
        message: 'Amazing radio station! The synthwave selection is incredible. Listening from Tokyo and loving every beat! 🎵',
        rating: 5,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        likes: 3,
        liked: false
      },
      {
        id: 'entry-2',
        name: 'Sarah Johnson',
        location: 'New York, USA',
        genre: 'lofi',
        message: 'Perfect for studying! The lo-fi collection helps me focus so much better. Thank you for creating this space! 📚',
        rating: 5,
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        likes: 5,
        liked: true
      },
      {
        id: 'entry-3',
        name: 'Marco Silva',
        location: 'São Paulo, Brazil',
        genre: 'electronic',
        message: 'Descobri essa rádio ontem e já virou minha favorita! The electronic mixes are fire! 🔥',
        rating: 4,
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        likes: 2,
        liked: false
      }
    ];
  }
}

window.GuestbookWindow = GuestbookWindow;
