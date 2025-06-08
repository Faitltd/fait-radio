// Mixtapes data structure for YouTube playlists
const defaultMixtapes = [
  {
    id: 'synthwave-essentials',
    name: 'Synthwave Essentials',
    description: 'The best of synthwave and retrowave',
    youtubePlaylistId: 'PLrAl6rYAS4Z7hWOgOgKjKW8VaOtMnKGWz',
    artwork: 'img/mixtapes/synthwave-essentials.jpg',
    color: '#FF1493',
    tags: ['synthwave', 'retro', 'electronic'],
    duration: '2h 45m',
    trackCount: 42
  },
  {
    id: 'lofi-study-vibes',
    name: 'Lo-Fi Study Vibes',
    description: 'Perfect beats for studying and focus',
    youtubePlaylistId: 'PLOHoVaTp8R7eQDSiZifrpjsQy0WuCCYDr',
    artwork: 'img/mixtapes/lofi-study.jpg',
    color: '#8A2BE2',
    tags: ['lofi', 'study', 'chill'],
    duration: '3h 12m',
    trackCount: 58
  },
  {
    id: 'album-example',
    name: 'Album Example',
    description: 'Example of a full album playlist',
    youtubePlaylistId: 'OLAK5uy_mZ_n0miNZPEDzY9Xf212_-ZVgH5S5yroo',
    artwork: 'img/mixtapes/album-example.jpg',
    color: '#00FFFF',
    tags: ['album', 'complete'],
    duration: '45m',
    trackCount: 12
  },
  {
    id: 'chill-electronic',
    name: 'Chill Electronic',
    description: 'Downtempo electronic music for relaxation',
    youtubePlaylistId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
    artwork: 'img/mixtapes/chill-electronic.jpg',
    color: '#39FF14',
    tags: ['electronic', 'chill', 'ambient'],
    duration: '1h 58m',
    trackCount: 35
  }
];

class MixtapeManager {
  constructor() {
    this.mixtapes = this.loadMixtapes();
    this.currentMixtape = null;
  }
  
  loadMixtapes() {
    const saved = localStorage.getItem('faitMixtapes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading saved mixtapes:', error);
      }
    }
    return [...defaultMixtapes];
  }
  
  saveMixtapes() {
    localStorage.setItem('faitMixtapes', JSON.stringify(this.mixtapes));
  }
  
  getAllMixtapes() {
    return this.mixtapes;
  }
  
  getMixtapeById(id) {
    return this.mixtapes.find(m => m.id === id);
  }
  
  addMixtape(mixtape) {
    // Generate ID if not provided
    if (!mixtape.id) {
      mixtape.id = 'mixtape-' + Date.now();
    }
    
    // Set defaults
    mixtape.tags = mixtape.tags || [];
    mixtape.duration = mixtape.duration || 'Unknown';
    mixtape.trackCount = mixtape.trackCount || 0;
    mixtape.color = mixtape.color || '#FF1493';
    
    this.mixtapes.push(mixtape);
    this.saveMixtapes();
    return mixtape;
  }
  
  updateMixtape(id, updates) {
    const index = this.mixtapes.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mixtapes[index] = { ...this.mixtapes[index], ...updates };
      this.saveMixtapes();
      return this.mixtapes[index];
    }
    return null;
  }
  
  deleteMixtape(id) {
    const index = this.mixtapes.findIndex(m => m.id === id);
    if (index !== -1) {
      const deleted = this.mixtapes.splice(index, 1)[0];
      this.saveMixtapes();
      return deleted;
    }
    return null;
  }
  
  searchMixtapes(query) {
    const lowerQuery = query.toLowerCase();
    return this.mixtapes.filter(mixtape => 
      mixtape.name.toLowerCase().includes(lowerQuery) ||
      mixtape.description.toLowerCase().includes(lowerQuery) ||
      mixtape.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  getMixtapesByTag(tag) {
    return this.mixtapes.filter(mixtape => 
      mixtape.tags.includes(tag.toLowerCase())
    );
  }
  
  getAllTags() {
    const allTags = new Set();
    this.mixtapes.forEach(mixtape => {
      mixtape.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }
  
  validatePlaylistId(playlistId) {
    if (!playlistId || typeof playlistId !== 'string') {
      return { isValid: false, error: 'Empty or invalid playlist ID' };
    }
    
    const trimmed = playlistId.trim();
    
    // Check if it's a full YouTube URL
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      try {
        const urlObj = new URL(trimmed);
        const params = new URLSearchParams(urlObj.search);
        const listParam = params.get('list');
        
        if (listParam) {
          return {
            isValid: true,
            playlistId: listParam,
            extractedFrom: 'URL'
          };
        } else {
          return { isValid: false, error: 'No playlist ID found in URL' };
        }
      } catch (error) {
        return { isValid: false, error: 'Invalid URL format' };
      }
    }
    
    // Check if it's a direct playlist ID
    if (trimmed.match(/^(PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/)) {
      return {
        isValid: true,
        playlistId: trimmed,
        extractedFrom: 'direct'
      };
    }
    
    return { 
      isValid: false, 
      error: 'Must be a YouTube playlist ID or URL containing a playlist' 
    };
  }
  
  resetToDefaults() {
    this.mixtapes = [...defaultMixtapes];
    this.saveMixtapes();
    return this.mixtapes;
  }
  
  exportMixtapes() {
    return JSON.stringify(this.mixtapes, null, 2);
  }
  
  importMixtapes(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        this.mixtapes = imported;
        this.saveMixtapes();
        return { success: true, count: imported.length };
      } else {
        return { success: false, error: 'Invalid format: expected array' };
      }
    } catch (error) {
      return { success: false, error: 'Invalid JSON: ' + error.message };
    }
  }
}

// Export for use in other modules
window.MixtapeManager = MixtapeManager;
window.defaultMixtapes = defaultMixtapes;
