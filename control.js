// VMix HTML5 Graphics System - Control Panel Logic
// Handles UI, communication, and data source integrations

class ControlPanel {
    constructor() {
        this.previewFrame = document.getElementById('previewFrame');
        this.transmitFrame = document.getElementById('transmitFrame');
        this.customFontUrl = null;
        
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupLowerThirdControls();
        this.setupTickerControls();
        this.setupDataSourceControls();
        this.setupStylingControls();
        this.setupOutputControls();
        this.updateOutputUrl();
        this.loadSavedState();
        this.setupPreviewScaling();
        
        console.log('Control Panel initialized');
    }
    
    // Setup preview window scaling
    setupPreviewScaling() {
        const scalePreview = () => {
            const previewFrames = document.querySelectorAll('.preview-frame');
            previewFrames.forEach(frame => {
                const iframe = frame.querySelector('iframe');
                if (iframe) {
                    const scale = frame.offsetWidth / 1920;
                    iframe.style.transform = `scale(${scale})`;
                }
            });
        };
        
        // Scale on load
        window.addEventListener('load', () => {
            setTimeout(scalePreview, 100);
        });
        
        // Scale on window resize
        window.addEventListener('resize', scalePreview);
        
        // Initial scale
        setTimeout(scalePreview, 100);
    }
    
