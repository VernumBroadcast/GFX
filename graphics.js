// VMix HTML5 Graphics System - Graphics Engine

// Handles rendering, animations, and communication for output page

class GraphicsEngine {
    constructor() {
        this.elements = {
            lowerThird: document.getElementById('lowerThird'),
            l3Primary: document.getElementById('l3Primary'),
            l3Secondary: document.getElementById('l3Secondary'),
            ticker: document.getElementById('ticker'),
            tickerContent: document.getElementById('tickerContent'),
            customGraphics: document.getElementById('customGraphics')
        };
        
        this.state = {
            l3Visible: false,
            tickerVisible: false,
            l3Config: {},
            tickerConfig: {},
            customFont: null
        };
        
        this.init();
    }
    
    init() {
        // Listen for postMessage commands from control panel
        window.addEventListener('message', (event) => {
            this.handleMessage(event.data);
        });
        
        // Parse URL parameters on load
        this.parseURLParams();
        
        // Monitor for config file changes (check every 5 seconds)
        this.startConfigMonitoring();
        
        console.log('VMix Graphics Engine initialized');
    }
    
    handleMessage(data) {
        if (!data.action) return;
        
        console.log('Received message:', data.action);
        
        switch(data.action) {
            case 'showL3':
                this.showLowerThird(data.config);
                break;
            case 'hideL3':
                this.hideLowerThird();
                break;
            case 'updateL3':
                this.updateLowerThird(data.config);
                break;
            case 'showTicker':
                this.showTicker(data.config);
                break;
            case 'hideTicker':
                this.hideTicker();
                break;
            case 'updateTicker':
                this.updateTicker(data.config);
                break;
            case 'setFont':
                this.setCustomFont(data.font);
                break;
            case 'updateStyles':
                this.updateStyles(data.styles);
                break;
            default:
                console.warn('Unknown action:', data.action);
        }
    }
    
    parseURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        // Lower Third params
        if (params.has('l3_show') && params.get('l3_show') === 'true') {
            const config = {
                primaryText: params.get('l3_primary') || '',
                secondaryText: params.get('l3_secondary') || '',
                primaryBg: params.get('l3_primary_bg') || '#ffffff',
                primaryColor: params.get('l3_primary_color') || '#000000',
                secondaryBg: params.get('l3_secondary_bg') || '#dc3545',
                secondaryColor: params.get('l3_secondary_color') || '#ffffff',
                x: parseInt(params.get('l3_x')) || 80,
                y: parseInt(params.get('l3_y')) || 850,
                showPrimary: params.get('l3_show_primary') !== 'false',
                showSecondary: params.get('l3_show_secondary') !== 'false'
            };
            this.showLowerThird(config);
        }
        
