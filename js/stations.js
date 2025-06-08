// This file contains the data for our radio stations
// Using YouTube videos that allow embedding and are suitable for radio streaming
const stations = [
  {
    id: 'fait',
    name: 'FAIT FM',
    description: 'The original FAIT vibes - Synthwave Mix',
    youtubeId: 'jfKfPfyJRdk', // Lofi Hip Hop Radio - beats to relax/study to (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
    color: '#FF6B6B',
    artwork: 'img/stations/fait.jpg'
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    description: 'Chill beats to relax and study',
    youtubeId: '5qap5aO4i9A', // Lofi Hip Hop Radio - beats to relax/study to (Lofi Girl - known embed-friendly)
    backgroundVideo: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/mp4',
    color: '#4ECDC4',
    artwork: 'img/stations/lofi.jpg'
  },
  {
    id: 'synthwave',
    name: 'Synthwave Radio',
    description: 'Retro synthwave and outrun vibes',
    youtubeId: '4xDzrJKXOOY', // Synthwave Radio - 24/7 Retrowave/Outrun (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/mp4',
    color: '#FF6B9D',
    artwork: 'img/stations/synthwave.jpg'
  },
  {
    id: 'jazz',
    name: 'Smooth Jazz',
    description: 'Relaxing jazz for any time of day',
    youtubeId: 'Dx5qFachd3A', // Smooth Jazz Radio - 24/7 (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/mp4',
    color: '#95E1D3',
    artwork: 'img/stations/jazz.jpg'
  },
  {
    id: 'chillhop',
    name: 'Chillhop Cafe',
    description: 'Instrumental hip-hop and chill beats',
    youtubeId: '7NOSDKb0HlU', // ChilledCow - Chillhop Radio (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlQoVLBOqMjKzQs/mp4',
    color: '#F38BA8',
    artwork: 'img/stations/chillhop.jpg'
  },
  {
    id: 'ambient',
    name: 'Ambient Space',
    description: 'Deep ambient soundscapes',
    youtubeId: 'UfcAVejslrU', // Space Ambient Music - Deep Space (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/mp4',
    color: '#A8E6CF',
    artwork: 'img/stations/ambient.jpg'
  },
  {
    id: 'test',
    name: 'Test Station',
    description: 'Simple test video for debugging',
    youtubeId: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (known working video)
    backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
    color: '#FFD700',
    artwork: 'img/stations/test.jpg'
  },
  {
    id: 'chill',
    name: 'Chill Vibes',
    description: 'Relaxing chill music for any mood',
    youtubeId: 'lTRiuFIWV54', // Chill Music Mix (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
    color: '#87CEEB',
    artwork: 'img/stations/chill.jpg'
  },
  {
    id: 'study',
    name: 'Study Focus',
    description: 'Background music for concentration',
    youtubeId: 'AQBh9soLSkI', // Study Music - Focus/Concentration (known to allow embedding)
    backgroundVideo: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/mp4',
    color: '#98FB98',
    artwork: 'img/stations/study.jpg'
  }
];

// Background videos for different moods
const backgroundVideos = [
  {
    id: 'pool',
    name: 'Pool Vibes',
    url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/mp4',
    mood: 'relaxed'
  },
  {
    id: 'city',
    name: 'City Night',
    url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/mp4',
    mood: 'urban'
  },
  {
    id: 'neon',
    name: 'Neon Dreams',
    url: 'https://media.giphy.com/media/l0HlPystfePnAI3G8/mp4',
    mood: 'retro'
  },
  {
    id: 'nature',
    name: 'Nature Calm',
    url: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/mp4',
    mood: 'peaceful'
  }
];

// Export the data
window.stationData = stations;
window.backgroundVideoData = backgroundVideos;