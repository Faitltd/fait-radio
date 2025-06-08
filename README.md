# 🌈 FAIT Synthwave Radio Station

A retro-futuristic web-based radio station with 80's synthwave aesthetics, featuring fuscia and electric purple neon styling on a black background.

## ✨ Features

### 🎵 Radio Player
- **YouTube Integration**: Stream live radio from YouTube with hidden iframe technique
- **Multiple Stations**: Pre-configured stations with different genres
- **Background Videos**: Animated backgrounds that sync with stations
- **Volume Control**: Smooth volume slider with neon styling
- **Play/Pause**: Responsive controls with synthwave design

### 🎛️ Admin Panel
- **Station Management**: Add, edit, and delete radio stations
- **Real-time Updates**: Changes reflect immediately in the radio player
- **Data Persistence**: Stations saved to localStorage
- **Import/Export**: Backup and restore station configurations
- **Live Testing**: Test stations before saving

### 🖥️ Window System
- **Draggable Windows**: Smooth window management
- **Multiple Windows**: Open multiple apps simultaneously
- **Minimize/Maximize**: Full window controls
- **Neon Styling**: Synthwave-themed window decorations

### 🎨 Synthwave Aesthetic
- **Neon Colors**: Fuscia (#FF1493) and Electric Purple (#8A2BE2)
- **Glowing Effects**: CSS box-shadows and text-shadows
- **Animated Grid**: Moving background grid pattern
- **Retro Fonts**: Orbitron and Rajdhani font families
- **Smooth Animations**: Hover effects and transitions

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in your web browser
2. Click the Radio icon (📻) to open the player
3. Select a station from the dropdown
4. Enjoy the music!

### Admin Panel Access
1. Click the Admin icon (🎛️) in the dock
2. Add new stations or edit existing ones
3. Click "Save All Changes" to persist your modifications

## 🎵 Adding New Stations

### Using the Admin Panel
1. Open the Admin Panel
2. Click "Add New Station"
3. Fill in the station details:
   - **Name**: Display name for the station
   - **Description**: Brief description
   - **YouTube ID**: Extract from YouTube URL (e.g., `dQw4w9WgXcQ`)
   - **Background Video**: URL to background video (optional)
   - **Color**: Station theme color
   - **Artwork**: Station logo URL (optional)

### YouTube ID Extraction
From a YouTube URL like `https://youtube.com/watch?v=dQw4w9WgXcQ`, extract the ID: `dQw4w9WgXcQ`

### Recommended Background Videos
- Use Giphy MP4 URLs for best performance
- Keep videos under 10MB for smooth playback
- Ensure videos loop seamlessly

## 🎨 Customization

### Color Scheme
The synthwave theme uses CSS custom properties:
```css
:root {
  --neon-pink: #FF1493;
  --electric-purple: #8A2BE2;
  --neon-cyan: #00FFFF;
  --neon-green: #39FF14;
  --dark-bg: #0a0a0a;
  --darker-bg: #000000;
}
```

### Adding New Dock Items
Edit `js/app.js` in the `createDockItems` function:
```javascript
{ id: 'myapp', name: 'My App', icon: '🎮' }
```

## 📁 File Structure

```
FAIT-Radio/
├── index.html              # Main application
├── css/
│   └── styles.css          # Synthwave styling
├── js/
│   ├── app.js              # Main application logic
│   ├── admin-panel.js      # Admin panel functionality
│   ├── radio-window.js     # Radio player component
│   ├── youtube-player.js   # YouTube integration
│   ├── background-manager.js # Background video system
│   ├── window-manager.js   # Window management
│   └── stations.js         # Station data
├── img/                    # Images and icons
└── README.md              # This file
```

## 🔧 Technical Details

### Architecture
- **Modular Design**: Each component is a separate class
- **Event-Driven**: Components communicate via custom events
- **Data Persistence**: localStorage for station management
- **Responsive**: Works on desktop and mobile devices

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### Performance
- Optimized CSS animations
- Efficient YouTube API usage
- Minimal DOM manipulation
- Smooth 60fps animations

## 🎵 Default Stations

1. **FAIT FM** - Original FAIT vibes
2. **Synthwave Radio** - Retro synthwave and outrun
3. **Lo-Fi Beats** - Chill beats to relax/study
4. **Smooth Jazz** - Relaxing jazz
5. **Chillhop Cafe** - Instrumental hip-hop
6. **Ambient Space** - Deep ambient soundscapes

## 🛠️ Development

### Adding New Features
1. Create new component in `js/` directory
2. Add to script loading order in `index.html`
3. Integrate with main app in `js/app.js`
4. Style with synthwave theme in `css/styles.css`

### Debugging
- Open browser developer tools
- Check console for error messages
- Use the test page: `test.html`

## 🎨 Design Philosophy

The synthwave aesthetic combines:
- **Retro-futurism**: 80's vision of the future
- **Neon Colors**: Bright, glowing accents
- **Dark Backgrounds**: High contrast for readability
- **Grid Patterns**: Classic synthwave visual element
- **Smooth Animations**: Fluid, responsive interactions

## 📝 License

This project is open source. Feel free to modify and distribute.

## 🙏 Credits

- **Fonts**: Google Fonts (Orbitron, Rajdhani)
- **Inspiration**: Synthwave aesthetic, retro-futurism
- **YouTube API**: For audio streaming
- **CSS Grid**: For responsive layouts

---

**Enjoy your synthwave radio experience! 🌈🎵**
