// Main application controller
import { FileHandler } from './fileHandler.js';
import { EventManager } from './eventManager.js';
import { ICSGenerator } from './icsGenerator.js';

class AISchedulerApp {
    constructor() {
        this.fileHandler = new FileHandler();
        this.eventManager = new EventManager();
        this.icsGenerator = new ICSGenerator();
        
        this.isProcessing = false;
        this.apiBaseUrl = '/api';
        
        this.initializeElements();
        this.initializeEvents();
        
        console.log('🚀 AI Scheduler App initialized');
    }

    // Get DOM elements
    initializeElements() {
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            fileList: document.getElementById('fileList'),
            processBtn: document.getElementById('processBtn'),
            clearBtn: document.getElementById('clearBtn'),
            status: document.getElementById('status'),
            eventsSection: document.getElementById('eventsSection'),
            eventsStats: document.getElementById('eventsStats'),
            eventsTableBody: document.getElementById('eventsTableBody'),
            generateBtn: document.getElementById('generateBtn'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            loadingText: document.getElementById('loadingText')
        };

        // Make app instance globally available for inline event handlers
        window.app = this;
    }

    // Initialize event listeners
    initializeEvents() {
        // File handler events
        this.fileHandler.initializeEvents(
            this.elements.uploadArea,
            this.elements.fileInput,
            (files, errors) => this.onFilesChanged(files, errors)
        );

        // Button events
        this.elements.processBtn.addEventListener('click', () => this.processFiles());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.generateBtn.addEventListener('click', () => this.generateCalendar());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    // Handle file changes
    onFilesChanged(files, errors) {
        this.updateFileDisplay();
        this.updateProcessButton();
        
        if (errors && errors.length > 0) {
            this.showStatus(errors.join('<br>'), 'error');
        }
    }

    // Update file list display
    updateFileDisplay() {
        const fileList = this.elements.fileList;
        
        if (!this.fileHandler.hasFiles()) {
            fileList.style.display = 'none';
            return;
        }

        fileList.style.display = 'block';
        fileList.innerHTML = this.fileHandler.generateFileListHTML();
    }

    // Update process button state
    updateProcessButton() {
        this.elements.processBtn.disabled = !this.fileHandler.hasFiles() || this.isProcessing;
    }

    // Process files with AI
    async processFiles() {
        if (this.isProcessing || !this.fileHandler.hasFiles()) {
            return;
        }

        this.setProcessingState(true, 'Analyzing files with AI...');

        try {
            const formData = this.fileHandler.createFormData();
            
            const response = await fetch(`${this.apiBaseUrl}/extract-events`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process files');
            }

            if (data.events && data.events.length > 0) {
                this.eventManager.setEvents(data.events);
                this.eventManager.sortEvents();
                this.updateEventsDisplay();
                this.showEventsSection();
                this.showStatus(
                    `✅ Successfully extracted ${data.eventsExtracted} event${data.eventsExtracted !== 1 ? 's' : ''} from ${data.filesProcessed} file${data.filesProcessed !== 1 ? 's' : ''}!`,
                    'success'
                );
            } else {
                this.showStatus('No events found in the uploaded files. Try uploading files with clearer event information.', 'warning');
            }

        } catch (error) {
            console.error('Error processing files:', error);
            this.showStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            this.setProcessingState(false);
        }
    }

    // Generate and download calendar file
    async generateCalendar() {
        const events = this.eventManager.getEvents();
        
        if (events.length === 0) {
            this.showStatus('No events to generate calendar for!', 'error');
            return;
        }

        // Validate all events before generating
        const validationErrors = this.eventManager.validateAllEvents();
        if (validationErrors.length > 0) {
            let errorMessage = 'Please fix the following errors before generating calendar:<br>';
            validationErrors.forEach(error => {
                errorMessage += `• Event "${error.title}": ${error.errors.join(', ')}<br>`;
            });
            this.showStatus(errorMessage, 'error');
            return;
        }

        try {
            this.setProcessingState(true, 'Generating calendar file...');

            // Generate ICS file
            const result = this.icsGenerator.downloadICS(events);
            
            if (result.success) {
                this.showStatus('📅 Calendar file generated and downloaded successfully!', 'success');
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error('Error generating calendar:', error);
            this.showStatus(`❌ Error generating calendar: ${error.message}`, 'error');
        } finally {
            this.setProcessingState(false);
        }
    }

    // Update events display
    updateEventsDisplay() {
        this.elements.eventsTableBody.innerHTML = this.eventManager.generateEventsTableHTML();
        this.elements.eventsStats.innerHTML = this.eventManager.generateStatsHTML();
    }

    // Show events section
    showEventsSection() {
        this.elements.eventsSection.style.display = 'block';
        // Smooth scroll to events section
        this.elements.eventsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Hide events section
    hideEventsSection() {
        this.elements.eventsSection.style.display = 'none';
    }

    // Set processing state
    setProcessingState(isProcessing, loadingText = 'Processing...') {
        this.isProcessing = isProcessing;
        
        // Update loading overlay
        if (isProcessing) {
            this.elements.loadingText.textContent = loadingText;
            this.elements.loadingOverlay.style.display = 'flex';
        } else {
            this.elements.loadingOverlay.style.display = 'none';
        }
        
        // Update button states
        this.updateProcessButton();
        this.elements.generateBtn.disabled = isProcessing;
        this.elements.clearBtn.disabled = isProcessing;
    }

    // Show status message
    showStatus(message, type = 'info') {
        const status = this.elements.status;
        status.className = `status ${type}`;
        status.innerHTML = message;
        status.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                if (status.classList.contains('success')) {
                    status.style.display = 'none';
                }
            }, 5000);
        }
        
        // Scroll to status if it's an error or warning
        if (type === 'error' || type === 'warning') {
            status.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    // Hide status message
    hideStatus() {
        this.elements.status.style.display = 'none';
    }

    // Clear all data
    clearAll() {
        if (this.isProcessing) {
            return;
        }

        // Confirm if there are events
        if (this.eventManager.getCount() > 0) {
            if (!confirm('Are you sure you want to clear all files and events? This action cannot be undone.')) {
                return;
            }
        }

        this.fileHandler.clearAll();
        this.eventManager.clearEvents();
        this.updateFileDisplay();
        this.updateProcessButton();
        this.updateEventsDisplay();
        this.hideEventsSection();
        this.hideStatus();
        
        // Clear file input
        this.elements.fileInput.value = '';
        
        this.showStatus('All data cleared successfully.', 'info');
        setTimeout(() => this.hideStatus(), 2000);
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter: Process files
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!this.elements.processBtn.disabled) {
                this.processFiles();
            }
        }
        
        // Ctrl/Cmd + G: Generate calendar
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            if (!this.elements.generateBtn.disabled && this.eventManager.getCount() > 0) {
                this.generateCalendar();
            }
        }
        
