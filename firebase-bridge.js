// Firebase Realtime Bridge for GitHub Pages + VMix
// This enables real-time communication between control panel and output.html

class FirebaseBridge {
    constructor() {
        this.enabled = false;
        this.db = null;
        this.commandRef = null;
        this.lastTimestamp = 0;
    }
    
    // Initialize Firebase connection
    init(config) {
        if (!config || !config.apiKey) {
            console.log('Firebase not configured - using fallback methods only');
            return false;
        }
        
        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            
            this.db = firebase.database();
            this.commandRef = this.db.ref('vmix_commands');
            this.enabled = true;
            
            console.log('✅ Firebase bridge initialized');
            return true;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            return false;
        }
    }
    
    // Send command from control panel
    sendCommand(action, data) {
        if (!this.enabled) {
            console.log('Firebase not enabled, command not sent:', action);
            return false;
        }
        
        const command = {
            action: action,
            data: data,
            timestamp: Date.now()
        };
        
        return this.commandRef.set(command)
            .then(() => {
                console.log('✅ Command sent via Firebase:', action);
                return true;
            })
            .catch((error) => {
                console.error('❌ Firebase send failed:', error);
                return false;
            });
    }
    
    // Listen for commands in output.html
    listen(callback) {
        if (!this.enabled) {
            console.log('Firebase not enabled, cannot listen for commands');
            return false;
        }
        
        this.commandRef.on('value', (snapshot) => {
            const command = snapshot.val();
            
            if (command && command.timestamp > this.lastTimestamp) {
                this.lastTimestamp = command.timestamp;
                console.log('📥 Received command via Firebase:', command.action);
                
                if (callback) {
                    callback({
                        action: command.action,
                        ...command.data
                    });
                }
            }
        });
        
        console.log('👂 Listening for Firebase commands...');
        return true;
    }
    
    // Stop listening
    disconnect() {
        if (this.commandRef) {
            this.commandRef.off();
        }
        this.enabled = false;
    }
}

// Create global instance
window.firebaseBridge = new FirebaseBridge();

