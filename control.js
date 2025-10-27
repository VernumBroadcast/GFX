// VMix HTML5 Graphics System - Control Panel Logic
// Handles UI, communication, and data source integrations

class ControlPanel {
    constructor() {
        this.previewFrame = document.getElementById('previewFrame');
        this.transmitFrame = document.getElementById('transmitFrame');
        this.customFontUrl = null;
        this.autoUpdateTimer = null;  // Timer for Google Sheets auto-update
        
        // Global logo settings
        this.globalLogo = {
            url: 'ravelogo.png',
            size: 120,
            bg: '#ffffff',
            enabled: true
        };
        
        // L3 Slot Management
        this.currentL3Slot = 1;
        this.l3Slots = {
            1: this.getDefaultL3Config(),
            2: this.getDefaultL3Config(),
            3: this.getDefaultL3Config(),
            4: this.getDefaultL3Config(),
            5: this.getDefaultL3Config()
        };
        
        // Track what's on preview vs transmit
        this.previewState = {
            l3: null,
            ticker: false
        };
        
        this.init();
    }
    
    getDefaultL3Config() {
        return {
            primaryText: 'Your Name Here',
            secondaryText: 'Your Title Here',
            primaryBg: '#ffffff',
            primaryColor: '#000000',
            secondaryBg: '#dc3545',  // Red color for all L3s
            secondaryColor: '#ffffff',
            x: 80,
            y: 850,
            fontSize1: 42,
            fontSize2: 36,
            borderRadius: 25,
            boxSpacing: 10,
            showPrimary: true,
            showSecondary: true,
            logoEnabled: 'global',  // 'global', 'yes', or 'no'
            customLogoUrl: '',
            logoSize: 120
        };
    }
    
    init() {
        this.setupTabs();
        this.setupQuickActions();
        this.setupLowerThirdControls();
        this.setupDualL3Controls();
        this.setupBugControls();
        this.setupTimerControls();
        this.setupTickerControls();
        this.setupDataSourceControls();
        this.setupAutoUpdate();  // Google Sheets auto-update
        this.setupGlobalColorControls();
        this.setupLogoControls();
        this.setupTogglePreview();
        this.setupStylingControls();
        this.setupOutputControls();
        this.updateOutputUrl();
        this.loadSavedState();
        this.setupPreviewScaling();
        
        // Debug: Check if iframes are loaded
        this.previewFrame.addEventListener('load', () => {
            console.log('✓ Preview iframe loaded');
            console.log('Preview contentWindow:', this.previewFrame.contentWindow);
        });
        
        this.transmitFrame.addEventListener('load', () => {
            console.log('✓ Transmit iframe loaded');
            console.log('Transmit contentWindow:', this.transmitFrame.contentWindow);
        });
        
        console.log('Vernum Media GFX Package initialized');
        console.log('Preview frame:', this.previewFrame);
        console.log('Transmit frame:', this.transmitFrame);
        
        // Initialize dropdown labels
        this.updateL3DropdownLabels();
        
        // Start header clock
        this.startHeaderClock();
    }
    
    setupTogglePreview() {
        const btn = document.getElementById('btnTogglePreview');
        const container = document.getElementById('previewFrameContainer');
        let hidden = false;
        
        if (btn && container) {
            btn.addEventListener('click', () => {
                hidden = !hidden;
                container.style.display = hidden ? 'none' : 'block';
                btn.textContent = hidden ? 'Show' : 'Hide';
            });
        }
    }
    
    startHeaderClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const timeEl = document.getElementById('headerTime');
            if (timeEl) {
                timeEl.textContent = timeString;
            }
        };
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    // Quick Action Buttons
    setupQuickActions() {
        // L3 Dropdown Selector (Quick Actions Bar)
        const quickL3Selector = document.getElementById('quickL3Selector');
        if (quickL3Selector) {
            quickL3Selector.addEventListener('change', (e) => {
                const slot = parseInt(e.target.value);
                this.switchL3Slot(slot);
                this.updateL3DropdownLabels();
            });
        }
        
        // Keep old button selector for compatibility
        document.querySelectorAll('.l3-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = parseInt(e.target.dataset.slot);
                this.switchL3Slot(slot);
                
                // Update active state
                document.querySelectorAll('.l3-slot-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateL3DropdownLabels();
            });
        });
        
        // L3 Tab Selector (Lower Third Tab)
        document.querySelectorAll('.l3-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = parseInt(e.target.dataset.slot);
                this.switchL3Slot(slot);
                
                // Update active state
                document.querySelectorAll('.l3-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update slot label
                document.getElementById('currentSlotLabel').textContent = `Slot ${slot}`;
            });
        });
        
        // Lower Third Quick Actions
        document.getElementById('quickPreviewL3').addEventListener('click', () => {
            const baseConfig = this.l3Slots[this.currentL3Slot];
            const logoConfig = this.getL3LogoConfig(baseConfig);
            const config = { ...baseConfig, ...logoConfig };
            this.sendToFrame('preview', 'showL3', { config });
            this.previewState.l3 = this.currentL3Slot;
        });
        
        document.getElementById('quickShowL3').addEventListener('click', () => {
            const baseConfig = this.l3Slots[this.currentL3Slot];
            const logoConfig = this.getL3LogoConfig(baseConfig);
            const config = { ...baseConfig, ...logoConfig };
            this.sendToFrame('transmit', 'showL3', { config });
        });
        
        document.getElementById('quickHideL3').addEventListener('click', () => {
            this.sendToFrame('both', 'hideL3', {});
            this.previewState.l3 = null;
        });
        
        // Ticker Quick Actions
        document.getElementById('quickPreviewTicker').addEventListener('click', () => {
            this.sendToFrame('preview', 'showTicker', { config: this.getTickerConfig() });
            this.previewState.ticker = true;
        });
        
        document.getElementById('quickShowTicker').addEventListener('click', () => {
            this.sendToFrame('transmit', 'showTicker', { config: this.getTickerConfig() });
        });
        
        document.getElementById('quickHideTicker').addEventListener('click', () => {
            this.sendToFrame('both', 'hideTicker', {});
            this.previewState.ticker = false;
        });
        
        // Master Control Actions
        document.getElementById('quickHideAll').addEventListener('click', () => {
            this.sendToFrame('both', 'hideL3');
            this.sendToFrame('both', 'hideL3Dual');
            this.sendToFrame('both', 'hideL3Triple');
            this.sendToFrame('both', 'hideTicker');
            this.sendToFrame('both', 'hideBug', { position: 'top-left' });
            this.sendToFrame('both', 'hideBug', { position: 'top-right' });
            this.sendToFrame('both', 'hideBug', { position: 'bottom-left' });
            this.sendToFrame('both', 'hideBug', { position: 'bottom-right' });
            this.sendToFrame('both', 'hideTimer');
            this.previewState.l3 = null;
            this.previewState.ticker = false;
        });
        
        // Dual L3 Quick Actions
        // Sync quick selectors with main dual L3 dropdowns
        const quickDualL3Left = document.getElementById('quickDualL3Left');
        const quickDualL3Right = document.getElementById('quickDualL3Right');
        
        if (quickDualL3Left) {
            quickDualL3Left.addEventListener('change', () => {
                const mainDropdown = document.getElementById('dualL3LeftSlot');
                if (mainDropdown) {
                    mainDropdown.value = quickDualL3Left.value;
                    mainDropdown.dispatchEvent(new Event('change'));
                }
            });
        }
        
        if (quickDualL3Right) {
            quickDualL3Right.addEventListener('change', () => {
                const mainDropdown = document.getElementById('dualL3RightSlot');
                if (mainDropdown) {
                    mainDropdown.value = quickDualL3Right.value;
                    mainDropdown.dispatchEvent(new Event('change'));
                }
            });
        }
        
        document.getElementById('quickPreviewDualL3').addEventListener('click', () => {
            this.showMultiL3('preview');
        });
        
        document.getElementById('quickShowDualL3').addEventListener('click', () => {
            this.showMultiL3('transmit');
        });
        
        document.getElementById('quickHideDualL3').addEventListener('click', () => {
            this.sendToFrame('both', 'hideL3Dual');
            this.sendToFrame('both', 'hideL3Triple');
        });
        
        // Bug Quick Actions - Individual buttons
        const quickShowBugLeft = document.getElementById('quickShowBugLeft');
        if (quickShowBugLeft) {
            quickShowBugLeft.addEventListener('click', () => {
                const leftConfig = this.getBugConfig('left');
                this.sendToFrame('transmit', 'showBug', { position: 'top-left', config: leftConfig });
            });
        }
        
        const quickShowBugRight = document.getElementById('quickShowBugRight');
        if (quickShowBugRight) {
            quickShowBugRight.addEventListener('click', () => {
                const rightConfig = this.getBugConfig('right');
                this.sendToFrame('transmit', 'showBug', { position: 'top-right', config: rightConfig });
            });
        }
        
        const quickHideBugLeft = document.getElementById('quickHideBugLeft');
        if (quickHideBugLeft) {
            quickHideBugLeft.addEventListener('click', () => {
                this.sendToFrame('both', 'hideBug', { position: 'top-left' });
            });
        }
        
        const quickHideBugRight = document.getElementById('quickHideBugRight');
        if (quickHideBugRight) {
            quickHideBugRight.addEventListener('click', () => {
                this.sendToFrame('both', 'hideBug', { position: 'top-right' });
            });
        }
        
        const quickShowBugBottom = document.getElementById('quickShowBugBottom');
        if (quickShowBugBottom) {
            quickShowBugBottom.addEventListener('click', () => {
                const bottomConfig = this.getBugConfig('bottom');
                this.sendToFrame('transmit', 'showBug', { position: 'bottom-right', config: bottomConfig });
            });
        }
        
        const quickHideBugBottom = document.getElementById('quickHideBugBottom');
        if (quickHideBugBottom) {
            quickHideBugBottom.addEventListener('click', () => {
                this.sendToFrame('both', 'hideBug', { position: 'bottom-right' });
            });
        }
        
        const quickShowBugBottomLeft = document.getElementById('quickShowBugBottomLeft');
        if (quickShowBugBottomLeft) {
            quickShowBugBottomLeft.addEventListener('click', () => {
                const bottomLeftConfig = this.getBugConfig('bottomLeft');
                this.sendToFrame('transmit', 'showBug', { position: 'bottom-left', config: bottomLeftConfig });
            });
        }
        
        const quickHideBugBottomLeft = document.getElementById('quickHideBugBottomLeft');
        if (quickHideBugBottomLeft) {
            quickHideBugBottomLeft.addEventListener('click', () => {
                this.sendToFrame('both', 'hideBug', { position: 'bottom-left' });
            });
        }
        
        // Quick Multi L3 Mode selector - sync with main mode selector
        const quickMultiL3Mode = document.getElementById('quickMultiL3Mode');
        const multiL3Mode = document.getElementById('multiL3Mode');
        if (quickMultiL3Mode && multiL3Mode) {
            // Sync quick selector to main selector
            quickMultiL3Mode.addEventListener('change', () => {
                multiL3Mode.value = quickMultiL3Mode.value;
                multiL3Mode.dispatchEvent(new Event('change'));
            });
            // Sync main selector to quick selector
            multiL3Mode.addEventListener('change', () => {
                quickMultiL3Mode.value = multiL3Mode.value;
            });
        }
        
        // Timer Quick Actions
        const quickStartTimer = document.getElementById('quickStartTimer');
        if (quickStartTimer) {
            quickStartTimer.addEventListener('click', () => {
                const config = this.getTimerConfig();
                if (config.type !== 'none') {
                    this.sendToFrame('both', 'startTimer', { config });
                } else {
                    alert('Please select a timer type in the Corner Bugs tab first');
                }
            });
        }
        
        const quickHideTimer = document.getElementById('quickHideTimer');
        if (quickHideTimer) {
            quickHideTimer.addEventListener('click', () => {
                this.sendToFrame('both', 'hideTimer', {});
            });
        }
        
        // Legacy combined bug buttons (if they exist)
        const quickShowBugs = document.getElementById('quickShowBugs');
        if (quickShowBugs) {
            quickShowBugs.addEventListener('click', () => {
                const leftConfig = this.getBugConfig('left');
                const rightConfig = this.getBugConfig('right');
                this.sendToFrame('transmit', 'showBug', { position: 'top-left', config: leftConfig });
                this.sendToFrame('transmit', 'showBug', { position: 'top-right', config: rightConfig });
            });
        }
        
        const quickHideBugs = document.getElementById('quickHideBugs');
        if (quickHideBugs) {
            quickHideBugs.addEventListener('click', () => {
                this.sendToFrame('both', 'hideBug', { position: 'top-left' });
                this.sendToFrame('both', 'hideBug', { position: 'top-right' });
            });
        }
    }
    
    switchL3Slot(slot) {
        // Save current slot data before switching
        this.saveCurrentL3ToSlot();
        
        // Switch to new slot
        this.currentL3Slot = slot;
        
        // Load new slot data into form
        this.loadL3SlotToForm(slot);
        
        // Sync both slot selectors
        document.querySelectorAll('.l3-slot-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.slot) === slot);
        });
        document.querySelectorAll('.l3-tab-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.slot) === slot);
        });
        
        // Update dropdown to match
        const quickL3Selector = document.getElementById('quickL3Selector');
        if (quickL3Selector) {
            quickL3Selector.value = slot;
        }
    }
    
    updateL3DropdownLabels() {
        const quickL3Selector = document.getElementById('quickL3Selector');
        const quickDualL3Left = document.getElementById('quickDualL3Left');
        const quickDualL3Right = document.getElementById('quickDualL3Right');
        
        // Update each option with the current content
        for (let i = 1; i <= 5; i++) {
            const slot = this.l3Slots[i];
            if (!slot) continue;
            
            const primaryText = slot.primaryText || 'Your Name Here';
            const label = `L3-${i}: ${primaryText}`;
            
            // Update quick L3 selector
            if (quickL3Selector) {
                const option = quickL3Selector.querySelector(`option[value="${i}"]`);
                if (option) option.textContent = label;
            }
            
            // Update dual L3 left selector
            if (quickDualL3Left) {
                const option = quickDualL3Left.querySelector(`option[value="${i}"]`);
                if (option) option.textContent = label;
            }
            
            // Update dual L3 right selector
            if (quickDualL3Right) {
                const option = quickDualL3Right.querySelector(`option[value="${i}"]`);
                if (option) option.textContent = label;
            }
        }
    }
    
    saveCurrentL3ToSlot() {
        this.l3Slots[this.currentL3Slot] = this.getLowerThirdConfig();
    }
    
    loadL3SlotToForm(slot) {
        const config = this.l3Slots[slot];
        
        document.getElementById('l3Primary').value = config.primaryText || '';
        document.getElementById('l3Secondary').value = config.secondaryText || '';
        document.getElementById('l3X').value = config.x || 80;
        document.getElementById('l3Y').value = config.y || 850;
        document.getElementById('l3FontSize1').value = config.fontSize1 || 42;
        document.getElementById('l3FontSize2').value = config.fontSize2 || 36;
        document.getElementById('l3BorderRadius').value = config.borderRadius || 25;
        document.getElementById('l3BoxSpacing').value = config.boxSpacing || 10;
        document.getElementById('l3PrimaryBg').value = config.primaryBg || '#ffffff';
        document.getElementById('l3PrimaryColor').value = config.primaryColor || '#000000';
        document.getElementById('l3SecondaryBg').value = config.secondaryBg || '#dc3545';
        document.getElementById('l3SecondaryColor').value = config.secondaryColor || '#ffffff';
        document.getElementById('l3ShowPrimary').checked = config.showPrimary !== false;
        document.getElementById('l3ShowSecondary').checked = config.showSecondary !== false;
        
        // Load logo settings
        document.getElementById('l3LogoEnabled').value = config.logoEnabled || 'global';
        document.getElementById('l3CustomLogoUrl').value = config.customLogoUrl || '';
        
        // Update the content display
        this.updateCurrentSlotContent();
    }
    
    updateCurrentSlotContent() {
        const contentEl = document.getElementById('currentSlotContent');
        if (contentEl) {
            const primary = document.getElementById('l3Primary').value;
            const secondary = document.getElementById('l3Secondary').value;
            
            if (primary || secondary) {
                contentEl.textContent = `"${primary || '(no primary)'}" - "${secondary || '(no secondary)'}"`;
            } else {
                contentEl.textContent = '(Empty - add text above)';
            }
        }
        
        // Also update dropdown labels
        this.updateL3DropdownLabels();
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
        
        // Wait for iframes to load
        this.previewFrame.addEventListener('load', () => {
            console.log('Preview iframe loaded');
            setTimeout(scalePreview, 100);
        });
        
        this.transmitFrame.addEventListener('load', () => {
            console.log('Transmit iframe loaded');
            setTimeout(scalePreview, 100);
        });
        
        // Scale on load
        window.addEventListener('load', () => {
            setTimeout(scalePreview, 100);
        });
        
        // Scale on window resize
        window.addEventListener('resize', scalePreview);
        
        // Initial scale
        setTimeout(scalePreview, 500);
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
                    // Save to current slot
                    this.saveCurrentL3ToSlot();
                    
                    // Update the current slot content display
                    if (id === 'l3Primary' || id === 'l3Secondary') {
                        this.updateCurrentSlotContent();
                        // Also update dual L3 previews if this slot is selected
                        this.updateDualL3PreviewIfSelected(this.currentL3Slot);
                    }
                    
                    // Auto-update preview in real-time if this slot is on preview
                    if (this.previewState.l3 === this.currentL3Slot) {
                        this.sendToFrame('preview', 'updateL3', { config: this.getLowerThirdConfig() });
                    }
                });
            }
        });
    }
    
    updateDualL3PreviewIfSelected(slotNum) {
        // Check if this slot is selected for left or right dual L3
        const leftSlot = document.getElementById('dualL3LeftSlot');
        const rightSlot = document.getElementById('dualL3RightSlot');
        
        if (leftSlot && parseInt(leftSlot.value) === slotNum) {
            this.updateDualL3Preview('left');
        }
        if (rightSlot && parseInt(rightSlot.value) === slotNum) {
            this.updateDualL3Preview('right');
        }
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
            fontSize: parseInt(document.getElementById('tickerFontSize').value) || 28,
            mode: document.getElementById('tickerMode')?.value || 'loop'
        };
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Dual L3 Controls
    setupDualL3Controls() {
        // Mode toggle handler
        document.getElementById('multiL3Mode')?.addEventListener('change', (e) => {
            const isTriple = e.target.value === 'triple';
            const centerGroup = document.getElementById('centerL3Group');
            const titleEl = document.getElementById('multiL3ControlsTitle');
            
            if (centerGroup) {
                centerGroup.style.display = isTriple ? 'block' : 'none';
            }
            if (titleEl) {
                titleEl.textContent = isTriple ? 'Triple L3' : 'Dual L3';
            }
        });
        
        // Update previews when slot selection changes
        document.getElementById('dualL3LeftSlot')?.addEventListener('change', () => {
            this.updateDualL3Preview('left');
        });
        
        document.getElementById('dualL3CenterSlot')?.addEventListener('change', () => {
            this.updateDualL3Preview('center');
        });
        
        document.getElementById('dualL3RightSlot')?.addEventListener('change', () => {
            this.updateDualL3Preview('right');
        });
        
        // Initial preview update
        this.updateDualL3Preview('left');
        this.updateDualL3Preview('center');
        this.updateDualL3Preview('right');
        
        document.getElementById('btnShowDualL3Preview')?.addEventListener('click', () => {
            this.showMultiL3('preview');
        });
        
        document.getElementById('btnShowDualL3Transmit')?.addEventListener('click', () => {
            this.showMultiL3('transmit');
        });
        
        document.getElementById('btnShowDualL3Both')?.addEventListener('click', () => {
            this.showMultiL3('both');
        });
        
        document.getElementById('btnHideDualL3Both')?.addEventListener('click', () => {
            this.sendToFrame('both', 'hideL3Dual', {});
            this.sendToFrame('both', 'hideL3Triple', {});
        });
    }
    
    showMultiL3(target) {
        const mode = document.getElementById('multiL3Mode')?.value || 'dual';
        
        if (mode === 'triple') {
            const configLeft = this.getDualL3Config('left');
            const configCenter = this.getDualL3Config('center');
            const configRight = this.getDualL3Config('right');
            this.sendToFrame(target, 'showL3Triple', { configLeft, configCenter, configRight });
        } else {
            const configLeft = this.getDualL3Config('left');
            const configRight = this.getDualL3Config('right');
            this.sendToFrame(target, 'showL3Dual', { configLeft, configRight });
        }
    }
    
    updateDualL3Preview(side) {
        const sideCapitalized = side === 'left' ? 'Left' : side === 'center' ? 'Center' : 'Right';
        const slotSelector = document.getElementById(`dualL3${sideCapitalized}Slot`);
        const selectedSlot = parseInt(slotSelector?.value || '1');
        const slotConfig = this.l3Slots[selectedSlot];
        
        const primaryEl = document.getElementById(`dualL3${sideCapitalized}PreviewPrimary`);
        const secondaryEl = document.getElementById(`dualL3${sideCapitalized}PreviewSecondary`);
        
        if (primaryEl && secondaryEl && slotConfig) {
            primaryEl.textContent = slotConfig.primaryText || '(No text set)';
            secondaryEl.textContent = slotConfig.secondaryText || '(No text set)';
        }
    }
    
    getDualL3Config(side) {
        const sideCapitalized = side === 'left' ? 'Left' : side === 'center' ? 'Center' : 'Right';
        const slotSelector = document.getElementById(`dualL3${sideCapitalized}Slot`);
        const selectedSlot = parseInt(slotSelector?.value || '1');
        const baseConfig = this.l3Slots[selectedSlot];
        
        // Center L3 doesn't get logo (as per user request)
        if (side === 'center') {
            return { ...baseConfig, showLogo: false };
        }
        
        const logoConfig = this.getL3LogoConfig(baseConfig);
        return { ...baseConfig, ...logoConfig };
    }
    
    // Bug Controls
    setupBugControls() {
        document.getElementById('btnShowBugLeft')?.addEventListener('click', () => {
            this.sendToFrame('both', 'showBug', { position: 'top-left', config: this.getBugConfig('left') });
        });
        
        document.getElementById('btnShowBugRight')?.addEventListener('click', () => {
            this.sendToFrame('both', 'showBug', { position: 'top-right', config: this.getBugConfig('right') });
        });
        
        document.getElementById('btnShowBugBottomLeft')?.addEventListener('click', () => {
            this.sendToFrame('both', 'showBug', { position: 'bottom-left', config: this.getBugConfig('bottomLeft') });
        });
        
        document.getElementById('btnShowBugBottom')?.addEventListener('click', () => {
            this.sendToFrame('both', 'showBug', { position: 'bottom-right', config: this.getBugConfig('bottom') });
        });
        
        document.getElementById('btnHideBugLeft')?.addEventListener('click', () => {
            this.sendToFrame('both', 'hideBug', { position: 'top-left' });
        });
        
        document.getElementById('btnHideBugRight')?.addEventListener('click', () => {
            this.sendToFrame('both', 'hideBug', { position: 'top-right' });
        });
        
        document.getElementById('btnHideBugBottomLeft')?.addEventListener('click', () => {
            this.sendToFrame('both', 'hideBug', { position: 'bottom-left' });
        });
        
        document.getElementById('btnHideBugBottom')?.addEventListener('click', () => {
            this.sendToFrame('both', 'hideBug', { position: 'bottom-right' });
        });
    }
    
    getBugConfig(position) {
        const prefix = position === 'left' ? 'bugLeft' : 
                       position === 'right' ? 'bugRight' : 
                       position === 'bottomLeft' ? 'bugBottomLeft' : 
                       'bugBottom';
        return {
            text: document.getElementById(`${prefix}Text`)?.value || '',
            bg: document.getElementById(`${prefix}Bg`)?.value || '#dc3545',
            color: '#ffffff'
        };
    }
    
    // Timer Controls
    setupTimerControls() {
        // Show/hide target time and duration fields based on timer type
        document.getElementById('timerType').addEventListener('change', (e) => {
            const timerType = e.target.value;
            const targetTimeRow = document.getElementById('timerTargetTimeRow');
            const durationRow = document.getElementById('timerDurationRow');
            
            targetTimeRow.style.display = timerType === 'countdownTo' ? 'grid' : 'none';
            durationRow.style.display = timerType === 'countdownFrom' ? 'grid' : 'none';
        });
        
        // Start/Show Timer
        document.getElementById('btnStartTimer').addEventListener('click', () => {
            const config = this.getTimerConfig();
            if (config.type !== 'none') {
                this.sendToFrame('both', 'startTimer', { config });
            }
        });
        
        // Pause Timer
        document.getElementById('btnPauseTimer').addEventListener('click', () => {
            this.sendToFrame('both', 'pauseTimer', {});
        });
        
        // Reset Timer
        document.getElementById('btnResetTimer').addEventListener('click', () => {
            this.sendToFrame('both', 'resetTimer', {});
        });
        
        // Hide Timer
        document.getElementById('btnHideTimer').addEventListener('click', () => {
            this.sendToFrame('both', 'hideTimer', {});
        });
    }
    
    getTimerConfig() {
        const timerType = document.getElementById('timerType').value;
        const position = document.getElementById('timerPosition').value || 'bottom-right';
        
        const config = {
            type: timerType,
            position: position,
            format: document.getElementById('timerFormat').value || 'hms',
            label: document.getElementById('timerLabel').value || '',
            bg: document.getElementById('timerBg').value || '#dc3545',
            color: '#ffffff'
        };
        
        if (timerType === 'countdownTo') {
            const targetTime = document.getElementById('timerTargetTime').value;
            if (targetTime) {
                // Convert HH:MM:SS to timestamp for today
                const now = new Date();
                const [hours, minutes, seconds = 0] = targetTime.split(':').map(Number);
                const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
                config.targetTime = target.getTime();
            }
        } else if (timerType === 'countdownFrom') {
            const duration = parseInt(document.getElementById('timerDuration').value) || 5;
            config.duration = duration * 60; // Convert minutes to seconds
        }
        
        return config;
    }
    
    // Global Color Controls
    setupGlobalColorControls() {
        const applyColors = (primaryBg, primaryText, secondaryBg, secondaryText) => {
            // Update all 5 L3 slots
            for (let i = 1; i <= 5; i++) {
                this.l3Slots[i].primaryBg = primaryBg;
                this.l3Slots[i].primaryColor = primaryText;
                this.l3Slots[i].secondaryBg = secondaryBg;
                this.l3Slots[i].secondaryColor = secondaryText;
            }
            
            // Update the currently displayed L3 form
            document.getElementById('l3PrimaryBg').value = primaryBg;
            document.getElementById('l3PrimaryColor').value = primaryText;
            document.getElementById('l3SecondaryBg').value = secondaryBg;
            document.getElementById('l3SecondaryColor').value = secondaryText;
            
            // Update all bugs
            document.getElementById('bugLeftBg').value = secondaryBg;
            document.getElementById('bugRightBg').value = secondaryBg;
            document.getElementById('bugBottomLeftBg').value = secondaryBg;
            document.getElementById('bugBottomBg').value = secondaryBg;
            
            // Update ticker
            document.getElementById('tickerBg').value = secondaryBg;
            document.getElementById('tickerColor').value = secondaryText;
            
            // Update timer
            document.getElementById('timerBg').value = secondaryBg;
            
            // Update color picker inputs to reflect preset
            document.getElementById('globalPrimaryBg').value = primaryBg;
            document.getElementById('globalPrimaryText').value = primaryText;
            document.getElementById('globalSecondaryBg').value = secondaryBg;
            document.getElementById('globalSecondaryText').value = secondaryText;
            
            // Save state
            this.saveState();
        };
        
        // Color preset buttons
        document.getElementById('btnPresetRed')?.addEventListener('click', () => {
            applyColors('#ffffff', '#000000', '#dc3545', '#ffffff');
            alert('🔴 RED preset applied to all graphics!');
        });
        
        document.getElementById('btnPresetGreen')?.addEventListener('click', () => {
            applyColors('#ffffff', '#000000', '#28a745', '#ffffff');
            alert('🟢 GREEN preset applied to all graphics!');
        });
        
        document.getElementById('btnPresetBlue')?.addEventListener('click', () => {
            applyColors('#ffffff', '#000000', '#0056b3', '#ffffff');
            alert('🔵 ROYAL BLUE preset applied to all graphics!');
        });
        
        document.getElementById('btnPresetOrange')?.addEventListener('click', () => {
            applyColors('#ffffff', '#000000', '#fd7e14', '#ffffff');
            alert('🟠 ORANGE preset applied to all graphics!');
        });
        
        document.getElementById('btnPresetPurple')?.addEventListener('click', () => {
            applyColors('#ffffff', '#000000', '#6f42c1', '#ffffff');
            alert('🟣 PURPLE preset applied to all graphics!');
        });
        
        // Custom colors button
        document.getElementById('btnApplyGlobalColors')?.addEventListener('click', () => {
            const primaryBg = document.getElementById('globalPrimaryBg').value;
            const primaryText = document.getElementById('globalPrimaryText').value;
            const secondaryBg = document.getElementById('globalSecondaryBg').value;
            const secondaryText = document.getElementById('globalSecondaryText').value;
            
            applyColors(primaryBg, primaryText, secondaryBg, secondaryText);
            alert('✅ Custom colors applied to all L3s, bugs, ticker, and timer!\n\nColors will show when you next display graphics.');
        });
    }
    
    // Logo Controls
    setupLogoControls() {
        // Handle global logo file upload
        document.getElementById('globalLogoFile')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const logoUrl = event.target.result;
                    this.globalLogo.url = logoUrl;
                    document.getElementById('globalLogoUrl').value = logoUrl.substring(0, 50) + '...';
                    this.saveState();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Handle global logo URL input
        document.getElementById('globalLogoUrl')?.addEventListener('change', (e) => {
            this.globalLogo.url = e.target.value;
            this.saveState();
        });
        
        // Handle global logo size
        document.getElementById('globalLogoSize')?.addEventListener('change', (e) => {
            this.globalLogo.size = parseInt(e.target.value) || 120;
            this.saveState();
        });
        
        // Handle global logo background color
        document.getElementById('globalLogoBg')?.addEventListener('change', (e) => {
            this.globalLogo.bg = e.target.value;
            this.saveState();
        });
        
        // Handle global logo enabled checkbox
        document.getElementById('globalLogoEnabled')?.addEventListener('change', (e) => {
            this.globalLogo.enabled = e.target.checked;
            this.saveState();
        });
        
        // Apply logo to all L3s
        document.getElementById('btnApplyGlobalLogo')?.addEventListener('click', () => {
            for (let i = 1; i <= 5; i++) {
                this.l3Slots[i].logoEnabled = 'global';
                this.l3Slots[i].customLogoUrl = '';
            }
            this.saveState();
            alert('✅ Global logo settings applied to all L3 slots!');
        });
        
        // Clear all logos
        document.getElementById('btnClearGlobalLogo')?.addEventListener('click', () => {
            this.globalLogo.url = '';
            this.globalLogo.enabled = false;
            document.getElementById('globalLogoUrl').value = '';
            document.getElementById('globalLogoEnabled').checked = false;
            for (let i = 1; i <= 5; i++) {
                this.l3Slots[i].logoEnabled = 'no';
                this.l3Slots[i].customLogoUrl = '';
            }
            this.saveState();
            alert('✅ All logos cleared!');
        });
        
        // Handle per-L3 custom logo upload
        document.getElementById('l3CustomLogoFile')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const logoUrl = event.target.result;
                    this.l3Slots[this.currentL3Slot].customLogoUrl = logoUrl;
                    document.getElementById('l3CustomLogoUrl').value = logoUrl.substring(0, 50) + '...';
                    this.saveState();
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Handle per-L3 custom logo URL
        document.getElementById('l3CustomLogoUrl')?.addEventListener('change', (e) => {
            this.l3Slots[this.currentL3Slot].customLogoUrl = e.target.value;
            this.saveState();
        });
        
        // Handle per-L3 logo enabled dropdown
        document.getElementById('l3LogoEnabled')?.addEventListener('change', (e) => {
            this.l3Slots[this.currentL3Slot].logoEnabled = e.target.value;
            this.saveState();
        });
        
        document.getElementById('l3CustomLogoUrl')?.addEventListener('change', (e) => {
            this.l3Slots[this.currentL3Slot].customLogoUrl = e.target.value;
            this.saveState();
        });
        
        document.getElementById('l3CustomLogoFile')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.l3Slots[this.currentL3Slot].customLogoUrl = event.target.result;
                    document.getElementById('l3CustomLogoUrl').value = '(Custom file uploaded)';
                    this.saveState();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Helper to get final logo config for an L3
    getL3LogoConfig(l3Config) {
        const logoEnabled = l3Config.logoEnabled || 'global';
        
        if (logoEnabled === 'no') {
            return { showLogo: false };
        }
        
        if (logoEnabled === 'yes') {
            return {
                showLogo: true,
                logoUrl: l3Config.customLogoUrl || this.globalLogo.url,
                logoSize: l3Config.logoSize || this.globalLogo.size,
                logoBg: this.globalLogo.bg
            };
        }
        
        // 'global' setting
        return {
            showLogo: this.globalLogo.enabled && this.globalLogo.url !== '',
            logoUrl: this.globalLogo.url,
            logoSize: this.globalLogo.size,
            logoBg: this.globalLogo.bg
        };
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
                    let l3Count = 0;
                    let bugCount = 0;
                    let tickerCount = 0;
                    
                    // Parse CSV based on Type column
                    // Format: Type,ID,Primary Text,Secondary Text,Color,Notes
                    rows.forEach(row => {
                        const type = row[0];
                        const id = row[1];
                        const primaryText = row[2] || '';
                        const secondaryText = row[3] || '';
                        const color = row[4] || '#dc3545';
                        
                        if (type === 'L3') {
                            // Update L3 slot (1-5)
                            const slotIndex = parseInt(id) - 1;
                            if (slotIndex >= 0 && slotIndex < 5) {
                                this.l3Slots[slotIndex].primaryText = primaryText;
                                this.l3Slots[slotIndex].secondaryText = secondaryText;
                                this.l3Slots[slotIndex].secondaryBg = color;
                                l3Count++;
                            }
                        } else if (type === 'Bug') {
                            // Update bug (TopLeft, TopRight, BottomLeft, BottomRight)
                            if (id === 'TopLeft') {
                                document.getElementById('bugLeftText').value = primaryText;
                                document.getElementById('bugLeftBg').value = color;
                                bugCount++;
                            } else if (id === 'TopRight') {
                                document.getElementById('bugRightText').value = primaryText;
                                document.getElementById('bugRightBg').value = color;
                                bugCount++;
                            } else if (id === 'BottomLeft') {
                                document.getElementById('bugBottomLeftText').value = primaryText;
                                document.getElementById('bugBottomLeftBg').value = color;
                                bugCount++;
                            } else if (id === 'BottomRight') {
                                document.getElementById('bugBottomText').value = primaryText;
                                document.getElementById('timerBg').value = color;
                                bugCount++;
                            }
                        } else if (type === 'Ticker') {
                            // Update ticker
                            document.getElementById('tickerText').value = primaryText;
                            document.getElementById('tickerBg').value = color;
                            tickerCount++;
                        }
                    });
                    
                    // Update L3 dropdowns and reload current slot
                    this.updateL3DropdownLabels();
                    this.loadL3SlotToForm(this.currentL3Slot);
                    
                    // Save all changes
                    this.saveState();
                    
                    statusDiv.innerHTML = `<p style="color: #28a745;">✓ Loaded: ${l3Count} L3s, ${bugCount} Bugs, ${tickerCount} Ticker</p>`;
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
    
    startAutoUpdate() {
        // Stop any existing auto-update
        this.stopAutoUpdate();
        
        const interval = parseInt(document.getElementById('gsheetAutoUpdateInterval')?.value || 5);
        const intervalMs = interval * 1000;
        
        console.log(`Starting auto-update every ${interval} seconds`);
        
        // Load immediately
        this.loadGoogleSheets();
        
        // Then set interval for future updates
        this.autoUpdateTimer = setInterval(() => {
            console.log('Auto-updating from Google Sheets...');
            this.loadGoogleSheets();
        }, intervalMs);
    }
    
    stopAutoUpdate() {
        if (this.autoUpdateTimer) {
            clearInterval(this.autoUpdateTimer);
            this.autoUpdateTimer = null;
            console.log('Auto-update stopped');
        }
    }
    
    setupAutoUpdate() {
        const checkbox = document.getElementById('gsheetAutoUpdate');
        const intervalInput = document.getElementById('gsheetAutoUpdateInterval');
        
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startAutoUpdate();
                } else {
                    this.stopAutoUpdate();
                }
            });
        }
        
        if (intervalInput) {
            intervalInput.addEventListener('change', () => {
                // If auto-update is currently enabled, restart with new interval
                if (checkbox?.checked) {
                    this.startAutoUpdate();
                }
            });
        }
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
                // Auto-apply standard fonts when selected
                this.applyFont();
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
        
        // Update L3 with new font (for all L3 slots)
        for (let i = 1; i <= 5; i++) {
            if (this.l3Slots[i]) {
                this.l3Slots[i].fontFamily = this.getCurrentFont();
            }
        }
        
        // Update preview and transmit with new font
        const config = this.getLowerThirdConfig();
        this.sendToFrame('preview', 'updateL3', { config });
        this.sendToFrame('transmit', 'updateL3', { config });
        
        // Update ticker with new font
        const tickerConfig = this.getTickerConfig();
        tickerConfig.fontFamily = this.getCurrentFont();
        this.sendToFrame('preview', 'updateTicker', { config: tickerConfig });
        this.sendToFrame('transmit', 'updateTicker', { config: tickerConfig });
        
        // Update bugs with new font
        this.sendToFrame('both', 'updateBugFont', { fontFamily: this.getCurrentFont() });
        
        // Update timer with new font
        this.sendToFrame('both', 'updateTimerFont', { fontFamily: this.getCurrentFont() });
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
        // Handle both URLs with and without .html extension (for GitHub Pages)
        let fullUrl = window.location.href;
        if (fullUrl.includes('control.html')) {
            fullUrl = fullUrl.replace('control.html', 'output.html');
        } else if (fullUrl.includes('control')) {
            fullUrl = fullUrl.replace(/\/control$/, '/output');
        }
        
        document.getElementById('outputUrl').value = fullUrl;
        
        // Also update the quick transmit URL display
        const quickUrlInput = document.getElementById('quickTransmitUrl');
        if (quickUrlInput) {
            quickUrlInput.value = fullUrl;
        }
        
        // Setup quick copy and open buttons
        const btnQuickCopy = document.getElementById('btnQuickCopyUrl');
        const btnQuickOpen = document.getElementById('btnQuickOpenTab');
        
        if (btnQuickCopy) {
            btnQuickCopy.addEventListener('click', () => {
                quickUrlInput.select();
                document.execCommand('copy');
                btnQuickCopy.textContent = '✓ Copied!';
                setTimeout(() => {
                    btnQuickCopy.textContent = 'Copy URL';
                }, 2000);
            });
        }
        
        if (btnQuickOpen) {
            btnQuickOpen.addEventListener('click', () => {
                // fullUrl already points to output.html/output
                window.open(fullUrl, '_blank');
            });
        }
    }
    
    generateParameterUrl() {
        // Handle both URLs with and without .html extension (for GitHub Pages)
        let baseUrl = window.location.href;
        if (baseUrl.includes('control.html')) {
            baseUrl = baseUrl.replace('control.html', 'output.html');
        } else if (baseUrl.includes('control')) {
            baseUrl = baseUrl.replace(/\/control$/, '/output');
        }
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
        // Save current slot before saving state
        this.saveCurrentL3ToSlot();
        
        const state = {
            l3Slots: this.l3Slots,
            currentL3Slot: this.currentL3Slot,
            globalLogo: this.globalLogo,  // Save logo settings including bg color
            ticker: this.getTickerConfig(),
            gsheetUrl: document.getElementById('gsheetUrl').value,
            rcChannel: document.getElementById('rcChannel').value,
            rcApiKey: document.getElementById('rcApiKey').value,
            rcApiToken: document.getElementById('rcApiToken').value
        };
        
        localStorage.setItem('vmixGraphicsState', JSON.stringify(state));
        alert('State saved successfully! (All 5 L3 slots + colors saved)');
    }
    
    loadSavedState() {
        const savedState = localStorage.getItem('vmixGraphicsState');
        if (!savedState) {
            console.log('No saved state found');
            return;
        }
        
        try {
            const state = JSON.parse(savedState);
            
            // Load L3 slots
            if (state.l3Slots) {
                this.l3Slots = state.l3Slots;
                this.currentL3Slot = state.currentL3Slot || 1;
                this.loadL3SlotToForm(this.currentL3Slot);
            } else if (state.lowerThird) {
                // Legacy support - old single L3 format
                this.l3Slots[1] = state.lowerThird;
                this.loadL3SlotToForm(1);
            }
            
            // Load global logo settings (including bg color)
            if (state.globalLogo) {
                this.globalLogo = state.globalLogo;
                document.getElementById('globalLogoUrl').value = this.globalLogo.url || '';
                document.getElementById('globalLogoSize').value = this.globalLogo.size || 120;
                document.getElementById('globalLogoBg').value = this.globalLogo.bg || '#ffffff';
                document.getElementById('globalLogoEnabled').checked = this.globalLogo.enabled || false;
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
            
            console.log('State loaded successfully (including all L3 slots)');
        } catch (error) {
            console.error('Error loading state:', error);
        }
    }
    
    // Communication with iframes
    setupPreviewScaling() {
        const scalePreview = () => {
            const previewContainers = document.querySelectorAll('.preview-frame');
            
            if (previewContainers[0] && this.previewFrame) {
                const containerWidth = previewContainers[0].offsetWidth;
                const containerHeight = previewContainers[0].offsetHeight;
                const scale = Math.min(containerWidth / 1920, containerHeight / 1080);
                this.previewFrame.style.transform = `scale(${scale})`;
                this.previewFrame.style.transformOrigin = 'top left';
                console.log(`Preview scaled to ${scale.toFixed(3)}x (container: ${containerWidth}x${containerHeight})`);
            }
            
            if (previewContainers[1] && this.transmitFrame) {
                const containerWidth = previewContainers[1].offsetWidth;
                const containerHeight = previewContainers[1].offsetHeight;
                const scale = Math.min(containerWidth / 1920, containerHeight / 1080);
                this.transmitFrame.style.transform = `scale(${scale})`;
                this.transmitFrame.style.transformOrigin = 'top left';
                console.log(`Transmit scaled to ${scale.toFixed(3)}x (container: ${containerWidth}x${containerHeight})`);
            }
        };
        
        // Scale after a short delay to ensure containers are rendered
        setTimeout(scalePreview, 100);
        setTimeout(scalePreview, 500);
        setTimeout(scalePreview, 1000);
        
        // Scale when iframes load
        this.previewFrame.addEventListener('load', () => {
            console.log('Preview iframe loaded, scaling...');
            setTimeout(scalePreview, 100);
        });
        
        this.transmitFrame.addEventListener('load', () => {
            console.log('Transmit iframe loaded, scaling...');
            setTimeout(scalePreview, 100);
        });
        
        // Re-scale on window resize
        window.addEventListener('resize', scalePreview);
    }
    
    sendToFrame(target, action, data = {}) {
        // For dual L3s, data has configLeft and configRight
        // For single actions, data is the config
        // Need to spread data into the message properly
        const message = { action, ...data };
        
        console.log('Sending to', target, ':', message);
        
        if (target === 'preview' || target === 'both') {
            this.previewFrame.contentWindow.postMessage(message, '*');
        }
        
        if (target === 'transmit' || target === 'both') {
            this.transmitFrame.contentWindow.postMessage(message, '*');
            
            // ALSO broadcast to localStorage for VMix and other standalone windows
            localStorage.setItem('vmix_graphics_command', JSON.stringify({
                timestamp: Date.now(),
                message: message
            }));
            
            // ALSO send via Firebase for GitHub Pages + VMix real-time control
            if (window.firebaseBridge && window.firebaseBridge.enabled) {
                window.firebaseBridge.sendCommand(action, data);
                console.log('🔥 Sent via Firebase:', action);
            }
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

