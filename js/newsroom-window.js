class NewsroomWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.articles = this.loadArticles();
    this.currentFilter = 'all';
  }
  
  create() {
    const windowOptions = {
      id: 'newsroom',
      title: 'FAIT Newsroom',
      width: 700,
      height: 500,
      x: 150,
      y: 100,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshArticles();
    this.loadLatestNews();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="newsroom-container">
        <div class="newsroom-header">
          <h2>📰 FAIT Newsroom</h2>
          <div class="news-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="music">Music</button>
            <button class="filter-btn" data-filter="tech">Tech</button>
            <button class="filter-btn" data-filter="culture">Culture</button>
            <button class="filter-btn" data-filter="events">Events</button>
          </div>
        </div>
        
        <div class="news-content">
          <div class="featured-article" id="featured-article">
            <div class="article-image">
              <div class="placeholder-image">🎵</div>
            </div>
            <div class="article-content">
              <span class="article-category">Featured</span>
              <h3>Welcome to FAIT Radio</h3>
              <p>Your premier destination for synthwave, lo-fi, and electronic music. Stay tuned for the latest updates, new mixtapes, and exclusive content.</p>
              <div class="article-meta">
                <span class="author">FAIT Team</span>
                <span class="date">${new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div class="articles-grid" id="articles-grid">
            <!-- Articles will be populated here -->
          </div>
        </div>
        
        <div class="newsroom-actions">
          <button class="btn-primary" id="add-article-btn">+ Add Article</button>
          <button class="btn-secondary" id="refresh-news-btn">🔄 Refresh</button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Filter buttons
    this.windowElement.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
        
        // Update active state
        this.windowElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Add article button
    this.windowElement.querySelector('#add-article-btn').addEventListener('click', () => {
      this.showAddArticleDialog();
    });
    
    // Refresh button
    this.windowElement.querySelector('#refresh-news-btn').addEventListener('click', () => {
      this.loadLatestNews();
    });
  }
  
  refreshArticles() {
    const grid = this.windowElement.querySelector('#articles-grid');
    grid.innerHTML = '';
    
    const filteredArticles = this.currentFilter === 'all' 
      ? this.articles 
      : this.articles.filter(article => article.category === this.currentFilter);
    
    if (filteredArticles.length === 0) {
      grid.innerHTML = '<div class="no-articles">No articles found for this category.</div>';
      return;
    }
    
    filteredArticles.forEach((article, index) => {
      const articleCard = document.createElement('div');
      articleCard.className = 'article-card';
      articleCard.innerHTML = `
        <div class="article-thumbnail">
          <div class="category-icon">${this.getCategoryIcon(article.category)}</div>
        </div>
        <div class="article-info">
          <span class="article-category">${article.category}</span>
          <h4>${article.title}</h4>
          <p>${article.excerpt}</p>
          <div class="article-meta">
            <span class="author">${article.author}</span>
            <span class="date">${new Date(article.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="article-actions">
          <button class="btn-read" data-index="${index}">Read</button>
          <button class="btn-edit" data-index="${index}">Edit</button>
          <button class="btn-delete" data-index="${index}">Delete</button>
        </div>
      `;
      
      grid.appendChild(articleCard);
    });
    
    // Add event listeners
    grid.querySelectorAll('.btn-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.readArticle(filteredArticles[index]);
      });
    });
    
    grid.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editArticle(filteredArticles[index]);
      });
    });
    
    grid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteArticle(filteredArticles[index]);
      });
    });
  }
  
  setFilter(filter) {
    this.currentFilter = filter;
    this.refreshArticles();
  }
  
  getCategoryIcon(category) {
    const icons = {
      music: '🎵',
      tech: '💻',
      culture: '🎨',
      events: '📅',
      news: '📰'
    };
    return icons[category] || '📄';
  }
  
  showAddArticleDialog() {
    const dialog = prompt(`Add New Article

Title: (e.g., "New Synthwave Album Released")
Category: music|tech|culture|events
Excerpt: (Brief description)
Content: (Full article content)

Enter as: Title|Category|Excerpt|Content`);
    
    if (dialog) {
      const parts = dialog.split('|');
      if (parts.length >= 4) {
        const newArticle = {
          id: 'article-' + Date.now(),
          title: parts[0].trim(),
          category: parts[1].trim(),
          excerpt: parts[2].trim(),
          content: parts[3].trim(),
          author: 'FAIT Team',
          date: new Date().toISOString(),
          views: 0
        };
        
        this.articles.unshift(newArticle); // Add to beginning
        this.saveArticles();
        this.refreshArticles();
      } else {
        alert('Invalid format. Please use: Title|Category|Excerpt|Content');
      }
    }
  }
  
  readArticle(article) {
    // Create a new window for reading the article
    const windowOptions = {
      id: 'article-' + article.id,
      title: article.title,
      width: 600,
      height: 400,
      x: 250,
      y: 200,
      content: `
        <div class="article-reader">
          <div class="article-header">
            <span class="article-category">${article.category}</span>
            <h2>${article.title}</h2>
            <div class="article-meta">
              <span class="author">By ${article.author}</span>
              <span class="date">${new Date(article.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="article-body">
            <p>${article.content}</p>
          </div>
        </div>
      `
    };
    
    this.windowManager.createWindow(windowOptions);
    
    // Increment view count
    article.views++;
    this.saveArticles();
  }
  
  editArticle(article) {
    const dialog = prompt(`Edit Article

Current: ${article.title}|${article.category}|${article.excerpt}|${article.content}

Enter new values as: Title|Category|Excerpt|Content`);
    
    if (dialog) {
      const parts = dialog.split('|');
      if (parts.length >= 4) {
        article.title = parts[0].trim();
        article.category = parts[1].trim();
        article.excerpt = parts[2].trim();
        article.content = parts[3].trim();
        
        this.saveArticles();
        this.refreshArticles();
      }
    }
  }
  
  deleteArticle(article) {
    if (confirm(`Delete "${article.title}"?`)) {
      const index = this.articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        this.articles.splice(index, 1);
        this.saveArticles();
        this.refreshArticles();
      }
    }
  }
  
  loadLatestNews() {
    // Simulate loading news from external sources
    const loadingMsg = this.windowElement.querySelector('#articles-grid');
    const originalContent = loadingMsg.innerHTML;
    loadingMsg.innerHTML = '<div class="loading">Loading latest news...</div>';
    
    setTimeout(() => {
      // Add some sample news if none exist
      if (this.articles.length === 0) {
        this.articles = this.getDefaultArticles();
        this.saveArticles();
      }
      this.refreshArticles();
    }, 1000);
  }
  
  loadArticles() {
    const saved = localStorage.getItem('faitArticles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    }
    return this.getDefaultArticles();
  }
  
  saveArticles() {
    localStorage.setItem('faitArticles', JSON.stringify(this.articles));
  }
  
  getDefaultArticles() {
    return [
      {
        id: 'welcome',
        title: 'Welcome to FAIT Radio',
        category: 'news',
        excerpt: 'Your new home for synthwave and electronic music.',
        content: 'FAIT Radio is launching with an incredible collection of synthwave, lo-fi, and electronic music. Join our community and discover new sounds every day.',
        author: 'FAIT Team',
        date: new Date().toISOString(),
        views: 0
      },
      {
        id: 'synthwave-guide',
        title: 'The Ultimate Synthwave Guide',
        category: 'music',
        excerpt: 'Everything you need to know about synthwave music.',
        content: 'Synthwave is a genre of electronic music that draws inspiration from 1980s film soundtracks and video games. Characterized by its nostalgic and futuristic sound...',
        author: 'Music Editor',
        date: new Date(Date.now() - 86400000).toISOString(),
        views: 0
      },
      {
        id: 'tech-update',
        title: 'New Player Features',
        category: 'tech',
        excerpt: 'Latest updates to the FAIT Radio player.',
        content: 'We have added playlist support, better audio quality, and improved user interface. Check out the new features in the radio player.',
        author: 'Tech Team',
        date: new Date(Date.now() - 172800000).toISOString(),
        views: 0
      }
    ];
  }
}

window.NewsroomWindow = NewsroomWindow;
