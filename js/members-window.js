class MembersWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.members = this.loadMembers();
    this.currentUser = this.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
  }
  
  create() {
    const windowOptions = {
      id: 'members',
      title: 'FAIT Members',
      width: 550,
      height: 450,
      x: 300,
      y: 150,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshMembersList();
    
    return this.windowElement;
  }
  
  generateContent() {
    if (!this.isLoggedIn) {
      return this.generateLoginContent();
    }
    
    return `
      <div class="members-container">
        <div class="members-header">
          <h2>👥 FAIT Members</h2>
          <div class="user-info">
            <span class="welcome">Welcome, ${this.currentUser.username}!</span>
            <button class="btn-secondary" id="logout-btn">Logout</button>
          </div>
        </div>
        
        <div class="member-stats">
          <div class="stat-card">
            <div class="stat-number">${this.members.length}</div>
            <div class="stat-label">Total Members</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${this.getOnlineCount()}</div>
            <div class="stat-label">Online Now</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${this.currentUser.level}</div>
            <div class="stat-label">Your Level</div>
          </div>
        </div>
        
        <div class="members-content">
          <div class="members-tabs">
            <button class="tab-btn active" data-tab="online">Online</button>
            <button class="tab-btn" data-tab="all">All Members</button>
            <button class="tab-btn" data-tab="leaderboard">Leaderboard</button>
          </div>
          
          <div class="members-list" id="members-list">
            <!-- Members will be populated here -->
          </div>
        </div>
        
        <div class="member-actions">
          <button class="btn-primary" id="invite-friend-btn">Invite Friend</button>
          <button class="btn-secondary" id="member-settings-btn">Settings</button>
        </div>
      </div>
    `;
  }
  
  generateLoginContent() {
    return `
      <div class="login-container">
        <div class="login-header">
          <h2>👥 Join FAIT Members</h2>
          <p>Connect with other music lovers and unlock exclusive features</p>
        </div>
        
        <div class="login-form">
          <div class="form-group">
            <label>Username:</label>
            <input type="text" id="username-input" placeholder="Enter your username">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" id="email-input" placeholder="Enter your email">
          </div>
          <div class="form-group">
            <label>Favorite Genre:</label>
            <select id="genre-select">
              <option value="synthwave">Synthwave</option>
              <option value="lofi">Lo-Fi</option>
              <option value="electronic">Electronic</option>
              <option value="ambient">Ambient</option>
              <option value="chillhop">Chillhop</option>
            </select>
          </div>
          
          <div class="login-actions">
            <button class="btn-primary" id="join-btn">Join FAIT</button>
            <button class="btn-secondary" id="guest-btn">Continue as Guest</button>
          </div>
        </div>
        
        <div class="member-benefits">
          <h3>Member Benefits:</h3>
          <ul>
            <li>🎵 Create custom mixtapes</li>
            <li>💬 Chat with other members</li>
            <li>⭐ Rate and review music</li>
            <li>🏆 Earn points and levels</li>
            <li>📻 Request songs</li>
            <li>🎁 Exclusive content access</li>
          </ul>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    if (!this.isLoggedIn) {
      this.setupLoginListeners();
    } else {
      this.setupMembersListeners();
    }
  }
  
  setupLoginListeners() {
    this.windowElement.querySelector('#join-btn').addEventListener('click', () => {
      this.joinAsMember();
    });
    
    this.windowElement.querySelector('#guest-btn').addEventListener('click', () => {
      this.continueAsGuest();
    });
  }
  
  setupMembersListeners() {
    // Tab buttons
    this.windowElement.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
        
        // Update active state
        this.windowElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Action buttons
    this.windowElement.querySelector('#logout-btn').addEventListener('click', () => {
      this.logout();
    });
    
    this.windowElement.querySelector('#invite-friend-btn').addEventListener('click', () => {
      this.inviteFriend();
    });
    
    this.windowElement.querySelector('#member-settings-btn').addEventListener('click', () => {
      this.openMemberSettings();
    });
  }
  
  joinAsMember() {
    const username = this.windowElement.querySelector('#username-input').value.trim();
    const email = this.windowElement.querySelector('#email-input').value.trim();
    const genre = this.windowElement.querySelector('#genre-select').value;
    
    if (!username || !email) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if username is taken
    if (this.members.find(m => m.username === username)) {
      alert('Username already taken');
      return;
    }
    
    const newMember = {
      id: 'member-' + Date.now(),
      username: username,
      email: email,
      favoriteGenre: genre,
      joinDate: new Date().toISOString(),
      level: 1,
      points: 0,
      isOnline: true,
      avatar: this.getRandomAvatar(),
      status: 'Listening to FAIT Radio'
    };
    
    this.members.push(newMember);
    this.currentUser = newMember;
    this.isLoggedIn = true;
    
    this.saveMembers();
    this.saveCurrentUser();
    
    // Refresh the window content
    this.windowElement.querySelector('.window-content').innerHTML = this.generateContent();
    this.setupEventListeners();
    this.refreshMembersList();
  }
  
  continueAsGuest() {
    // Close the members window
    this.windowManager.closeWindow(this.windowElement);
  }
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // Set user as offline
      if (this.currentUser) {
        const member = this.members.find(m => m.id === this.currentUser.id);
        if (member) {
          member.isOnline = false;
        }
      }
      
      this.currentUser = null;
      this.isLoggedIn = false;
      
      localStorage.removeItem('faitCurrentUser');
      this.saveMembers();
      
      // Refresh the window content
      this.windowElement.querySelector('.window-content').innerHTML = this.generateContent();
      this.setupEventListeners();
    }
  }
  
  switchTab(tab) {
    this.refreshMembersList(tab);
  }
  
  refreshMembersList(tab = 'online') {
    const list = this.windowElement.querySelector('#members-list');
    if (!list) return;
    
    let membersToShow = [];
    
    switch (tab) {
      case 'online':
        membersToShow = this.members.filter(m => m.isOnline);
        break;
      case 'all':
        membersToShow = this.members;
        break;
      case 'leaderboard':
        membersToShow = [...this.members].sort((a, b) => b.points - a.points);
        break;
    }
    
    list.innerHTML = '';
    
    if (membersToShow.length === 0) {
      list.innerHTML = '<div class="no-members">No members found</div>';
      return;
    }
    
    membersToShow.forEach((member, index) => {
      const memberCard = document.createElement('div');
      memberCard.className = 'member-card';
      memberCard.innerHTML = `
        <div class="member-avatar">${member.avatar}</div>
        <div class="member-info">
          <div class="member-name">
            ${member.username}
            ${member.isOnline ? '<span class="online-indicator">●</span>' : ''}
            ${tab === 'leaderboard' ? `<span class="rank">#${index + 1}</span>` : ''}
          </div>
          <div class="member-status">${member.status || 'Listening to music'}</div>
          <div class="member-meta">
            Level ${member.level} • ${member.points} points • ${member.favoriteGenre}
          </div>
        </div>
        <div class="member-actions">
          <button class="btn-small" onclick="this.sendMessage('${member.id}')">💬</button>
          <button class="btn-small" onclick="this.viewProfile('${member.id}')">👤</button>
        </div>
      `;
      
      list.appendChild(memberCard);
    });
  }
  
  inviteFriend() {
    const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${this.currentUser.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join FAIT Radio',
        text: 'Check out this awesome radio station!',
        url: inviteLink
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert('Invite link copied to clipboard!');
      }).catch(() => {
        prompt('Copy this invite link:', inviteLink);
      });
    }
  }
  
  openMemberSettings() {
    const windowOptions = {
      id: 'member-settings',
      title: 'Member Settings',
      width: 400,
      height: 300,
      x: 350,
      y: 200,
      content: `
        <div class="settings-container">
          <h3>Member Settings</h3>
          <div class="form-group">
            <label>Status:</label>
            <input type="text" id="status-input" value="${this.currentUser.status}" placeholder="What are you listening to?">
          </div>
          <div class="form-group">
            <label>Favorite Genre:</label>
            <select id="genre-update">
              <option value="synthwave" ${this.currentUser.favoriteGenre === 'synthwave' ? 'selected' : ''}>Synthwave</option>
              <option value="lofi" ${this.currentUser.favoriteGenre === 'lofi' ? 'selected' : ''}>Lo-Fi</option>
              <option value="electronic" ${this.currentUser.favoriteGenre === 'electronic' ? 'selected' : ''}>Electronic</option>
              <option value="ambient" ${this.currentUser.favoriteGenre === 'ambient' ? 'selected' : ''}>Ambient</option>
              <option value="chillhop" ${this.currentUser.favoriteGenre === 'chillhop' ? 'selected' : ''}>Chillhop</option>
            </select>
          </div>
          <div class="settings-actions">
            <button class="btn-primary" id="save-settings-btn">Save</button>
            <button class="btn-secondary" id="cancel-settings-btn">Cancel</button>
          </div>
        </div>
      `
    };
    
    const settingsWindow = this.windowManager.createWindow(windowOptions);
    
    // Add event listeners for settings
    settingsWindow.querySelector('#save-settings-btn').addEventListener('click', () => {
      const newStatus = settingsWindow.querySelector('#status-input').value;
      const newGenre = settingsWindow.querySelector('#genre-update').value;
      
      this.currentUser.status = newStatus;
      this.currentUser.favoriteGenre = newGenre;
      
      // Update in members list
      const member = this.members.find(m => m.id === this.currentUser.id);
      if (member) {
        member.status = newStatus;
        member.favoriteGenre = newGenre;
      }
      
      this.saveMembers();
      this.saveCurrentUser();
      this.refreshMembersList();
      
      this.windowManager.closeWindow(settingsWindow);
    });
    
    settingsWindow.querySelector('#cancel-settings-btn').addEventListener('click', () => {
      this.windowManager.closeWindow(settingsWindow);
    });
  }
  
  getOnlineCount() {
    return this.members.filter(m => m.isOnline).length;
  }
  
  getRandomAvatar() {
    const avatars = ['🎵', '🎧', '🎤', '🎸', '🎹', '🎺', '🎻', '🥁', '🎷', '🎪'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
  
  loadMembers() {
    const saved = localStorage.getItem('faitMembers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading members:', error);
      }
    }
    return this.getDefaultMembers();
  }
  
  saveMembers() {
    localStorage.setItem('faitMembers', JSON.stringify(this.members));
  }
  
  getCurrentUser() {
    const saved = localStorage.getItem('faitCurrentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    }
    return null;
  }
  
  saveCurrentUser() {
    localStorage.setItem('faitCurrentUser', JSON.stringify(this.currentUser));
  }
  
  getDefaultMembers() {
    return [
      {
        id: 'member-1',
        username: 'SynthwaveKing',
        email: 'king@synthwave.com',
        favoriteGenre: 'synthwave',
        joinDate: new Date(Date.now() - 86400000 * 30).toISOString(),
        level: 15,
        points: 1250,
        isOnline: true,
        avatar: '🎵',
        status: 'Vibing to retro beats'
      },
      {
        id: 'member-2',
        username: 'LoFiLover',
        email: 'lover@lofi.com',
        favoriteGenre: 'lofi',
        joinDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        level: 8,
        points: 680,
        isOnline: false,
        avatar: '🎧',
        status: 'Studying with chill beats'
      },
      {
        id: 'member-3',
        username: 'ElectroNinja',
        email: 'ninja@electro.com',
        favoriteGenre: 'electronic',
        joinDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        level: 5,
        points: 320,
        isOnline: true,
        avatar: '⚡',
        status: 'Dancing to electronic vibes'
      }
    ];
  }
}

window.MembersWindow = MembersWindow;
