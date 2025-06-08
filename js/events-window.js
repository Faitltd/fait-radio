class EventsWindow {
  constructor(windowManager) {
    this.windowManager = windowManager;
    this.windowElement = null;
    this.events = this.loadEvents();
    this.currentView = 'upcoming';
  }
  
  create() {
    const windowOptions = {
      id: 'events',
      title: 'FAIT Events',
      width: 650,
      height: 500,
      x: 200,
      y: 120,
      content: this.generateContent()
    };
    
    this.windowElement = this.windowManager.createWindow(windowOptions);
    this.setupEventListeners();
    this.refreshEvents();
    
    return this.windowElement;
  }
  
  generateContent() {
    return `
      <div class="events-container">
        <div class="events-header">
          <h2>📅 FAIT Events</h2>
          <div class="events-nav">
            <button class="nav-btn active" data-view="upcoming">Upcoming</button>
            <button class="nav-btn" data-view="live">Live Now</button>
            <button class="nav-btn" data-view="past">Past Events</button>
          </div>
        </div>
        
        <div class="events-content">
          <div class="events-list" id="events-list">
            <!-- Events will be populated here -->
          </div>
        </div>
        
        <div class="events-actions">
          <button class="btn-primary" id="add-event-btn">+ Add Event</button>
          <button class="btn-secondary" id="calendar-view-btn">📅 Calendar</button>
        </div>
      </div>
    `;
  }
  
  setupEventListeners() {
    if (!this.windowElement) return;
    
    // Navigation buttons
    this.windowElement.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentView = e.target.dataset.view;
        this.refreshEvents();
        
        // Update active state
        this.windowElement.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
    
    // Action buttons
    this.windowElement.querySelector('#add-event-btn').addEventListener('click', () => {
      this.showAddEventDialog();
    });
    
    this.windowElement.querySelector('#calendar-view-btn').addEventListener('click', () => {
      this.showCalendarView();
    });
  }
  
  refreshEvents() {
    const list = this.windowElement.querySelector('#events-list');
    list.innerHTML = '';
    
    const filteredEvents = this.getFilteredEvents();
    
    if (filteredEvents.length === 0) {
      list.innerHTML = `<div class="no-events">No ${this.currentView} events found.</div>`;
      return;
    }
    
    filteredEvents.forEach((event, index) => {
      const eventCard = document.createElement('div');
      eventCard.className = `event-card ${event.status}`;
      eventCard.innerHTML = `
        <div class="event-date">
          <div class="month">${this.getMonthName(new Date(event.date))}</div>
          <div class="day">${new Date(event.date).getDate()}</div>
        </div>
        <div class="event-info">
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-meta">
            <span class="time">🕐 ${this.formatTime(event.date)}</span>
            <span class="type">${this.getEventTypeIcon(event.type)} ${event.type}</span>
            ${event.location ? `<span class="location">📍 ${event.location}</span>` : ''}
          </div>
        </div>
        <div class="event-actions">
          ${this.getEventActions(event, index)}
        </div>
      `;
      
      list.appendChild(eventCard);
    });
    
    // Add event listeners for actions
    this.setupEventActions();
  }
  
  getFilteredEvents() {
    const now = new Date();
    
    switch (this.currentView) {
      case 'upcoming':
        return this.events.filter(event => new Date(event.date) > now && event.status !== 'cancelled');
      case 'live':
        return this.events.filter(event => event.status === 'live');
      case 'past':
        return this.events.filter(event => new Date(event.date) < now || event.status === 'completed');
      default:
        return this.events;
    }
  }
  
  getEventActions(event, index) {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (event.status === 'live') {
      return `
        <button class="btn-join" data-index="${index}">🔴 Join Live</button>
        <button class="btn-edit" data-index="${index}">✏️</button>
      `;
    } else if (eventDate > now) {
      return `
        <button class="btn-remind" data-index="${index}">🔔 Remind Me</button>
        <button class="btn-edit" data-index="${index}">✏️</button>
        <button class="btn-delete" data-index="${index}">🗑️</button>
      `;
    } else {
      return `
        <button class="btn-replay" data-index="${index}">🔄 Replay</button>
        <button class="btn-delete" data-index="${index}">🗑️</button>
      `;
    }
  }
  
  setupEventActions() {
    // Join live events
    this.windowElement.querySelectorAll('.btn-join').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.joinLiveEvent(this.getFilteredEvents()[index]);
      });
    });
    
    // Set reminders
    this.windowElement.querySelectorAll('.btn-remind').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.setReminder(this.getFilteredEvents()[index]);
      });
    });
    
    // Edit events
    this.windowElement.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editEvent(this.getFilteredEvents()[index]);
      });
    });
    
    // Delete events
    this.windowElement.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.deleteEvent(this.getFilteredEvents()[index]);
      });
    });
    
    // Replay events
    this.windowElement.querySelectorAll('.btn-replay').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.replayEvent(this.getFilteredEvents()[index]);
      });
    });
  }
  
  showAddEventDialog() {
    const dialog = prompt(`Add New Event

Title: (e.g., "Synthwave Live Mix")
Description: (e.g., "Live DJ set featuring the best synthwave tracks")
Date: (YYYY-MM-DD format, e.g., "2024-01-15")
Time: (HH:MM format, e.g., "20:00")
Type: live|dj-set|premiere|community
Location: (optional, e.g., "FAIT Studio")

Enter as: Title|Description|Date|Time|Type|Location`);
    
    if (dialog) {
      const parts = dialog.split('|');
      if (parts.length >= 5) {
        const eventDate = new Date(`${parts[2].trim()}T${parts[3].trim()}`);
        
        const newEvent = {
          id: 'event-' + Date.now(),
          title: parts[0].trim(),
          description: parts[1].trim(),
          date: eventDate.toISOString(),
          type: parts[4].trim(),
          location: parts[5] ? parts[5].trim() : '',
          status: 'upcoming',
          attendees: 0,
          createdBy: 'Current User'
        };
        
        this.events.push(newEvent);
        this.saveEvents();
        this.refreshEvents();
      } else {
        alert('Invalid format. Please use: Title|Description|Date|Time|Type|Location');
      }
    }
  }
  
  joinLiveEvent(event) {
    alert(`Joining live event: ${event.title}\n\nThis would typically open a live stream or chat room.`);
    
    // Increment attendee count
    event.attendees++;
    this.saveEvents();
    this.refreshEvents();
  }
  
  setReminder(event) {
    const eventDate = new Date(event.date);
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    
    if (timeDiff > 0) {
      alert(`Reminder set for "${event.title}" on ${eventDate.toLocaleDateString()} at ${this.formatTime(event.date)}`);
      
      // In a real app, this would set up a notification
      // For demo purposes, we'll just show an alert
      setTimeout(() => {
        if (confirm(`Event reminder: "${event.title}" is starting soon! Join now?`)) {
          this.joinLiveEvent(event);
        }
      }, Math.min(timeDiff, 5000)); // Demo: remind in 5 seconds max
    } else {
      alert('This event has already started or passed.');
    }
  }
  
  editEvent(event) {
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toISOString().split('T')[0];
    const timeStr = eventDate.toTimeString().split(' ')[0].substring(0, 5);
    
    const dialog = prompt(`Edit Event

Current: ${event.title}|${event.description}|${dateStr}|${timeStr}|${event.type}|${event.location}

Enter new values as: Title|Description|Date|Time|Type|Location`);
    
    if (dialog) {
      const parts = dialog.split('|');
      if (parts.length >= 5) {
        const newEventDate = new Date(`${parts[2].trim()}T${parts[3].trim()}`);
        
        event.title = parts[0].trim();
        event.description = parts[1].trim();
        event.date = newEventDate.toISOString();
        event.type = parts[4].trim();
        event.location = parts[5] ? parts[5].trim() : '';
        
        this.saveEvents();
        this.refreshEvents();
      }
    }
  }
  
  deleteEvent(event) {
    if (confirm(`Delete event "${event.title}"?`)) {
      const index = this.events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        this.events.splice(index, 1);
        this.saveEvents();
        this.refreshEvents();
      }
    }
  }
  
  replayEvent(event) {
    alert(`Playing replay of "${event.title}"\n\nThis would typically start a recorded version of the event.`);
  }
  
  showCalendarView() {
    const windowOptions = {
      id: 'calendar-view',
      title: 'Events Calendar',
      width: 600,
      height: 400,
      x: 250,
      y: 200,
      content: this.generateCalendarContent()
    };
    
    this.windowManager.createWindow(windowOptions);
  }
  
  generateCalendarContent() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return `
      <div class="calendar-container">
        <div class="calendar-header">
          <h3>${this.getMonthName(now)} ${currentYear}</h3>
        </div>
        <div class="calendar-grid">
          <div class="calendar-placeholder">
            📅 Calendar view would show events for ${this.getMonthName(now)} ${currentYear}
            <br><br>
            Upcoming events this month:
            <ul>
              ${this.events
                .filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
                })
                .map(event => `<li>${event.title} - ${new Date(event.date).getDate()}th</li>`)
                .join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  
  getMonthName(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }
  
  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  getEventTypeIcon(type) {
    const icons = {
      live: '🔴',
      'dj-set': '🎧',
      premiere: '🎬',
      community: '👥',
      concert: '🎵'
    };
    return icons[type] || '📅';
  }
  
  loadEvents() {
    const saved = localStorage.getItem('faitEvents');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }
    return this.getDefaultEvents();
  }
  
  saveEvents() {
    localStorage.setItem('faitEvents', JSON.stringify(this.events));
  }
  
  getDefaultEvents() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'event-1',
        title: 'Synthwave Saturday',
        description: 'Weekly synthwave mix featuring the best retro tracks',
        date: tomorrow.toISOString(),
        type: 'dj-set',
        location: 'FAIT Studio',
        status: 'upcoming',
        attendees: 0,
        createdBy: 'FAIT Team'
      },
      {
        id: 'event-2',
        title: 'Lo-Fi Study Session',
        description: 'Perfect background music for studying and working',
        date: nextWeek.toISOString(),
        type: 'live',
        location: 'Online',
        status: 'upcoming',
        attendees: 0,
        createdBy: 'FAIT Team'
      }
    ];
  }
}

window.EventsWindow = EventsWindow;
