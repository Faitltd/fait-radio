class SocialWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.posts = this.loadPosts();
    this.currentTab = 'feed';
  }
  
  create() {
    const windowOptions = {
      id: 'social',
      title: 'FAIT Social',
      width: 450,
      height: 600,
      x: 400,
      y: 100,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshFeed();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="social-container">
        <div class="social-header">
          <h2>📸 FAIT Social</h2>
          <div class="social-tabs">
            <button class="tab-btn active" data-tab="feed">Feed</button>
            <button class="tab-btn" data-tab="share">Share</button>
            <button class="tab-btn" data-tab="discover">Discover</button>
          </div>
        </div>
        
        <div class="social-content">
          <div class="tab-content" id="feed-tab">
            <div class="posts-feed" id="posts-feed">
              <!-- Posts will be populated here -->
            </div>
          </div>
          
          <div class="tab-content" id="share-tab" style="display: none;">
            <div class="share-form">
              <h3>Share What You're Listening To</h3>
              <textarea id="post-text" placeholder="What's on your mind? Share your current vibe..."></textarea>
              <div class="share-options">
                <button class="btn-secondary" id="add-music-btn">🎵 Add Music</button>
                <button class="btn-secondary" id="add-image-btn">📷 Add Image</button>
              </div>
              <button class="btn-primary" id="share-post-btn">Share Post</button>
            </div>
          </div>
          
          <div class="tab-content" id="discover-tab" style="display: none;">
            <div class="discover-content">
              <h3>Discover New Music</h3>
              <div class="trending-hashtags">
                <h4>Trending:</h4>
                <span class="hashtag">#synthwave</span>
                <span class="hashtag">#lofi</span>
                <span class="hashtag">#chillhop</span>
                <span class="hashtag">#ambient</span>
                <span class="hashtag">#electronic</span>
              </div>
              <div class="featured-artists">
                <h4>Featured Artists:</h4>
                <div class="artist-grid">
                  <div class="artist-card">
                    <div class="artist-avatar">🎵</div>
                    <div class="artist-name">SynthMaster</div>
                    <div class="artist-followers">1.2K followers</div>
                  </div>
                  <div class="artist-card">
                    <div class="artist-avatar">🎧</div>
                    <div class="artist-name">LoFi Dreams</div>
                    <div class="artist-followers">856 followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Tab switching
    this.windowElement.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
        
        // Update active state
        this.windowElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Share post
    this.windowElement.querySelector('#share-post-btn').addEventListener('click', () => {
      this.sharePost();
    });
    
    // Add music/image buttons
    this.windowElement.querySelector('#add-music-btn').addEventListener('click', () => {
      this.addMusicToPost();
    });
    
    this.windowElement.querySelector('#add-image-btn').addEventListener('click', () => {
      this.addImageToPost();
    });
    
    // Hashtag clicks
    this.windowElement.querySelectorAll('.hashtag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        this.searchHashtag(e.target.textContent);
      });
    });
  }
  
  switchTab(tab) {
    this.currentTab = tab;
    
    // Hide all tab contents
    this.windowElement.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = 'none';
    });
    
    // Show selected tab
    this.windowElement.querySelector(`#${tab}-tab`).style.display = 'block';
    
    if (tab === 'feed') {
      this.refreshFeed();
    }
  }
  
  refreshFeed() {
    const feed = this.windowElement.querySelector('#posts-feed');
    feed.innerHTML = '';
    
    if (this.posts.length === 0) {
      feed.innerHTML = '<div class="no-posts">No posts yet. Be the first to share!</div>';
      return;
    }
    
    this.posts.forEach((post, index) => {
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      postElement.innerHTML = `
        <div class="post-header">
          <div class="post-avatar">${post.avatar}</div>
          <div class="post-user-info">
            <div class="post-username">${post.username}</div>
            <div class="post-time">${this.formatTime(post.timestamp)}</div>
          </div>
          <div class="post-menu">⋯</div>
        </div>
        
        <div class="post-content">
          <p>${post.content}</p>
          ${post.music ? `
            <div class="post-music">
              🎵 Now Playing: ${post.music.title}
              <button class="btn-small play-music" data-music="${post.music.id}">▶</button>
            </div>
          ` : ''}
          ${post.image ? `
            <div class="post-image">
              <div class="image-placeholder">📷 ${post.image}</div>
            </div>
          ` : ''}
        </div>
        
        <div class="post-actions">
          <button class="action-btn like-btn" data-index="${index}">
            ${post.liked ? '❤️' : '🤍'} ${post.likes}
          </button>
          <button class="action-btn comment-btn" data-index="${index}">
            💬 ${post.comments}
          </button>
          <button class="action-btn share-btn" data-index="${index}">
            🔄 ${post.shares}
          </button>
        </div>
        
        ${post.hashtags ? `
          <div class="post-hashtags">
            ${post.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
          </div>
        ` : ''}
      `;
      
      feed.appendChild(postElement);
    });
    
    // Add event listeners for post actions
    this.setupPostActions();
  }
  
  setupPostActions() {
    // Like buttons
    this.windowElement.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.toggleLike(index);
      });
    });
    
    // Comment buttons
    this.windowElement.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.showComments(index);
      });
    });
    
    // Share buttons
    this.windowElement.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.sharePost(index);
      });
    });
    
    // Play music buttons
    this.windowElement.querySelectorAll('.play-music').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const musicId = e.target.dataset.music;
        this.playMusic(musicId);
      });
    });
  }
  
  sharePost() {
    const content = this.windowElement.querySelector('#post-text').value.trim();
    
    if (!content) {
      alert('Please enter some content to share');
      return;
    }
    
    // Extract hashtags
    const hashtags = content.match(/#\w+/g) || [];
    
    const newPost = {
      id: 'post-' + Date.now(),
      username: 'You',
      avatar: '🎵',
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      hashtags: hashtags,
      music: null, // Would be set if music was added
      image: null  // Would be set if image was added
    };
    
    this.posts.unshift(newPost); // Add to beginning
    this.savePosts();
    
    // Clear form and switch to feed
    this.windowElement.querySelector('#post-text').value = '';
    this.switchTab('feed');
    this.windowElement.querySelector('[data-tab="feed"]').classList.add('active');
    this.windowElement.querySelector('[data-tab="share"]').classList.remove('active');
  }
  
  addMusicToPost() {
    const music = prompt('Add music to your post:\n\nEnter: Song Title|Artist|ID');
    if (music) {
      const parts = music.split('|');
      if (parts.length >= 2) {
        alert(`Music added: ${parts[0]} by ${parts[1]}`);
        // In a real app, this would attach music metadata to the post
      }
    }
  }
  
  addImageToPost() {
    const image = prompt('Add image description:');
    if (image) {
      alert(`Image added: ${image}`);
      // In a real app, this would handle image upload
    }
  }
  
  toggleLike(index) {
    const post = this.posts[index];
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    
    this.savePosts();
    this.refreshFeed();
  }
  
  showComments(index) {
    const post = this.posts[index];
    alert(`Comments for "${post.content.substring(0, 50)}..."\n\nThis would open a comments dialog.`);
  }
  
  sharePost(index) {
    const post = this.posts[index];
    post.shares++;
    
    this.savePosts();
    this.refreshFeed();
    
    alert('Post shared!');
  }
  
  playMusic(musicId) {
    alert(`Playing music: ${musicId}\n\nThis would start playing the attached music.`);
  }
  
  searchHashtag(hashtag) {
    alert(`Searching for posts with ${hashtag}\n\nThis would filter posts by hashtag.`);
  }
  
  formatTime(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return postTime.toLocaleDateString();
  }
  
  loadPosts() {
    const saved = localStorage.getItem('faitSocialPosts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    }
    return this.getDefaultPosts();
  }
  
  savePosts() {
    localStorage.setItem('faitSocialPosts', JSON.stringify(this.posts));
  }
  
  getDefaultPosts() {
    return [
      {
        id: 'post-1',
        username: 'SynthwaveKing',
        avatar: '🎵',
        content: 'Just discovered this amazing synthwave track! The retro vibes are incredible 🌆✨',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        likes: 12,
        comments: 3,
        shares: 2,
        liked: false,
        hashtags: ['#synthwave', '#retro', '#music'],
        music: {
          id: 'track-1',
          title: 'Neon Dreams',
          artist: 'Cyber Runner'
        }
      },
      {
        id: 'post-2',
        username: 'LoFiLover',
        avatar: '🎧',
        content: 'Perfect study session with some chill lo-fi beats. Productivity level: maximum! 📚',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        likes: 8,
        comments: 1,
        shares: 1,
        liked: true,
        hashtags: ['#lofi', '#study', '#chill'],
        image: 'Study setup with headphones'
      },
      {
        id: 'post-3',
        username: 'ElectroNinja',
        avatar: '⚡',
        content: 'The energy in this electronic set is off the charts! Who else is dancing? 💃🕺',
        timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        likes: 15,
        comments: 5,
        shares: 3,
        liked: false,
        hashtags: ['#electronic', '#dance', '#energy']
      }
    ];
  }
}

window.SocialWindow = SocialWindow;
