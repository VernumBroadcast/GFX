// VMix HTML5 Graphics System - Graphics Engine

// Handles rendering, animations, and communication for output page

class GraphicsEngine {
    constructor() {
        // Enable debug mode by adding ?debug=true to the URL
        this.debugMode = new URLSearchParams(window.location.search).has('debug');
        
        this.elements = {
            lowerThird: document.getElementById('lowerThird'),
            l3Primary: document.getElementById('l3Primary'),
            l3Secondary: document.getElementById('l3Secondary'),
            l3Logo: document.getElementById('l3Logo'),
            l3LogoContainer: document.getElementById('l3LogoContainer'),
            lowerThirdLeft: document.getElementById('lowerThirdLeft'),
            l3LeftPrimary: document.getElementById('l3LeftPrimary'),
            l3LeftSecondary: document.getElementById('l3LeftSecondary'),
            l3LogoLeft: document.getElementById('l3LogoLeft'),
            l3LogoLeftContainer: document.getElementById('l3LogoLeftContainer'),
            lowerThirdRight: document.getElementById('lowerThirdRight'),
            l3RightPrimary: document.getElementById('l3RightPrimary'),
            l3RightSecondary: document.getElementById('l3RightSecondary'),
            l3LogoRight: document.getElementById('l3LogoRight'),
            l3LogoRightContainer: document.getElementById('l3LogoRightContainer'),
            lowerThirdCenter: document.getElementById('lowerThirdCenter'),
            l3CenterPrimary: document.getElementById('l3CenterPrimary'),
            l3CenterSecondary: document.getElementById('l3CenterSecondary'),
            bugTopLeft: document.getElementById('bugTopLeft'),
            bugTopRight: document.getElementById('bugTopRight'),
            bugBottomLeft: document.getElementById('bugBottomLeft'),
            timerBottomRight: document.getElementById('timerBottomRight'),
            timerLabel: document.getElementById('timerLabel'),
            timerDisplay: document.getElementById('timerDisplay'),
            ticker: document.getElementById('ticker'),
            tickerContent: document.getElementById('tickerContent'),
            customGraphics: document.getElementById('customGraphics'),
            statusIndicator: document.getElementById('statusIndicator')
        };
        
        this.state = {
            l3Visible: false,
            l3DualVisible: false,
            l3TripleVisible: false,
            tickerVisible: false,
            // Track bugs by position and mode (text or timer)
            bugs: {
                'top-left': { visible: false, mode: 'text', config: {} },
                'top-right': { visible: false, mode: 'text', config: {} },
                'bottom-left': { visible: false, mode: 'text', config: {} },
                'bottom-right': { visible: false, mode: 'text', config: {} }
            },
            l3Config: {},
            tickerConfig: {},
            tickerTimeout: null,
            pendingTickerUpdate: null,  // Store pending ticker update for smooth transitions
            tickerUpdateListener: null,  // Event listener for animation iteration
            customFont: null,
            timerConfig: {},
            timerInterval: null,
            timerPaused: false,
            timerElapsed: 0,
            timerStartTime: null,
            activeTimerPosition: null  // Which position has the active timer
        };
        
        this.init();
    }
    
    updateStatusIndicator() {
        // Hide status indicator if any graphics are visible
        const anyBugVisible = Object.values(this.state.bugs).some(bug => bug.visible);
        if (this.state.l3Visible || this.state.l3DualVisible || this.state.l3TripleVisible || this.state.tickerVisible || anyBugVisible) {
            this.elements.statusIndicator.classList.add('hidden');
        } else {
            this.elements.statusIndicator.classList.remove('hidden');
        }
    }
    