    // Tab System
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId, button);
            });
        });
    }
    
    switchTab(tabId, button) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabId).classList.add('active');
        button.classList.add('active');
    }
    
    // Lower Third Controls
    setupLowerThirdControls() {
        // Show buttons
        document.getElementById('btnShowL3Preview').addEventListener('click', () => {
            this.sendToFrame('preview', 'showL3', this.getLowerThirdConfig());
        });
        
        document.getElementById('btnShowL3Transmit').addEventListener('click', () => {
            this.sendToFrame('transmit', 'showL3', this.getLowerThirdConfig());
        });
        
        document.getElementById('btnShowL3Both').addEventListener('click', () => {
            this.sendToFrame('both', 'showL3', this.getLowerThirdConfig());
        });
        
        // Hide buttons
        document.getElementById('btnHideL3Preview').addEventListener('click', () => {
            this.sendToFrame('preview', 'hideL3');
        });
        
        document.getElementById('btnHideL3Transmit').addEventListener('click', () => {
            this.sendToFrame('transmit', 'hideL3');
        });
        
        document.getElementById('btnHideL3Both').addEventListener('click', () => {
            this.sendToFrame('both', 'hideL3');
        });
        
        // Real-time updates for preview when typing
        const l3Inputs = ['l3Primary', 'l3Secondary', 'l3X', 'l3Y', 'l3FontSize1', 
                          'l3FontSize2', 'l3BorderRadius', 'l3BoxSpacing',
                          'l3PrimaryBg', 'l3PrimaryColor', 'l3SecondaryBg', 'l3SecondaryColor',
                          'l3ShowPrimary', 'l3ShowSecondary'];
        
        l3Inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    // Auto-update preview in real-time
                    this.sendToFrame('preview', 'updateL3', this.getLowerThirdConfig());
                });
            }
        });
    }
    
    getLowerThirdConfig() {
        return {
            primaryText: document.getElementById('l3Primary').value,
            secondaryText: document.getElementById('l3Secondary').value,
            primaryBg: document.getElementById('l3PrimaryBg').value,
            primaryColor: document.getElementById('l3PrimaryColor').value,
            secondaryBg: document.getElementById('l3SecondaryBg').value,
            secondaryColor: document.getElementById('l3SecondaryColor').value,
            x: parseInt(document.getElementById('l3X').value) || 80,
            y: parseInt(document.getElementById('l3Y').value) || 850,
            fontSize1: parseInt(document.getElementById('l3FontSize1').value) || 42,
            fontSize2: parseInt(document.getElementById('l3FontSize2').value) || 36,
            borderRadius: parseInt(document.getElementById('l3BorderRadius').value) || 25,
            boxSpacing: parseInt(document.getElementById('l3BoxSpacing').value) || 10,
            showPrimary: document.getElementById('l3ShowPrimary').checked,
            showSecondary: document.getElementById('l3ShowSecondary').checked,
            fontFamily: this.getCurrentFont()
        };
    }
    
    // Ticker Controls
    setupTickerControls() {
        // Show ticker position selector
        document.getElementById('tickerPosition').addEventListener('change', (e) => {
            const customPosRow = document.getElementById('tickerCustomPosRow');
            if (e.target.value === 'custom') {
                customPosRow.style.display = 'grid';
            } else {
                customPosRow.style.display = 'none';
            }
        });
        
        // Show buttons
        document.getElementById('btnShowTickerPreview').addEventListener('click', () => {
            this.sendToFrame('preview', 'showTicker', this.getTickerConfig());
        });
        
        document.getElementById('btnShowTickerTransmit').addEventListener('click', () => {
            this.sendToFrame('transmit', 'showTicker', this.getTickerConfig());
        });
        
        document.getElementById('btnShowTickerBoth').addEventListener('click', () => {
            this.sendToFrame('both', 'showTicker', this.getTickerConfig());
        });
        
        // Hide buttons
        document.getElementById('btnHideTickerPreview').addEventListener('click', () => {
            this.sendToFrame('preview', 'hideTicker');
        });
        
        document.getElementById('btnHideTickerTransmit').addEventListener('click', () => {
            this.sendToFrame('transmit', 'hideTicker');
        });
        
        document.getElementById('btnHideTickerBoth').addEventListener('click', () => {
            this.sendToFrame('both', 'hideTicker');
        });
        
        // Real-time preview updates
        const tickerInputs = ['tickerText', 'tickerSpeed', 'tickerPosition', 
                             'tickerCustomPos', 'tickerBg', 'tickerBgOpacity',
                             'tickerColor', 'tickerFontSize'];
        
        tickerInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.sendToFrame('preview', 'updateTicker', this.getTickerConfig());
                });
            }
        });
    }
    
    getTickerConfig() {
        const text = document.getElementById('tickerText').value;
        const items = text.split('|').map(item => item.trim()).filter(item => item);
        const position = document.getElementById('tickerPosition').value;
        const bgColor = document.getElementById('tickerBg').value;
        const bgOpacity = parseInt(document.getElementById('tickerBgOpacity').value) / 100;
        
        // Convert hex to rgba
        const bg = this.hexToRgba(bgColor, bgOpacity);
        
        return {
            items: items,
            speed: parseInt(document.getElementById('tickerSpeed').value) || 20,
            position: position === 'custom' ? 
                     parseInt(document.getElementById('tickerCustomPos').value) : position,
            bg: bg,
            color: document.getElementById('tickerColor').value,
            fontSize: parseInt(document.getElementById('tickerFontSize').value) || 28
        };
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Data Source Controls
    setupDataSourceControls() {
        // Google Sheets
        document.getElementById('btnTestGsheet').addEventListener('click', () => {
            this.testGoogleSheets();
        });
        
        document.getElementById('btnLoadGsheet').addEventListener('click', () => {
            this.loadGoogleSheets();
        });
        
        // Rundown Creator
        document.getElementById('btnListRundowns').addEventListener('click', () => {
            this.listRundowns();
        });
        
        document.getElementById('btnLoadRundown').addEventListener('click', () => {
            this.loadRundown();
        });
        
        // JSON Config
        document.getElementById('btnLoadJson').addEventListener('click', () => {
            this.loadJsonConfig();
        });
        
        document.getElementById('btnExportJson').addEventListener('click', () => {
            this.exportJsonConfig();
        });
    }
    
    async testGoogleSheets() {
        const url = document.getElementById('gsheetUrl').value;
        const statusDiv = document.getElementById('gsheetStatus');
        
        if (!url) {
            statusDiv.innerHTML = '<p style="color: #dc3545;">Please enter a Google Sheets URL</p>';
            return;
        }
        
        statusDiv.innerHTML = '<p style="color: #ffc107;">Testing connection...</p>';
        
        try {
            const csvUrl = this.convertToCSVUrl(url);
            const response = await fetch(csvUrl);
            
            if (response.ok) {
                const text = await response.text();
                const rows = this.parseCSV(text);
                statusDiv.innerHTML = `<p style="color: #28a745;">✓ Connection successful! Found ${rows.length} rows.</p>`;
            } else {
                statusDiv.innerHTML = '<p style="color: #dc3545;">✗ Failed to connect. Make sure the sheet is public.</p>';
            }
        } catch (error) {
            statusDiv.innerHTML = `<p style="color: #dc3545;">✗ Error: ${error.message}</p>`;
        }
    }
    
    async loadGoogleSheets() {
        const url = document.getElementById('gsheetUrl').value;
        const statusDiv = document.getElementById('gsheetStatus');
        
        if (!url) {
            statusDiv.innerHTML = '<p style="color: #dc3545;">Please enter a Google Sheets URL</p>';
            return;
        }
        
        statusDiv.innerHTML = '<p style="color: #ffc107;">Loading data...</p>';
        
        try {
            const csvUrl = this.convertToCSVUrl(url);
            const response = await fetch(csvUrl);
            
            if (response.ok) {
                const text = await response.text();
                const rows = this.parseCSV(text);
                
                if (rows.length > 0) {
                    // Assuming columns: Name, Title
                    const firstRow = rows[0];
                    document.getElementById('l3Primary').value = firstRow[0] || '';
                    document.getElementById('l3Secondary').value = firstRow[1] || '';
                    
                    statusDiv.innerHTML = `<p style="color: #28a745;">✓ Loaded: ${firstRow[0]}</p>`;
                    
                    // Update preview
                    this.sendToFrame('preview', 'updateL3', this.getLowerThirdConfig());
                } else {
                    statusDiv.innerHTML = '<p style="color: #dc3545;">No data found in sheet</p>';
                }
            } else {
                statusDiv.innerHTML = '<p style="color: #dc3545;">Failed to load. Make sure the sheet is public.</p>';
            }
        } catch (error) {
            statusDiv.innerHTML = `<p style="color: #dc3545;">Error: ${error.message}</p>`;
        }
    }
    
    convertToCSVUrl(sheetUrl) {
        // Convert Google Sheets URL to CSV export URL
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
            const sheetId = match[1];
            return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
        throw new Error('Invalid Google Sheets URL');
    }
    
    parseCSV(text) {
        const lines = text.split('\n');
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) { // Skip header row
            if (lines[i].trim()) {
                const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                rows.push(values);
            }
        }
        
        return rows;
    }
    
    async listRundowns() {
        const channel = document.getElementById('rcChannel').value;
        const apiKey = document.getElementById('rcApiKey').value;
        const apiToken = document.getElementById('rcApiToken').value;
        const statusDiv = document.getElementById('rcStatus');
        
        if (!channel || !apiKey || !apiToken) {
            statusDiv.innerHTML = '<p style="color: #dc3545;">Please enter all API credentials</p>';
            return;
        }
        
        statusDiv.innerHTML = '<p style="color: #ffc107;">Loading rundowns...</p>';
        
        try {
            const url = `https://www.rundowncreator.com/${channel}/API.php?APIKey=${apiKey}&APIToken=${apiToken}&Action=getRundowns`;
            const response = await fetch(url);
            
            if (response.ok) {
                const rundowns = await response.json();
                
                let html = '<p style="color: #28a745;">✓ Available Rundowns:</p><ul style="color: white;">';
                rundowns.forEach(r => {
                    html += `<li>ID: ${r.RundownID} - ${r.Title}</li>`;
                });
                html += '</ul>';
                
                statusDiv.innerHTML = html;
            } else {
                statusDiv.innerHTML = '<p style="color: #dc3545;">Failed to load rundowns. Check credentials.</p>';
            }
        } catch (error) {
            statusDiv.innerHTML = `<p style="color: #dc3545;">Error: ${error.message}</p>`;
        }
    }
    
    async loadRundown() {
        const channel = document.getElementById('rcChannel').value;
        const apiKey = document.getElementById('rcApiKey').value;
        const apiToken = document.getElementById('rcApiToken').value;
        const rundownId = document.getElementById('rcRundownId').value;
        const statusDiv = document.getElementById('rcStatus');
        
        if (!channel || !apiKey || !apiToken || !rundownId) {
            statusDiv.innerHTML = '<p style="color: #dc3545;">Please enter all fields including Rundown ID</p>';
            return;
        }
        
        statusDiv.innerHTML = '<p style="color: #ffc107;">Loading rundown data...</p>';
        
        try {
            const url = `https://www.rundowncreator.com/${channel}/API.php?APIKey=${apiKey}&APIToken=${apiToken}&Action=getRows&RundownID=${rundownId}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const rows = await response.json();
                
                if (rows.length > 0) {
                    // Use first row data - customize this based on your rundown structure
                    const firstRow = rows[0];
                    document.getElementById('l3Primary').value = firstRow.Slug || '';
                    document.getElementById('l3Secondary').value = firstRow.Title || '';
                    
                    statusDiv.innerHTML = `<p style="color: #28a745;">✓ Loaded ${rows.length} rows from rundown</p>`;
                    
                    // Update preview
                    this.sendToFrame('preview', 'updateL3', this.getLowerThirdConfig());
                } else {
                    statusDiv.innerHTML = '<p style="color: #dc3545;">No rows found in rundown</p>';
                }
            } else {
                statusDiv.innerHTML = '<p style="color: #dc3545;">Failed to load rundown. Check ID and credentials.</p>';
            }
        } catch (error) {
            statusDiv.innerHTML = `<p style="color: #dc3545;">Error: ${error.message}</p>`;
        }
    }
    
    loadJsonConfig() {
        const fileInput = document.getElementById('jsonFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a JSON file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                this.applyConfig(config);
                alert('Configuration loaded successfully!');
            } catch (error) {
                alert('Error parsing JSON: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    applyConfig(config) {
        if (config.lowerThird) {
            const lt = config.lowerThird;
            if (lt.primaryText) document.getElementById('l3Primary').value = lt.primaryText;
            if (lt.secondaryText) document.getElementById('l3Secondary').value = lt.secondaryText;
            if (lt.x) document.getElementById('l3X').value = lt.x;
            if (lt.y) document.getElementById('l3Y').value = lt.y;
            // Apply other L3 settings...
        }
        
        if (config.ticker) {
            const ticker = config.ticker;
            if (ticker.items) document.getElementById('tickerText').value = ticker.items.join(' | ');
            if (ticker.speed) document.getElementById('tickerSpeed').value = ticker.speed;
            // Apply other ticker settings...
        }
        
        // Update previews
        this.sendToFrame('preview', 'updateL3', this.getLowerThirdConfig());
        this.sendToFrame('preview', 'updateTicker', this.getTickerConfig());
    }
    
    exportJsonConfig() {
        const config = {
            lowerThird: this.getLowerThirdConfig(),
            ticker: this.getTickerConfig(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vmix-graphics-config.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Styling Controls
    setupStylingControls() {
        // Font family selector
        document.getElementById('fontFamily').addEventListener('change', (e) => {
            const customFontRow = document.getElementById('customFontRow');
            const customFontNameRow = document.getElementById('customFontNameRow');
            
            if (e.target.value === 'custom') {
                customFontRow.style.display = 'grid';
                customFontNameRow.style.display = 'grid';
            } else {
                customFontRow.style.display = 'none';
                customFontNameRow.style.display = 'none';
            }
        });
        
        // Apply font button
        document.getElementById('btnApplyFont').addEventListener('click', () => {
            this.applyFont();
        });
        
        // Custom font upload
        document.getElementById('customFont').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.customFontUrl = URL.createObjectURL(file);
            }
        });
        
        // Style presets
        document.getElementById('btnPresetDefault').addEventListener('click', () => {
            this.applyPreset('default');
        });
        
        document.getElementById('btnPresetNews').addEventListener('click', () => {
            this.applyPreset('news');
        });
        
        document.getElementById('btnPresetSports').addEventListener('click', () => {
            this.applyPreset('sports');
        });
        
        document.getElementById('btnPresetCorporate').addEventListener('click', () => {
            this.applyPreset('corporate');
        });
    }
    
    getCurrentFont() {
        const fontFamily = document.getElementById('fontFamily').value;
        if (fontFamily === 'custom') {
            return document.getElementById('customFontName').value || 'Arial';
        }
        return fontFamily;
    }
    
    applyFont() {
        const fontFamily = document.getElementById('fontFamily').value;
        
        if (fontFamily === 'custom') {
            const fontName = document.getElementById('customFontName').value;
            if (!this.customFontUrl || !fontName) {
                alert('Please upload a font file and enter a font name');
                return;
            }
            
            const fontData = {
                name: fontName,
                url: this.customFontUrl
            };
            
            this.sendToFrame('both', 'setFont', fontData);
        }
        
        // Update L3 with new font
        this.sendToFrame('both', 'updateL3', this.getLowerThirdConfig());
    }
    
    applyPreset(preset) {
        const presets = {
            default: {
                l3PrimaryBg: '#ffffff',
                l3PrimaryColor: '#000000',
                l3SecondaryBg: '#dc3545',
                l3SecondaryColor: '#ffffff'
            },
            news: {
                l3PrimaryBg: '#1a1a1a',
                l3PrimaryColor: '#ffffff',
                l3SecondaryBg: '#c0392b',
                l3SecondaryColor: '#ffffff'
            },
            sports: {
                l3PrimaryBg: '#2c3e50',
                l3PrimaryColor: '#ffffff',
                l3SecondaryBg: '#27ae60',
                l3SecondaryColor: '#ffffff'
            },
            corporate: {
                l3PrimaryBg: '#34495e',
                l3PrimaryColor: '#ffffff',
                l3SecondaryBg: '#3498db',
                l3SecondaryColor: '#ffffff'
            }
        };
        
        const style = presets[preset];
        if (style) {
            document.getElementById('l3PrimaryBg').value = style.l3PrimaryBg;
            document.getElementById('l3PrimaryColor').value = style.l3PrimaryColor;
            document.getElementById('l3SecondaryBg').value = style.l3SecondaryBg;
            document.getElementById('l3SecondaryColor').value = style.l3SecondaryColor;
            
            // Update preview
            this.sendToFrame('preview', 'updateL3', this.getLowerThirdConfig());
        }
    }
    
    // Output Controls
    setupOutputControls() {
        document.getElementById('btnCopyUrl').addEventListener('click', () => {
            const url = document.getElementById('outputUrl').value;
            navigator.clipboard.writeText(url);
            alert('URL copied to clipboard!');
        });
        
        document.getElementById('btnOpenOutput').addEventListener('click', () => {
            window.open('output.html', '_blank');
        });
        
        document.getElementById('btnGenerateUrl').addEventListener('click', () => {
            this.generateParameterUrl();
        });
        
        document.getElementById('btnCopyGeneratedUrl').addEventListener('click', () => {
            const url = document.getElementById('generatedUrl').value;
            navigator.clipboard.writeText(url);
            alert('Generated URL copied to clipboard!');
        });
        
        // State management
        document.getElementById('btnSaveState').addEventListener('click', () => {
            this.saveState();
        });
        
        document.getElementById('btnLoadState').addEventListener('click', () => {
            this.loadSavedState();
        });
        
        document.getElementById('btnClearState').addEventListener('click', () => {
            localStorage.removeItem('vmixGraphicsState');
            alert('Saved state cleared!');
        });
    }
    
    updateOutputUrl() {
        const fullUrl = window.location.href.replace('control.html', 'output.html');
        document.getElementById('outputUrl').value = fullUrl;
    }
    
    generateParameterUrl() {
        const baseUrl = window.location.href.replace('control.html', 'output.html');
        const l3Config = this.getLowerThirdConfig();
        const tickerConfig = this.getTickerConfig();
        
        const params = new URLSearchParams();
        
        // Lower third params
        params.set('l3_show', 'true');
        params.set('l3_primary', l3Config.primaryText);
        params.set('l3_secondary', l3Config.secondaryText);
        params.set('l3_primary_bg', l3Config.primaryBg);
        params.set('l3_primary_color', l3Config.primaryColor);
        params.set('l3_secondary_bg', l3Config.secondaryBg);
        params.set('l3_secondary_color', l3Config.secondaryColor);
        params.set('l3_x', l3Config.x);
        params.set('l3_y', l3Config.y);
        params.set('l3_show_primary', l3Config.showPrimary);
        params.set('l3_show_secondary', l3Config.showSecondary);
        
        // Ticker params (if ticker has content)
        if (tickerConfig.items.length > 0) {
            params.set('ticker_show', 'true');
            params.set('ticker_text', tickerConfig.items.join('|'));
            params.set('ticker_speed', tickerConfig.speed);
            params.set('ticker_position', tickerConfig.position);
        }
        
        const fullUrl = baseUrl + '?' + params.toString();
        document.getElementById('generatedUrl').value = fullUrl;
    }
    
    saveState() {
        const state = {
            lowerThird: this.getLowerThirdConfig(),
            ticker: this.getTickerConfig(),
            gsheetUrl: document.getElementById('gsheetUrl').value,
            rcChannel: document.getElementById('rcChannel').value,
            rcApiKey: document.getElementById('rcApiKey').value,
            rcApiToken: document.getElementById('rcApiToken').value
        };
        
        localStorage.setItem('vmixGraphicsState', JSON.stringify(state));
        alert('State saved successfully!');
    }
    
    loadSavedState() {
        const savedState = localStorage.getItem('vmixGraphicsState');
        if (!savedState) {
            console.log('No saved state found');
            return;
        }
        
        try {
            const state = JSON.parse(savedState);
            
            // Load lower third config
            if (state.lowerThird) {
                const lt = state.lowerThird;
                document.getElementById('l3Primary').value = lt.primaryText || '';
                document.getElementById('l3Secondary').value = lt.secondaryText || '';
                document.getElementById('l3X').value = lt.x || 80;
                document.getElementById('l3Y').value = lt.y || 850;
                document.getElementById('l3FontSize1').value = lt.fontSize1 || 42;
                document.getElementById('l3FontSize2').value = lt.fontSize2 || 36;
                document.getElementById('l3BorderRadius').value = lt.borderRadius || 25;
                document.getElementById('l3BoxSpacing').value = lt.boxSpacing || 10;
                document.getElementById('l3PrimaryBg').value = lt.primaryBg || '#ffffff';
                document.getElementById('l3PrimaryColor').value = lt.primaryColor || '#000000';
                document.getElementById('l3SecondaryBg').value = lt.secondaryBg || '#dc3545';
                document.getElementById('l3SecondaryColor').value = lt.secondaryColor || '#ffffff';
                document.getElementById('l3ShowPrimary').checked = lt.showPrimary !== false;
                document.getElementById('l3ShowSecondary').checked = lt.showSecondary !== false;
            }
            
            // Load ticker config
            if (state.ticker && state.ticker.items) {
                document.getElementById('tickerText').value = state.ticker.items.join(' | ');
                document.getElementById('tickerSpeed').value = state.ticker.speed || 20;
            }
            
            // Load data source config
            if (state.gsheetUrl) {
                document.getElementById('gsheetUrl').value = state.gsheetUrl;
            }
            if (state.rcChannel) {
                document.getElementById('rcChannel').value = state.rcChannel;
            }
            if (state.rcApiKey) {
                document.getElementById('rcApiKey').value = state.rcApiKey;
            }
            if (state.rcApiToken) {
                document.getElementById('rcApiToken').value = state.rcApiToken;
            }
            
            console.log('State loaded successfully');
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }
    
    // Communication with iframes
    sendToFrame(target, action, config = {}) {
        const message = { action, config };
        
        if (target === 'preview' || target === 'both') {
            this.previewFrame.contentWindow.postMessage(message, '*');
        }
        
        if (target === 'transmit' || target === 'both') {
            this.transmitFrame.contentWindow.postMessage(message, '*');
        }
    }
}

// Initialize control panel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.controlPanel = new ControlPanel();
    });
} else {
    window.controlPanel = new ControlPanel();
}

