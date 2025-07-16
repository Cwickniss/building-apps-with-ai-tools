// Event management utilities
export class EventManager {
    constructor() {
        this.events = [];
        this.categories = ['work', 'meeting', 'appointment', 'personal', 'class', 'other'];
        this.reminderOptions = [
            { value: '0', label: 'No reminder' },
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
            { value: '1440', label: '1 day' },
            { value: '10080', label: '1 week' }
        ];
    }

    // Set events from API response
    setEvents(events) {
        this.events = events.map(event => ({
            ...event,
            reminder: event.reminder || '60' // Default to 1 hour reminder
        }));
    }

    // Get all events
    getEvents() {
        return this.events;
    }

    // Update a specific event field
    updateEvent(index, field, value) {
        if (index >= 0 && index < this.events.length) {
            this.events[index][field] = value;
        }
    }

    // Delete an event
    deleteEvent(index) {
        if (index >= 0 && index < this.events.length) {
            this.events.splice(index, 1);
            return true;
        }
        return false;
    }

    // Add a new event
    addEvent(event) {
        const newEvent = {
            title: event.title || 'New Event',
            date: event.date || this.getTodayDate(),
            startTime: event.startTime || '09:00',
            endTime: event.endTime || '10:00',
            category: event.category || 'other',
            description: event.description || '',
            reminder: event.reminder || '60'
        };
        this.events.push(newEvent);
        return this.events.length - 1;
    }

    // Clear all events
    clearEvents() {
        this.events = [];
    }

    // Get events count
    getCount() {
        return this.events.length;
    }

    // Validate event data
    validateEvent(event) {
        const errors = [];

        if (!event.title || event.title.trim() === '') {
            errors.push('Event title is required');
        }

        if (!event.date) {
            errors.push('Event date is required');
        } else if (!this.isValidDate(event.date)) {
            errors.push('Invalid date format');
        }

        if (!event.startTime) {
            errors.push('Start time is required');
        } else if (!this.isValidTime(event.startTime)) {
            errors.push('Invalid start time format');
        }

        if (!event.endTime) {
            errors.push('End time is required');
        } else if (!this.isValidTime(event.endTime)) {
            errors.push('Invalid end time format');
        }

        if (event.startTime && event.endTime && event.startTime >= event.endTime) {
            errors.push('End time must be after start time');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Validate all events
    validateAllEvents() {
        const allErrors = [];
        this.events.forEach((event, index) => {
            const validation = this.validateEvent(event);
            if (!validation.valid) {
                allErrors.push({
                    index,
                    title: event.title,
                    errors: validation.errors
                });
            }
        });
        return allErrors;
    }

    // Generate events table HTML
    generateEventsTableHTML() {
        if (this.events.length === 0) {
            return '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #666;">No events extracted yet. Upload files and click "Extract Events with AI" to get started.</td></tr>';
        }

        return this.events.map((event, index) => `
            <tr>
                <td>
                    <input type="text" 
                           class="event-input" 
                           value="${this.escapeHTML(event.title)}" 
                           onchange="app.eventManager.updateEvent(${index}, 'title', this.value)"
                           placeholder="Event title">
                </td>
                <td>
                    <input type="date" 
                           class="event-input" 
                           value="${event.date}" 
                           onchange="app.eventManager.updateEvent(${index}, 'date', this.value)">
                </td>
                <td>
                    <input type="time" 
                           class="event-input" 
                           value="${event.startTime}" 
                           onchange="app.eventManager.updateEvent(${index}, 'startTime', this.value)">
                </td>
                <td>
                    <input type="time" 
                           class="event-input" 
                           value="${event.endTime}" 
                           onchange="app.eventManager.updateEvent(${index}, 'endTime', this.value)">
                </td>
                <td>
                    <select class="event-select" 
                            onchange="app.eventManager.updateEvent(${index}, 'category', this.value)">
                        ${this.generateCategoryOptions(event.category)}
                    </select>
                </td>
                <td>
                    <select class="event-select" 
                            onchange="app.eventManager.updateEvent(${index}, 'reminder', this.value)">
                        ${this.generateReminderOptions(event.reminder)}
                    </select>
                </td>
                <td>
                    <button class="delete-btn" 
                            onclick="app.eventManager.deleteEvent(${index}); app.updateEventsDisplay()"
                            title="Delete event">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Generate category options HTML
    generateCategoryOptions(selectedCategory) {
        return this.categories.map(category => `
            <option value="${category}" ${category === selectedCategory ? 'selected' : ''}>
                ${this.capitalizeFirst(category)}
            </option>
        `).join('');
    }

    // Generate reminder options HTML
    generateReminderOptions(selectedReminder) {
        return this.reminderOptions.map(option => `
            <option value="${option.value}" ${option.value === selectedReminder ? 'selected' : ''}>
                ${option.label}
            </option>
        `).join('');
    }

    // Generate events statistics HTML
    generateStatsHTML() {
        if (this.events.length === 0) {
            return '';
        }

        const categoryStats = {};
        this.events.forEach(event => {
            categoryStats[event.category] = (categoryStats[event.category] || 0) + 1;
        });

        const statsText = Object.entries(categoryStats)
            .map(([category, count]) => `${count} ${this.capitalizeFirst(category)}`)
            .join(', ');

        return `📊 ${this.events.length} event${this.events.length !== 1 ? 's' : ''} extracted: ${statsText}`;
    }

    // Sort events by date and time
    sortEvents() {
        this.events.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.startTime);
            const dateB = new Date(b.date + 'T' + b.startTime);
            return dateA - dateB;
        });
    }

    // Get events for a specific date range
    getEventsInRange(startDate, endDate) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startDate && eventDate <= endDate;
        });
    }

    // Export events as JSON
    exportToJSON() {
        return JSON.stringify(this.events, null, 2);
    }

    // Import events from JSON
    importFromJSON(jsonString) {
        try {
            const events = JSON.parse(jsonString);
            if (Array.isArray(events)) {
                this.events = events;
                return { success: true };
            } else {
                return { success: false, error: 'Invalid JSON format' };
            }
        } catch (error) {
            return { success: false, error: 'Failed to parse JSON' };
        }
    }

    // Utility methods
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    isValidTime(timeString) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(timeString);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Create a copy of events for API submission
    getEventsForSubmission() {
        return this.events.map(event => ({
            title: event.title.trim(),
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            category: event.category,
            description: event.description || '',
            reminder: event.reminder
        }));
    }
}