// File handling utilities
export class FileHandler {
    constructor() {
        this.files = [];
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['.md', '.json', '.txt'];
        this.allowedMimeTypes = ['text/plain', 'text/markdown', 'application/json'];
    }

    // Initialize file upload events
    initializeEvents(uploadArea, fileInput, onFilesChange) {
        this.onFilesChange = onFilesChange;

        // Upload area click
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, uploadArea));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, uploadArea));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e, uploadArea));

        // File input change
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleDragOver(e, uploadArea) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    }

    handleDragLeave(e, uploadArea) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    }

    handleDrop(e, uploadArea) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
        // Clear the input so the same file can be selected again
        e.target.value = '';
    }

    addFiles(files) {
        const validFiles = [];
        const errors = [];

        files.forEach(file => {
            const validation = this.validateFile(file);
            if (validation.valid) {
                // Check if file already exists
                const exists = this.files.some(existingFile => 
                    existingFile.name === file.name && 
                    existingFile.size === file.size
                );
                
                if (!exists) {
                    validFiles.push(file);
                } else {
                    errors.push(`File "${file.name}" is already added`);
                }
            } else {
                errors.push(validation.error);
            }
        });

        if (validFiles.length > 0) {
            this.files = [...this.files, ...validFiles];
            this.onFilesChange(this.files, null);
        }

        if (errors.length > 0) {
            this.onFilesChange(this.files, errors);
        }
    }

    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                error: `File "${file.name}" is too large (max ${this.formatFileSize(this.maxFileSize)})`
            };
        }

        // Check file type
        const ext = '.' + file.name.toLowerCase().split('.').pop();
        const hasValidExt = this.allowedTypes.includes(ext);
        const hasValidMime = this.allowedMimeTypes.includes(file.type);

        if (!hasValidExt && !hasValidMime) {
            return {
                valid: false,
                error: `File "${file.name}" has invalid type. Only .md, .json, and .txt files are allowed`
            };
        }

        return { valid: true };
    }

    removeFile(index) {
        if (index >= 0 && index < this.files.length) {
            this.files.splice(index, 1);
            this.onFilesChange(this.files, null);
        }
    }

    clearAll() {
        this.files = [];
        this.onFilesChange(this.files, null);
    }

    getFiles() {
        return this.files;
    }

    hasFiles() {
        return this.files.length > 0;
    }

    getFileCount() {
        return this.files.length;
    }

    getTotalSize() {
        return this.files.reduce((total, file) => total + file.size, 0);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Create FormData for API submission
    createFormData() {
        const formData = new FormData();
        this.files.forEach(file => {
            formData.append('files', file);
        });
        return formData;
    }

    // Generate file list HTML
    generateFileListHTML() {
        if (this.files.length === 0) {
            return '';
        }

        let html = '<h3>📁 Uploaded Files:</h3>';
        
        this.files.forEach((file, index) => {
            html += `
                <div class="file-item">
                    <div>
                        <div class="file-name">${this.escapeHTML(file.name)}</div>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                    <button onclick="app.fileHandler.removeFile(${index})" class="delete-btn" title="Remove file">
                        Remove
                    </button>
                </div>
            `;
        });

        return html;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}