        // Ticker params
        if (params.has('ticker_show') && params.get('ticker_show') === 'true') {
            const config = {
                items: (params.get('ticker_text') || '').split('|'),
                speed: parseInt(params.get('ticker_speed')) || 20,
                position: params.get('ticker_position') || 'bottom'
            };
            this.showTicker(config);
        }
    }
    
    // Lower Third Methods
    showLowerThird(config) {
        this.state.l3Config = config;
        this.updateLowerThird(config);
        
        this.elements.lowerThird.classList.remove('animating-out');
        this.elements.lowerThird.classList.add('visible');
        this.state.l3Visible = true;
    }
    
    hideLowerThird() {
        this.elements.lowerThird.classList.add('animating-out');
        this.state.l3Visible = false;
        
        setTimeout(() => {
            this.elements.lowerThird.classList.remove('visible', 'animating-out');
        }, 500);
    }
    
    updateLowerThird(config) {
        const { 
            primaryText, 
            secondaryText, 
            primaryBg, 
            primaryColor, 
            secondaryBg, 
            secondaryColor,
            x = 80,
            y = 850,
            showPrimary = true,
            showSecondary = true,
            fontSize1 = 42,
            fontSize2 = 36,
            borderRadius = 25,
            padding = '20px 40px',
            boxSpacing = 10,
            fontFamily
        } = config;
        
        // Update primary box
        if (primaryText) {
            this.elements.l3Primary.textContent = primaryText;
        }
        if (primaryBg) {
            this.elements.l3Primary.style.backgroundColor = primaryBg;
        }
        if (primaryColor) {
            this.elements.l3Primary.style.color = primaryColor;
        }
        if (fontSize1) {
            this.elements.l3Primary.style.fontSize = fontSize1 + 'px';
        }
        
        // Update secondary box
        if (secondaryText) {
            this.elements.l3Secondary.textContent = secondaryText;
        }
        if (secondaryBg) {
            this.elements.l3Secondary.style.backgroundColor = secondaryBg;
        }
        if (secondaryColor) {
            this.elements.l3Secondary.style.color = secondaryColor;
        }
        if (fontSize2) {
            this.elements.l3Secondary.style.fontSize = fontSize2 + 'px';
        }
        
        // Update positioning
        this.elements.lowerThird.style.left = x + 'px';
        this.elements.lowerThird.style.top = y + 'px';
        
        // Update styling
        if (borderRadius) {
            this.elements.l3Primary.style.borderRadius = borderRadius + 'px';
            this.elements.l3Secondary.style.borderRadius = borderRadius + 'px';
        }
        if (padding) {
            this.elements.l3Primary.style.padding = padding;
            this.elements.l3Secondary.style.padding = padding;
        }
        if (boxSpacing) {
            this.elements.lowerThird.style.gap = boxSpacing + 'px';
        }
        if (fontFamily) {
            this.elements.l3Primary.style.fontFamily = fontFamily;
            this.elements.l3Secondary.style.fontFamily = fontFamily;
        }
        
        // Toggle box visibility
        this.elements.l3Primary.classList.toggle('hidden', !showPrimary);
        this.elements.l3Secondary.classList.toggle('hidden', !showSecondary);
    }
    
    // Ticker Methods
    showTicker(config) {
        this.state.tickerConfig = config;
        this.updateTicker(config);
        
        this.elements.ticker.classList.add('visible');
        this.state.tickerVisible = true;
    }
    
    hideTicker() {
        this.elements.ticker.classList.remove('visible');
        this.state.tickerVisible = false;
    }
    
    updateTicker(config) {
        const { 
            items = [], 
            speed = 20, 
            position = 'bottom',
            bg = 'rgba(0, 0, 0, 0.85)',
            color = '#ffffff',
            fontSize = 28,
            height = 50
        } = config;
        
        // Clear existing content
        this.elements.tickerContent.innerHTML = '';
        
        // Create ticker items (duplicate for seamless loop)
        const itemsHTML = items.map(item => 
            `<span class="ticker-item">${item}</span>`
        ).join('');
        
        // Double the content for seamless scrolling
        this.elements.tickerContent.innerHTML = itemsHTML + itemsHTML;
        
        // Update styling
        this.elements.ticker.style.backgroundColor = bg;
        this.elements.tickerContent.style.color = color;
        this.elements.tickerContent.style.fontSize = fontSize + 'px';
        this.elements.ticker.style.height = height + 'px';
        this.elements.tickerContent.style.lineHeight = height + 'px';
        
        // Position ticker
        if (position === 'bottom') {
            this.elements.ticker.style.bottom = '0';
            this.elements.ticker.style.top = 'auto';
        } else if (position === 'top') {
            this.elements.ticker.style.top = '0';
            this.elements.ticker.style.bottom = 'auto';
        } else {
            // Custom position (expects number)
            this.elements.ticker.style.top = position + 'px';
            this.elements.ticker.style.bottom = 'auto';
        }
        
        // Set animation speed
        const duration = speed + 's';
        this.elements.tickerContent.style.animationDuration = duration;
    }
    
    // Custom Font Management
    setCustomFont(fontData) {
        if (!fontData) return;
        
        const { name, url } = fontData;
        const styleElement = document.getElementById('custom-font-style');
        
        styleElement.textContent = `
            @font-face {
                font-family: '${name}';
                src: url('${url}');
            }
        `;
        
        this.state.customFont = name;
    }
    
    // Style Updates
    updateStyles(styles) {
        if (!styles) return;
        
        const root = document.documentElement;
        
        for (const [key, value] of Object.entries(styles)) {
            root.style.setProperty(`--${key}`, value);
        }
    }
    
    // Config File Monitoring
    startConfigMonitoring() {
        setInterval(() => {
            this.checkConfigFile();
        }, 5000);
    }
    
    async checkConfigFile() {
        try {
            const response = await fetch('config.json?t=' + Date.now());
            if (response.ok) {
                const config = await response.json();
                this.applyConfig(config);
            }
        } catch (error) {
            // Config file might not exist or be inaccessible, that's okay
            console.debug('Config file not available');
        }
    }
    
    applyConfig(config) {
        if (config.lowerThird) {
            if (config.lowerThird.show) {
                this.showLowerThird(config.lowerThird);
            } else {
                this.hideLowerThird();
            }
        }
        
        if (config.ticker) {
            if (config.ticker.show) {
                this.showTicker(config.ticker);
            } else {
                this.hideTicker();
            }
        }
        
        if (config.customFont) {
            this.setCustomFont(config.customFont);
        }
    }
}

// Initialize graphics engine when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.graphicsEngine = new GraphicsEngine();
    });
} else {
    window.graphicsEngine = new GraphicsEngine();
}