        // Ctrl/Cmd + R: Clear all (override browser refresh)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r' && e.shiftKey) {
            e.preventDefault();
            this.clearAll();
        }
        
        // Escape: Cancel processing (if possible)
        if (e.key === 'Escape' && this.isProcessing) {
            // Note: Cannot actually cancel fetch request easily, but hide loading
            this.setProcessingState(false);
        }
    }

    // Add new event manually
    addEvent() {
        const newIndex = this.eventManager.addEvent({});
        this.updateEventsDisplay();
        this.showEventsSection();
        
        // Focus on the new event's title field
        setTimeout(() => {
            const titleInput = document.querySelector(`tr:nth-child(${newIndex + 1}) .event-input`);
            if (titleInput) {
                titleInput.focus();
                titleInput.select();
            }
        }, 100);
    }

    // Export events as JSON
    exportEvents() {
        const events = this.eventManager.getEvents();
        if (events.length === 0) {
            this.showStatus('No events to export!', 'error');
            return;
        }

        const jsonContent = this.eventManager.exportToJSON();
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-scheduler-events.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showStatus('Events exported successfully!', 'success');
    }

    // Import events from JSON
    importEvents(jsonString) {
        const result = this.eventManager.importFromJSON(jsonString);
        if (result.success) {
            this.updateEventsDisplay();
            this.showEventsSection();
            this.showStatus('Events imported successfully!', 'success');
        } else {
            this.showStatus(`Import failed: ${result.error}`, 'error');
        }
    }

    // Get app statistics
    getStats() {
        return {
            filesUploaded: this.fileHandler.getFileCount(),
            totalFileSize: this.fileHandler.formatFileSize(this.fileHandler.getTotalSize()),
            eventsExtracted: this.eventManager.getCount(),
            categories: this.eventManager.getEvents().reduce((acc, event) => {
                acc[event.category] = (acc[event.category] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiScheduler = new AISchedulerApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ App hidden');
    } else {
        console.log('👁️ App visible');
    }
});

// Handle before unload
window.addEventListener('beforeunload', (e) => {
    if (window.aiScheduler && window.aiScheduler.isProcessing) {
        e.preventDefault();
        e.returnValue = 'Processing is in progress. Are you sure you want to leave?';
    }
});