    init() {
        // Setup visual debug log (only show if debug mode enabled)
        this.debugLog = document.getElementById('debugLog');
        if (this.debugMode) {
            document.getElementById('debugIndicator').style.display = 'block';
            this.debugLog.style.display = 'block';
            this.addDebugLog('Graphics Engine Starting...');
        }
        
        // Listen for postMessage commands from control panel (when in iframe)
        window.addEventListener('message', (event) => {
            if (this.debugMode) {
                console.log('===== MESSAGE RECEIVED (postMessage) =====');
                console.log('Event origin:', event.origin);
                console.log('Event data:', event.data);
                console.log('===========================');
                this.addDebugLog('MSG: ' + event.data.action);
            }
            this.handleMessage(event.data);
        });
        
        // Listen for localStorage commands (when opened standalone for VMix)
        this.lastCommandTimestamp = 0;
        window.addEventListener('storage', (event) => {
            if (event.key === 'vmix_graphics_command' && event.newValue) {
                try {
                    const data = JSON.parse(event.newValue);
                    // Only process if this is a new command (prevent duplicates)
                    if (data.timestamp > this.lastCommandTimestamp) {
                        this.lastCommandTimestamp = data.timestamp;
                        if (this.debugMode) {
                            console.log('===== COMMAND RECEIVED (localStorage) =====');
                            console.log('Command:', data.message);
                            console.log('===========================');
                            this.addDebugLog('localStorage: ' + data.message.action);
                        }
                        this.handleMessage(data.message);
                    }
                } catch (error) {
                    console.error('Error parsing localStorage command:', error);
                }
            }
        });
        
        // Also check localStorage on load (in case command was sent before this page loaded)
        this.checkInitialCommand();
        
        // Parse URL parameters on load
        this.parseURLParams();
        
        // Listen for Firebase commands (GitHub Pages + VMix real-time control)
        if (window.ENABLE_FIREBASE && window.FIREBASE_CONFIG && window.firebaseBridge) {
            const firebaseInitialized = window.firebaseBridge.init(window.FIREBASE_CONFIG);
            if (firebaseInitialized) {
                window.firebaseBridge.listen((message) => {
                    if (this.debugMode) {
                        console.log('📥 Firebase command received:', message);
                        this.addDebugLog('🔥 Firebase: ' + message.action);
                    }
                    this.handleMessage(message);
                });
                console.log('🔥 Firebase bridge active - real-time control enabled!');
                if (this.debugMode) {
                    this.addDebugLog('🔥 Firebase listener active');
                }
            }
        } else {
            console.log('ℹ️  Firebase not configured - using postMessage/localStorage only');
        }
        
        // Config monitoring disabled to avoid CORS errors with file:// protocol
        // Use postMessage from control panel instead
        // this.startConfigMonitoring();
        
        // Add test button handler
        this.setupTestButton();
        
        if (this.debugMode) {
            this.addDebugLog('✓ Initialized');
            this.addDebugLog('Is iframe: ' + (window !== window.parent));
            console.log('VMix Graphics Engine initialized (DEBUG MODE)');
            console.log('Window location:', window.location.href);
            console.log('Is in iframe:', window !== window.parent);
        }
    }
    
    checkInitialCommand() {
        try {
            const stored = localStorage.getItem('vmix_graphics_command');
            if (stored) {
                const data = JSON.parse(stored);
                this.lastCommandTimestamp = data.timestamp;
                // Apply the last command (e.g., if reloading output.html while graphic is live)
                // This ensures graphics persist when refreshing the VMix input
                console.log('Applying stored command on load:', data.message);
                this.handleMessage(data.message);
            }
        } catch (error) {
            console.error('Error checking initial command:', error);
        }
    }
    
    addDebugLog(message) {
        if (this.debugMode && this.debugLog) {
            const timestamp = new Date().toLocaleTimeString();
            this.debugLog.innerHTML += `<div>[${timestamp}] ${message}</div>`;
            this.debugLog.scrollTop = this.debugLog.scrollHeight;
        }
    }
    
    setupTestButton() {
        const testButton = document.getElementById('testButton');
        if (testButton) {
            testButton.addEventListener('click', () => {
                console.log('Test button clicked - showing sample L3');
                this.showLowerThird({
                    primaryText: 'TEST GRAPHIC',
                    secondaryText: 'System is Working!',
                    primaryBg: '#ffffff',
                    primaryColor: '#000000',
                    secondaryBg: '#dc3545',
                    secondaryColor: '#ffffff',
                    x: 80,
                    y: 850,
                    fontSize1: 42,
                    fontSize2: 36,
                    borderRadius: 25,
                    boxSpacing: 10,
                    showPrimary: true,
                    showSecondary: true
                });
            });
        }
    }
    
    handleMessage(data) {
        if (!data || !data.action) {
            this.addDebugLog('ERROR: Invalid message data');
            return;
        }
        
        console.log('Received message:', data.action);
        
        try {
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
                case 'showL3Dual':
                    this.showDualLowerThirds(data.configLeft, data.configRight);
                    break;
                case 'hideL3Dual':
                    this.hideDualLowerThirds();
                    break;
                case 'showL3Triple':
                    this.showTripleL3s(data.configLeft, data.configCenter, data.configRight);
                    break;
                case 'hideL3Triple':
                    this.hideTripleL3s();
                    break;
                case 'showBug':
                    this.showBug(data.position, data.config);
                    break;
                case 'hideBug':
                    this.hideBug(data.position);
                    break;
                // Legacy bug commands for backwards compatibility
                case 'showBugLeft':
                    this.showBug('top-left', data.config);
                    break;
                case 'showBugRight':
                    this.showBug('top-right', data.config);
                    break;
                case 'hideBugLeft':
                    this.hideBug('top-left');
                    break;
                case 'hideBugRight':
                    this.hideBug('top-right');
                    break;
                case 'startTimer':
                    this.startTimer(data.config);
                    break;
                case 'pauseTimer':
                    this.pauseTimer();
                    break;
                case 'resetTimer':
                    this.resetTimer();
                    break;
                case 'hideTimer':
                    this.hideTimer();
                    break;
                case 'updateBugFont':
                    this.updateBugFont(data.fontFamily);
                    break;
                case 'updateTimerFont':
                    this.updateTimerFont(data.fontFamily);
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
                    this.addDebugLog('WARN: Unknown action - ' + data.action);
                    console.warn('Unknown action:', data.action);
            }
        } catch (error) {
            this.addDebugLog('ERROR: ' + error.message);
            console.error('Error handling message:', error);
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
        if (this.debugMode) {
            console.log('showLowerThird called with config:', config);
            this.addDebugLog('showL3: ' + (config ? config.primaryText : 'NO CONFIG'));
        }
        
        this.state.l3Config = config;
        this.updateLowerThird(config);
        
        this.elements.lowerThird.classList.remove('animating-out');
        this.elements.lowerThird.classList.add('visible');
        this.state.l3Visible = true;
        this.updateStatusIndicator();
        
        if (this.debugMode) {
            this.addDebugLog('✓ L3 shown');
        }
    }
    
