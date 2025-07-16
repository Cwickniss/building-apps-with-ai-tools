// ICS (iCalendar) file generation utilities
export class ICSGenerator {
    constructor() {
        this.productId = '-//AI Scheduler//AI Scheduler 1.0//EN';
    }

    // Generate ICS content from events
    generateICS(events) {
        if (!events || !Array.isArray(events) || events.length === 0) {
            throw new Error('No events provided for ICS generation');
        }

        const now = new Date();
        const timestamp = this.formatDateForICS(now);
        
        let ics = 'BEGIN:VCALENDAR\r\n';
        ics += 'VERSION:2.0\r\n';
        ics += `PRODID:${this.productId}\r\n`;
        ics += 'CALSCALE:GREGORIAN\r\n';
        ics += 'METHOD:PUBLISH\r\n';

        events.forEach((event, index) => {
            try {
                ics += this.generateVEvent(event, index, timestamp);
            } catch (error) {
                console.warn(`Skipping invalid event at index ${index}:`, error.message);
            }
        });

        ics += 'END:VCALENDAR\r\n';
        return ics;
    }

    // Generate a single VEVENT
    generateVEvent(event, index, timestamp) {
        // Validate required fields
        this.validateEvent(event);

        const eventDate = event.date.replace(/-/g, '');
        const startDateTime = eventDate + 'T' + event.startTime.replace(':', '') + '00';
        const endDateTime = eventDate + 'T' + event.endTime.replace(':', '') + '00';
        const uid = `event-${index}-${timestamp}@aischeduler.com`;

        let vevent = 'BEGIN:VEVENT\r\n';
        vevent += `UID:${uid}\r\n`;
        vevent += `DTSTAMP:${timestamp}\r\n`;
        vevent += `DTSTART:${startDateTime}\r\n`;
        vevent += `DTEND:${endDateTime}\r\n`;
        vevent += `SUMMARY:${this.escapeICSValue(event.title)}\r\n`;
        vevent += `CATEGORIES:${(event.category || 'other').toUpperCase()}\r\n`;
        
        if (event.description && event.description.trim()) {
            vevent += `DESCRIPTION:${this.escapeICSValue(event.description)}\r\n`;
        }
        
        // Add alarm/reminder if specified
        if (event.reminder && event.reminder !== '0') {
            vevent += this.generateAlarm(event.reminder, event.title);
        }
        
        vevent += 'END:VEVENT\r\n';
        return vevent;
    }

    // Generate alarm/reminder component
    generateAlarm(reminderMinutes, eventTitle) {
        let alarm = 'BEGIN:VALARM\r\n';
        alarm += `TRIGGER:-PT${reminderMinutes}M\r\n`;
        alarm += 'ACTION:DISPLAY\r\n';
        alarm += `DESCRIPTION:Reminder: ${this.escapeICSValue(eventTitle)}\r\n`;
        alarm += 'END:VALARM\r\n';
        return alarm;
    }

    // Validate event data
    validateEvent(event) {
        if (!event.title || event.title.trim() === '') {
            throw new Error('Event title is required');
        }
        
        if (!event.date) {
            throw new Error('Event date is required');
        }
        
        if (!this.isValidDate(event.date)) {
            throw new Error('Invalid date format');
        }
        
        if (!event.startTime) {
            throw new Error('Start time is required');
        }
        
        if (!this.isValidTime(event.startTime)) {
            throw new Error('Invalid start time format');
        }
        
        if (!event.endTime) {
            throw new Error('End time is required');
        }
        
        if (!this.isValidTime(event.endTime)) {
            throw new Error('Invalid end time format');
        }
        
        if (event.startTime >= event.endTime) {
            throw new Error('End time must be after start time');
        }
    }

    // Format date for ICS (YYYYMMDDTHHMMSSZ format)
    formatDateForICS(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Escape special characters for ICS format
    escapeICSValue(value) {
        if (!value) return '';
        
        return value
            .replace(/\\/g, '\\\\')    // Escape backslashes
            .replace(/;/g, '\\;')      // Escape semicolons
            .replace(/,/g, '\\,')      // Escape commas
            .replace(/\n/g, '\\n')     // Escape newlines
            .replace(/\r/g, '')        // Remove carriage returns
            .substring(0, 75);         // Limit length to prevent issues
    }

    // Download ICS file
    downloadICS(events, filename = 'ai-generated-calendar.ics') {
        try {
            const icsContent = this.generateICS(events);
            this.downloadFile(icsContent, filename, 'text/calendar');
            return { success: true };
        } catch (error) {
            console.error('Error generating ICS file:', error);
            return { 
                success: false, 
                error: error.message || 'Failed to generate calendar file' 
            };
        }
    }

    // Download file utility
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    // Validate date format (YYYY-MM-DD)
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
    }

    // Validate time format (HH:MM)
    isValidTime(timeString) {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(timeString);
    }

    // Generate preview of ICS content for debugging
    generatePreview(events, maxEvents = 5) {
        if (!events || events.length === 0) {
            return 'No events to preview';
        }

        const previewEvents = events.slice(0, maxEvents);
        let preview = `Calendar Preview (${events.length} event${events.length !== 1 ? 's' : ''}):\n\n`;
        
        previewEvents.forEach((event, index) => {
            preview += `${index + 1}. ${event.title}\n`;
            preview += `   Date: ${event.date}\n`;
            preview += `   Time: ${event.startTime} - ${event.endTime}\n`;
            preview += `   Category: ${event.category}\n`;
            if (event.description) {
                preview += `   Description: ${event.description}\n`;
            }
            if (event.reminder && event.reminder !== '0') {
                const reminderText = this.getReminderText(event.reminder);
                preview += `   Reminder: ${reminderText}\n`;
            }
            preview += '\n';
        });

        if (events.length > maxEvents) {
            preview += `... and ${events.length - maxEvents} more event${events.length - maxEvents !== 1 ? 's' : ''}`;
        }

        return preview;
    }

    // Convert reminder minutes to human-readable text
    getReminderText(minutes) {
        const num = parseInt(minutes);
        if (num === 0) return 'No reminder';
        if (num < 60) return `${num} minute${num !== 1 ? 's' : ''}`;
        if (num < 1440) return `${Math.floor(num / 60)} hour${Math.floor(num / 60) !== 1 ? 's' : ''}`;
        if (num < 10080) return `${Math.floor(num / 1440)} day${Math.floor(num / 1440) !== 1 ? 's' : ''}`;
        return `${Math.floor(num / 10080)} week${Math.floor(num / 10080) !== 1 ? 's' : ''}`;
    }

    // Get file size estimate
    getFileSizeEstimate(events) {
        if (!events || events.length === 0) return '0 KB';
        
        // Rough estimate: ~200-300 bytes per event
        const estimatedBytes = events.length * 250;
        
        if (estimatedBytes < 1024) return `${estimatedBytes} bytes`;
        if (estimatedBytes < 1024 * 1024) return `${Math.round(estimatedBytes / 1024)} KB`;
        return `${Math.round(estimatedBytes / (1024 * 1024))} MB`;
    }
}