    hideLowerThird() {
        this.elements.lowerThird.classList.add('animating-out');
        this.state.l3Visible = false;
        this.updateStatusIndicator();
        
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
            fontFamily,
            logoUrl,
            logoSize = 120,
            showLogo = false
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
        // Use bottom positioning (CSS default is 150px from bottom)
        this.elements.lowerThird.style.bottom = '150px';
        this.elements.lowerThird.style.top = 'auto'; // Override any top positioning
        
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
            const contentWrapper = this.elements.lowerThird.querySelector('.l3-content-wrapper');
            if (contentWrapper) {
                contentWrapper.style.gap = boxSpacing + 'px';
            }
        }
        if (fontFamily) {
            this.elements.l3Primary.style.fontFamily = fontFamily;
            this.elements.l3Secondary.style.fontFamily = fontFamily;
        }
        
        // Toggle box visibility first
        this.elements.l3Primary.classList.toggle('hidden', !showPrimary);
        this.elements.l3Secondary.classList.toggle('hidden', !showSecondary);
        
        // Update logo
        console.log('Logo config:', { showLogo, logoUrl, logoSize, logoBg: config.logoBg });
        if (showLogo && logoUrl) {
            this.elements.l3Logo.src = logoUrl;
            
            // Apply logo background color
            if (config.logoBg) {
                this.elements.l3LogoContainer.style.background = config.logoBg;
            }
            
            // Calculate total height of visible L3 boxes
            setTimeout(() => {
                let totalHeight = 0;
                if (showPrimary) {
                    totalHeight += this.elements.l3Primary.offsetHeight;
                }
                if (showSecondary) {
                    totalHeight += this.elements.l3Secondary.offsetHeight;
                }
                if (showPrimary && showSecondary) {
                    totalHeight += 10; // gap between boxes
                }
                
                console.log('Calculated L3 height:', totalHeight);
                
                // Set container height to match L3 boxes
                this.elements.l3LogoContainer.style.height = totalHeight + 'px';
                
                // Set logo image height to fill container (minus padding)
                const logoHeight = totalHeight - 14; // Subtract padding (7px top + 7px bottom)
                this.elements.l3Logo.style.height = logoHeight + 'px';
                this.elements.l3Logo.style.width = 'auto';
                this.elements.l3Logo.style.maxHeight = logoHeight + 'px';
                
                this.elements.l3LogoContainer.classList.add('visible');
                console.log(`Logo sized: container ${totalHeight}px, image ${logoHeight}px`);
            }, 50); // Small delay to ensure boxes are rendered
            
            console.log('Logo should be visible now');
        } else {
            this.elements.l3LogoContainer.classList.remove('visible');
            console.log('Logo hidden');
        }
    }
    
    // Ticker Methods
    showTicker(config) {
        this.state.tickerConfig = config;
        this.updateTicker(config);
        
        this.elements.ticker.classList.remove('animating-out');
        this.elements.ticker.classList.add('visible');
        this.state.tickerVisible = true;
        this.updateStatusIndicator();
        
        // If mode is "once", hide ticker after animation completes
        if (config.mode === 'once') {
            const speed = config.speed || 20;
            const duration = speed * 1000; // Convert to milliseconds
            
            // Clear any existing timeout
            if (this.state.tickerTimeout) {
                clearTimeout(this.state.tickerTimeout);
            }
            
            // Hide ticker after one complete scroll
            this.state.tickerTimeout = setTimeout(() => {
                this.hideTicker();
                this.state.tickerTimeout = null;
            }, duration);
        }
    }
    
    hideTicker() {
        // Clear any "play once" timeout
        if (this.state.tickerTimeout) {
            clearTimeout(this.state.tickerTimeout);
            this.state.tickerTimeout = null;
        }
        
        // Clear any pending update and remove listener
        if (this.state.tickerUpdateListener) {
            this.elements.tickerContent.removeEventListener('animationiteration', this.state.tickerUpdateListener);
            this.state.tickerUpdateListener = null;
        }
        this.state.pendingTickerUpdate = null;
        
        this.elements.ticker.classList.add('animating-out');
        this.state.tickerVisible = false;
        this.updateStatusIndicator();
        
        // Remove visible class after animation completes
        setTimeout(() => {
            this.elements.ticker.classList.remove('visible', 'animating-out');
        }, 600); // Match the animation duration in CSS
    }
    
    updateTicker(config) {
        // If ticker is currently visible and animating, wait for current cycle to finish
        if (this.state.tickerVisible && this.elements.ticker.classList.contains('visible')) {
            // Store the new config for later
            this.state.pendingTickerUpdate = config;
            
            // If not already listening, set up a listener for animation iteration
            if (!this.state.tickerUpdateListener) {
                this.state.tickerUpdateListener = () => {
                    // Apply the pending update after current cycle completes
                    if (this.state.pendingTickerUpdate) {
                        this.applyTickerUpdate(this.state.pendingTickerUpdate);
                        this.state.pendingTickerUpdate = null;
                        
                        // Remove the listener after one iteration
                        this.elements.tickerContent.removeEventListener('animationiteration', this.state.tickerUpdateListener);
                        this.state.tickerUpdateListener = null;
                    }
                };
                
                this.elements.tickerContent.addEventListener('animationiteration', this.state.tickerUpdateListener);
            }
            
            // Don't apply update yet - wait for animation cycle to complete
            return;
        }
        
        // Ticker is not visible or just starting - apply update immediately
        this.applyTickerUpdate(config);
    }
    
    applyTickerUpdate(config) {
        const { 
            items = [], 
            speed = 20, 
            position = 'bottom',
            bg = 'rgba(0, 0, 0, 0.85)',
            color = '#ffffff',
            fontSize = 28,
            height = 50,
            fontFamily
        } = config;
        
        // Clear existing content
        this.elements.tickerContent.innerHTML = '';
        
        // Create ticker items
        const itemsHTML = items.map(item => 
            `<span class="ticker-item">${item}</span>`
        ).join('');
        
        // Double the content for seamless scrolling ONLY in loop mode
        // In "once" mode, show content only once
        if (config.mode === 'once') {
            this.elements.tickerContent.innerHTML = itemsHTML;
        } else {
            this.elements.tickerContent.innerHTML = itemsHTML + itemsHTML;
        }
        
        // Update styling
        this.elements.ticker.style.backgroundColor = bg;
        this.elements.tickerContent.style.color = color;
        this.elements.tickerContent.style.fontSize = fontSize + 'px';
        this.elements.ticker.style.height = height + 'px';
        this.elements.tickerContent.style.lineHeight = height + 'px';
        
        // Apply font family if provided
        if (fontFamily) {
            this.elements.tickerContent.style.fontFamily = fontFamily;
        }
        
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
        
        // Set animation speed and iteration count based on mode
        const duration = speed + 's';
        this.elements.tickerContent.style.animationDuration = duration;
        
        // Set iteration count: 1 for "once" mode, infinite for "loop" mode
        if (config.mode === 'once') {
            this.elements.tickerContent.style.animationIterationCount = '1';
        } else {
            this.elements.tickerContent.style.animationIterationCount = 'infinite';
        }
    }
    
    // Dual Lower Thirds Methods
    showDualLowerThirds(configLeft, configRight) {
        // Update left side
        if (configLeft) {
            this.elements.l3LeftPrimary.textContent = configLeft.primaryText || '';
            this.elements.l3LeftSecondary.textContent = configLeft.secondaryText || '';
            this.applyL3Styling(this.elements.l3LeftPrimary, this.elements.l3LeftSecondary, configLeft);
            
            // Apply container styling
            if (configLeft.boxSpacing) {
                this.elements.lowerThirdLeft.style.gap = configLeft.boxSpacing + 'px';
            }
            
            // Toggle box visibility
            this.elements.l3LeftPrimary.classList.toggle('hidden', !configLeft.showPrimary);
            this.elements.l3LeftSecondary.classList.toggle('hidden', !configLeft.showSecondary);
            
            // Update logo
            if (configLeft.showLogo && configLeft.logoUrl) {
                this.elements.l3LogoLeft.src = configLeft.logoUrl;
                
                // Apply logo background color
                if (configLeft.logoBg) {
                    this.elements.l3LogoLeftContainer.style.background = configLeft.logoBg;
                }
                
                // Calculate total height
                setTimeout(() => {
                    let totalHeight = 0;
                    if (configLeft.showPrimary) {
                        totalHeight += this.elements.l3LeftPrimary.offsetHeight;
                    }
                    if (configLeft.showSecondary) {
                        totalHeight += this.elements.l3LeftSecondary.offsetHeight;
                    }
                    if (configLeft.showPrimary && configLeft.showSecondary) {
                        totalHeight += 10;
                    }
                    
                    // Set container height to match L3 boxes
                    this.elements.l3LogoLeftContainer.style.height = totalHeight + 'px';
                    
                    // Set logo image height to fill container (minus padding)
                    const logoHeight = totalHeight - 14; // Subtract padding (7px top + 7px bottom)
                    this.elements.l3LogoLeft.style.height = logoHeight + 'px';
                    this.elements.l3LogoLeft.style.width = 'auto';
                    this.elements.l3LogoLeft.style.maxHeight = logoHeight + 'px';
                    
                    this.elements.l3LogoLeftContainer.classList.add('visible');
                }, 50);
            } else {
                this.elements.l3LogoLeftContainer.classList.remove('visible');
            }
        }
        
        // Update right side
        if (configRight) {
            this.elements.l3RightPrimary.textContent = configRight.primaryText || '';
            this.elements.l3RightSecondary.textContent = configRight.secondaryText || '';
            this.applyL3Styling(this.elements.l3RightPrimary, this.elements.l3RightSecondary, configRight);
            
            // Apply container styling
            if (configRight.boxSpacing) {
                this.elements.lowerThirdRight.style.gap = configRight.boxSpacing + 'px';
            }
            
            // Toggle box visibility
            this.elements.l3RightPrimary.classList.toggle('hidden', !configRight.showPrimary);
            this.elements.l3RightSecondary.classList.toggle('hidden', !configRight.showSecondary);
            
            // Update logo
            if (configRight.showLogo && configRight.logoUrl) {
                this.elements.l3LogoRight.src = configRight.logoUrl;
                
                // Apply logo background color
                if (configRight.logoBg) {
                    this.elements.l3LogoRightContainer.style.background = configRight.logoBg;
                }
                
                // Calculate total height
                setTimeout(() => {
                    let totalHeight = 0;
                    if (configRight.showPrimary) {
                        totalHeight += this.elements.l3RightPrimary.offsetHeight;
                    }
                    if (configRight.showSecondary) {
                        totalHeight += this.elements.l3RightSecondary.offsetHeight;
                    }
                    if (configRight.showPrimary && configRight.showSecondary) {
                        totalHeight += 10;
                    }
                    
                    // Set container height to match L3 boxes
                    this.elements.l3LogoRightContainer.style.height = totalHeight + 'px';
                    
                    // Set logo image height to fill container (minus padding)
                    const logoHeight = totalHeight - 14; // Subtract padding (7px top + 7px bottom)
                    this.elements.l3LogoRight.style.height = logoHeight + 'px';
                    this.elements.l3LogoRight.style.width = 'auto';
                    this.elements.l3LogoRight.style.maxHeight = logoHeight + 'px';
                    
                    this.elements.l3LogoRightContainer.classList.add('visible');
                }, 50);
            } else {
                this.elements.l3LogoRightContainer.classList.remove('visible');
            }
        }
        
        // Show both
        this.elements.lowerThirdLeft.classList.remove('animating-out');
        this.elements.lowerThirdRight.classList.remove('animating-out');
        this.elements.lowerThirdLeft.classList.add('visible');
        this.elements.lowerThirdRight.classList.add('visible');
        this.state.l3DualVisible = true;
        this.updateStatusIndicator();
    }
    
    hideDualLowerThirds() {
        this.elements.lowerThirdLeft.classList.add('animating-out');
        this.elements.lowerThirdRight.classList.add('animating-out');
        this.state.l3DualVisible = false;
        this.updateStatusIndicator();
        
        setTimeout(() => {
            this.elements.lowerThirdLeft.classList.remove('visible', 'animating-out');
            this.elements.lowerThirdRight.classList.remove('visible', 'animating-out');
        }, 500);
    }
    
    // Triple Lower Thirds Methods
    showTripleL3s(configLeft, configCenter, configRight) {
        // Update left side
        if (configLeft) {
            this.elements.l3LeftPrimary.textContent = configLeft.primaryText || '';
            this.elements.l3LeftSecondary.textContent = configLeft.secondaryText || '';
            this.applyL3Styling(this.elements.l3LeftPrimary, this.elements.l3LeftSecondary, configLeft);
            
            // Handle left logo
            const showLogoLeft = configLeft.showLogo && configLeft.logoUrl;
            if (showLogoLeft) {
                this.elements.l3LogoLeft.src = configLeft.logoUrl;
                if (configLeft.logoBg) {
                    this.elements.l3LogoLeftContainer.style.background = configLeft.logoBg;
                }
                
                // Calculate total height to match L3 boxes
                setTimeout(() => {
                    let totalHeight = 0;
                    if (configLeft.showPrimary !== false) {
                        totalHeight += this.elements.l3LeftPrimary.offsetHeight;
                    }
                    if (configLeft.showSecondary !== false) {
                        totalHeight += this.elements.l3LeftSecondary.offsetHeight;
                    }
                    if (configLeft.showPrimary !== false && configLeft.showSecondary !== false) {
                        totalHeight += 10; // gap
                    }
                    
                    // Set container height
                    this.elements.l3LogoLeftContainer.style.height = totalHeight + 'px';
                    
                    // Set logo image height (minus padding)
                    const logoHeight = totalHeight - 14;
                    this.elements.l3LogoLeft.style.height = logoHeight + 'px';
                    this.elements.l3LogoLeft.style.width = 'auto';
                    this.elements.l3LogoLeft.style.maxHeight = logoHeight + 'px';
                }, 50);
                
                this.elements.l3LogoLeftContainer.style.display = 'flex';
            } else {
                this.elements.l3LogoLeftContainer.style.display = 'none';
            }
        }
        
        // Update center (NO LOGO)
        if (configCenter) {
            this.elements.l3CenterPrimary.textContent = configCenter.primaryText || '';
            this.elements.l3CenterSecondary.textContent = configCenter.secondaryText || '';
            this.applyL3Styling(this.elements.l3CenterPrimary, this.elements.l3CenterSecondary, configCenter);
        }
        
        // Update right side
        if (configRight) {
            this.elements.l3RightPrimary.textContent = configRight.primaryText || '';
            this.elements.l3RightSecondary.textContent = configRight.secondaryText || '';
            this.applyL3Styling(this.elements.l3RightPrimary, this.elements.l3RightSecondary, configRight);
            
            // Handle right logo
            const showLogoRight = configRight.showLogo && configRight.logoUrl;
            if (showLogoRight) {
                this.elements.l3LogoRight.src = configRight.logoUrl;
                if (configRight.logoBg) {
                    this.elements.l3LogoRightContainer.style.background = configRight.logoBg;
                }
                
                // Calculate total height to match L3 boxes
                setTimeout(() => {
                    let totalHeight = 0;
                    if (configRight.showPrimary !== false) {
                        totalHeight += this.elements.l3RightPrimary.offsetHeight;
                    }
                    if (configRight.showSecondary !== false) {
                        totalHeight += this.elements.l3RightSecondary.offsetHeight;
                    }
                    if (configRight.showPrimary !== false && configRight.showSecondary !== false) {
                        totalHeight += 10; // gap
                    }
                    
                    // Set container height
                    this.elements.l3LogoRightContainer.style.height = totalHeight + 'px';
                    
                    // Set logo image height (minus padding)
                    const logoHeight = totalHeight - 14;
                    this.elements.l3LogoRight.style.height = logoHeight + 'px';
                    this.elements.l3LogoRight.style.width = 'auto';
                    this.elements.l3LogoRight.style.maxHeight = logoHeight + 'px';
                }, 50);
                
                this.elements.l3LogoRightContainer.style.display = 'flex';
            } else {
                this.elements.l3LogoRightContainer.style.display = 'none';
            }
        }
        
        // Show all three L3s with animation
        this.elements.lowerThirdLeft.classList.remove('animating-out');
        this.elements.lowerThirdLeft.classList.add('visible');
        this.elements.lowerThirdCenter.classList.remove('animating-out');
        this.elements.lowerThirdCenter.classList.add('visible');
        this.elements.lowerThirdRight.classList.remove('animating-out');
        this.elements.lowerThirdRight.classList.add('visible');
        
        this.state.l3TripleVisible = true;
        this.updateStatusIndicator();
    }
    
    hideTripleL3s() {
        this.elements.lowerThirdLeft.classList.add('animating-out');
        this.elements.lowerThirdCenter.classList.add('animating-out');
        this.elements.lowerThirdRight.classList.add('animating-out');
        this.state.l3TripleVisible = false;
        this.updateStatusIndicator();
        
        setTimeout(() => {
            this.elements.lowerThirdLeft.classList.remove('visible', 'animating-out');
            this.elements.lowerThirdCenter.classList.remove('visible', 'animating-out');
            this.elements.lowerThirdRight.classList.remove('visible', 'animating-out');
        }, 500);
    }
    
    applyL3Styling(primaryEl, secondaryEl, config) {
        // Apply colors and fonts
        if (config.primaryBg) primaryEl.style.backgroundColor = config.primaryBg;
        if (config.primaryColor) primaryEl.style.color = config.primaryColor;
        if (config.secondaryBg) secondaryEl.style.backgroundColor = config.secondaryBg;
        if (config.secondaryColor) secondaryEl.style.color = config.secondaryColor;
        if (config.fontSize1) primaryEl.style.fontSize = config.fontSize1 + 'px';
        if (config.fontSize2) secondaryEl.style.fontSize = config.fontSize2 + 'px';
        if (config.borderRadius) {
            primaryEl.style.borderRadius = config.borderRadius + 'px';
            secondaryEl.style.borderRadius = config.borderRadius + 'px';
        }
        if (config.fontFamily) {
            primaryEl.style.fontFamily = config.fontFamily;
            secondaryEl.style.fontFamily = config.fontFamily;
        }
        // Apply padding (uses CSS default if not specified)
        // This ensures dual L3s match single L3 styling
    }
    
    // Bug Methods (flexible - supports text OR timer on any position)
    showBug(position, config) {
        // Get the correct bug element based on position
        const bugElement = this.getBugElement(position);
        if (!bugElement) return;
        
        // Hide timer content if this bug was showing a timer
        const timerLabel = bugElement.querySelector('.timer-label');
        const timerDisplay = bugElement.querySelector('.timer-display');
        if (timerLabel && timerDisplay) {
            timerLabel.style.display = 'none';
            timerDisplay.style.display = 'none';
        }
        
        // Show as text bug
        const { text = '', fontSize = 24, bg = '#dc3545', color = '#ffffff' } = config;
        
        bugElement.textContent = text;
        bugElement.style.fontSize = fontSize + 'px';
        bugElement.style.backgroundColor = bg;
        bugElement.style.color = color;
        
        // Auto-scale based on text length
        const textLength = text.length;
        if (textLength < 10) {
            bugElement.style.padding = '15px 25px';
            bugElement.style.fontSize = '24px';
        } else if (textLength < 20) {
            bugElement.style.padding = '12px 20px';
            bugElement.style.fontSize = '20px';
        } else {
            bugElement.style.padding = '10px 18px';
            bugElement.style.fontSize = '18px';
        }
        
        bugElement.classList.remove('animating-out');
        bugElement.classList.add('visible');
        
        // Update state
        this.state.bugs[position].visible = true;
        this.state.bugs[position].mode = 'text';
        this.state.bugs[position].config = config;
        
        this.updateStatusIndicator();
    }
    
    hideBug(position) {
        const bugElement = this.getBugElement(position);
        if (!bugElement) return;
        
        // Stop timer if this bug has an active timer
        if (this.state.activeTimerPosition === position) {
            this.stopTimerAtPosition(position);
        }
        
        bugElement.classList.add('animating-out');
        
        // Update state
        this.state.bugs[position].visible = false;
        this.updateStatusIndicator();
        
        setTimeout(() => {
            bugElement.classList.remove('visible', 'animating-out');
        }, 400);
    }
    
    // Helper to get bug element by position
    getBugElement(position) {
        switch (position) {
            case 'top-left':
                return this.elements.bugTopLeft;
            case 'top-right':
                return this.elements.bugTopRight;
            case 'bottom-left':
                return this.elements.bugBottomLeft;
            case 'bottom-right':
                return this.elements.timerBottomRight;
            default:
                console.error('Unknown bug position:', position);
                return null;
        }
    }
    
    // Timer Methods (flexible positioning)
    startTimer(config) {
        const position = config.position || 'bottom-right';
        const bugElement = this.getBugElement(position);
        if (!bugElement) return;
        
        // Stop any existing timer first
        if (this.state.activeTimerPosition) {
            this.stopTimerAtPosition(this.state.activeTimerPosition);
        }
        
        // Save timer config and position
        this.state.timerConfig = config;
        this.state.timerPaused = false;
        this.state.activeTimerPosition = position;
        
        // Clear bug text content and set up timer structure
        bugElement.innerHTML = '';
        
        // Create timer elements if they don't exist
        let timerLabel = document.createElement('div');
        timerLabel.className = 'timer-label';
        timerLabel.textContent = config.label || '';
        timerLabel.style.display = config.label ? 'block' : 'none';
        
        let timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        
        bugElement.appendChild(timerLabel);
        bugElement.appendChild(timerDisplay);
        
        // Apply styling
        bugElement.style.backgroundColor = config.bg || '#dc3545';
        bugElement.style.color = config.color || '#ffffff';
        
        // Clear any existing interval
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        
        // Determine update interval based on format (faster for milliseconds)
        const format = config.format || 'hms';
        const needsMs = format.includes('ms') && format !== 'hms' && format !== 'ms';
        const updateInterval = needsMs ? 10 : (config.type === 'clock' ? 1000 : 100);
        
        // Initialize timer based on type
        if (config.type === 'clock') {
            this.updateTimerDisplay();
            this.state.timerInterval = setInterval(() => this.updateTimerDisplay(), updateInterval);
        } else if (config.type === 'countdownTo') {
            this.state.timerStartTime = Date.now();
            this.updateTimerDisplay();
            this.state.timerInterval = setInterval(() => this.updateTimerDisplay(), updateInterval);
        } else if (config.type === 'stopwatch') {
            this.state.timerElapsed = 0;
            this.state.timerStartTime = Date.now();
            this.updateTimerDisplay();
            this.state.timerInterval = setInterval(() => this.updateTimerDisplay(), updateInterval);
        } else if (config.type === 'countdownFrom') {
            this.state.timerElapsed = 0;
            this.state.timerStartTime = Date.now();
            this.updateTimerDisplay();
            this.state.timerInterval = setInterval(() => this.updateTimerDisplay(), updateInterval);
        }
        
        // Show timer
        bugElement.classList.remove('animating-out');
        bugElement.classList.add('visible');
        
        // Update state
        this.state.bugs[position].visible = true;
        this.state.bugs[position].mode = 'timer';
        this.state.bugs[position].config = config;
        
        this.updateStatusIndicator();
    }
    
    pauseTimer() {
        this.state.timerPaused = !this.state.timerPaused;
        
        if (this.state.timerPaused) {
            if (this.state.timerInterval) {
                clearInterval(this.state.timerInterval);
                this.state.timerInterval = null;
            }
        } else {
            // Resume timer
            const config = this.state.timerConfig;
            if (config.type === 'stopwatch' || config.type === 'countdownFrom') {
                this.state.timerStartTime = Date.now() - (this.state.timerElapsed * 1000);
            }
            this.startTimer(config);
        }
    }
    
    resetTimer() {
        this.state.timerElapsed = 0;
        this.state.timerStartTime = Date.now();
        this.updateTimerDisplay();
    }
    
    hideTimer() {
        if (this.state.activeTimerPosition) {
            this.stopTimerAtPosition(this.state.activeTimerPosition);
            this.hideBug(this.state.activeTimerPosition);
            this.state.activeTimerPosition = null;
        }
    }
    
    stopTimerAtPosition(position) {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
        this.state.bugs[position].mode = 'text';
    }
    
    updateTimerDisplay() {
        if (this.state.timerPaused) return;
        
        const config = this.state.timerConfig;
        const format = config.format || 'hms';
        let timeInMs = 0;
        let shouldStop = false;
        
        // Calculate time in milliseconds based on timer type
        if (config.type === 'clock') {
            const now = new Date();
            timeInMs = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
        } else if (config.type === 'countdownTo' && config.targetTime) {
            const now = Date.now();
            const remaining = Math.max(0, config.targetTime - now);
            timeInMs = remaining;
            if (remaining === 0) shouldStop = true;
        } else if (config.type === 'stopwatch') {
            const elapsed = Date.now() - this.state.timerStartTime;
            this.state.timerElapsed = elapsed / 1000;
            timeInMs = elapsed;
        } else if (config.type === 'countdownFrom' && config.duration) {
            const elapsed = Date.now() - this.state.timerStartTime;
            this.state.timerElapsed = elapsed / 1000;
            const remaining = Math.max(0, (config.duration * 1000) - elapsed);
            timeInMs = remaining;
            if (remaining === 0) shouldStop = true;
        }
        
        // Format the display based on selected format
        const displayText = this.formatTime(timeInMs, format);
        
        // Update timer display in the active position
        if (this.state.activeTimerPosition) {
            const bugElement = this.getBugElement(this.state.activeTimerPosition);
            if (bugElement) {
                const timerDisplay = bugElement.querySelector('.timer-display');
                if (timerDisplay) {
                    timerDisplay.textContent = displayText;
                }
            }
        }
        
        // Stop timer if countdown reached zero
        if (shouldStop && this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
    }
    
    formatTime(milliseconds, format) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const ms = Math.floor(milliseconds % 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        switch(format) {
            case 'hm':
                // HH:MM (hours and minutes only)
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            
            case 'hms':
                // HH:MM:SS
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            case 'ms':
                // MM:SS
                const totalMinutes = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                return `${String(totalMinutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            case 'hmsms':
                // HH:MM:SS.000
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
            
            case 'msms':
                // MM:SS.000
                const totalMins = Math.floor(totalSeconds / 60);
                const secsForMs = totalSeconds % 60;
                return `${String(totalMins).padStart(2, '0')}:${String(secsForMs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
            
            case 'sms':
                // SS.000
                return `${String(totalSeconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
            
            default:
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    
    // Update bug font
    updateBugFont(fontFamily) {
        if (!fontFamily) return;
        
        // Update all four bug positions
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(position => {
            const bugElement = this.getBugElement(position);
            if (bugElement) {
                bugElement.style.fontFamily = fontFamily;
                // Also update timer elements if present
                const timerLabel = bugElement.querySelector('.timer-label');
                const timerDisplay = bugElement.querySelector('.timer-display');
                if (timerLabel) timerLabel.style.fontFamily = fontFamily;
                if (timerDisplay) timerDisplay.style.fontFamily = fontFamily;
            }
        });
    }
    
    // Update timer font (alias for updateBugFont for backwards compatibility)
    updateTimerFont(fontFamily) {
        this.updateBugFont(fontFamily);
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

