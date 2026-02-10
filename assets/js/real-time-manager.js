// Real-Time Manager for Nordic Autos
// Handles real-time updates, connection monitoring, and fallback mechanisms

class RealTimeManager {
    constructor() {
        this.isInitialized = false;
        this.connectionStatus = {
            isOnline: navigator.onLine,
            supabaseConnected: false,
            realTimeActive: false,
            fallbackMode: false,
            lastSuccessfulSync: null,
            queuedUpdates: 0
        };
        
        this.subscribers = new Map();
        this.retryAttempts = 0;
        this.maxRetryAttempts = 10;
        this.retryDelay = 1000; // Start with 1 second
        this.maxRetryDelay = 30000; // Max 30 seconds
        
        this.pollingInterval = null;
        this.pollingFrequency = 10000; // 10 seconds
        
        this.subscription = null;
        this.tabId = this.generateTabId();
        
        // Initialize cross-tab bridge
        this.crossTabBridge = null;
        this.crossTabSubscriptions = [];
        
        console.log('🔧 RealTimeManager created with tabId:', this.tabId);
    }

    /**
     * Initialize the Real-Time Manager
     */
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ RealTimeManager already initialized');
            return true;
        }

        console.log('🚀 Initializing RealTimeManager...');
        
        try {
            // Initialize cross-tab bridge
            this.setupCrossTabBridge();
            
            // Set up connection monitoring
            this.setupConnectionMonitoring();
            
            // Try to establish Supabase real-time connection
            await this.connectToSupabase();
            
            this.isInitialized = true;
            console.log('✅ RealTimeManager initialized successfully');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize RealTimeManager:', error);
            this.enableFallbackMode();
            return false;
        }
    }

    /**
     * Set up cross-tab communication bridge
     */
    setupCrossTabBridge() {
        if (window.CrossTabBridge) {
            this.crossTabBridge = new CrossTabBridge();
            
            // Subscribe to car update events from other tabs
            const carUpdateSub = this.crossTabBridge.subscribe('car_updated', (eventData) => {
                console.log('🔄 Cross-tab car update received:', eventData);
                this.handleCrossTabUpdate(eventData);
            });
            
            // Subscribe to admin dashboard events
            const adminUpdateSub = this.crossTabBridge.subscribe('admin_car_updated', (eventData) => {
                console.log('🔄 Cross-tab admin update received:', eventData);
                this.handleCrossTabUpdate(eventData);
            });
            
            // Subscribe to connection status changes
            const statusSub = this.crossTabBridge.subscribe('connection_status_changed', (eventData) => {
                console.log('🔄 Cross-tab status change received:', eventData);
                this.handleCrossTabStatusChange(eventData);
            });
            
            this.crossTabSubscriptions = [carUpdateSub, adminUpdateSub, statusSub];
            console.log('✅ Cross-tab bridge set up successfully');
        } else {
            console.warn('⚠️ CrossTabBridge not available, cross-tab communication disabled');
        }
    }

    /**
     * Handle cross-tab updates
     */
    handleCrossTabUpdate(eventData) {
        // Avoid processing our own events
        if (eventData.sourceTabId === this.tabId) {
            return;
        }
        
        // Forward to local subscribers with proper event type mapping
        let mappedEventType = 'car_updated';
        if (eventData.type === 'admin_car_updated') {
            mappedEventType = 'car_updated';
        }
        
        this.notifySubscribers(mappedEventType, {
            ...eventData.data,
            source: 'cross_tab',
            originalSource: eventData.data.source || 'unknown'
        });
    }

    /**
     * Handle cross-tab status changes
     */
    handleCrossTabStatusChange(eventData) {
        // Avoid processing our own events
        if (eventData.sourceTabId === this.tabId) {
            return;
        }
        
        console.log('📊 Cross-tab status change:', eventData.data);
        // Could be used to coordinate connection attempts across tabs
    }

    /**
     * Broadcast to other tabs
     */
    broadcastToTabs(eventType, data) {
        if (this.crossTabBridge) {
            this.crossTabBridge.broadcast(eventType, data);
        }
    }
    /**
     * Set up connection monitoring
     */
    setupConnectionMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
            this.connectionStatus.isOnline = true;
            this.handleConnectionChange(true);
        });

        window.addEventListener('offline', () => {
            console.log('📴 Connection lost');
            this.connectionStatus.isOnline = false;
            this.handleConnectionChange(false);
        });

        // Monitor page visibility for reconnection
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.connectionStatus.isOnline) {
                console.log('👁️ Page became visible, checking connection');
                this.checkAndReconnect();
                
                // Broadcast visibility change to other tabs
                this.broadcastToTabs('tab_visibility_changed', {
                    tabId: this.tabId,
                    visible: true,
                    timestamp: Date.now()
                });
            }
        });
    }

    /**
     * Connect to Supabase real-time
     */
    async connectToSupabase() {
        if (!window.supabaseCarManager) {
            throw new Error('SupabaseCarManager not available');
        }

        try {
            // Ensure Supabase is initialized
            await window.supabaseCarManager.initialize();
            
            if (window.supabaseCarManager.fallbackToLocalStorage) {
                console.log('📝 Supabase in localStorage mode, enabling fallback');
                this.enableFallbackMode();
                return false;
            }

            // Set up real-time subscription
            this.subscription = window.supabaseCarManager.subscribeToCarUpdates((payload) => {
                console.log('🔄 Real-time update received:', payload);
                this.handleSupabaseUpdate(payload);
            });

            this.connectionStatus.supabaseConnected = true;
            this.connectionStatus.realTimeActive = true;
            this.connectionStatus.lastSuccessfulSync = Date.now();
            this.retryAttempts = 0; // Reset retry counter on successful connection
            
            console.log('✅ Supabase real-time connection established');
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to Supabase real-time:', error);
            throw error;
        }
    }

    /**
     * Handle connection changes
     */
    handleConnectionChange(isOnline) {
        if (isOnline) {
            console.log('🔄 Connection restored, attempting to reconnect...');
            this.checkAndReconnect();
        } else {
            console.log('📴 Connection lost, enabling fallback mode');
            this.enableFallbackMode();
        }
        
        // Broadcast connection status change to other tabs
        this.broadcastToTabs('connection_status_changed', {
            tabId: this.tabId,
            isOnline: isOnline,
            connectionStatus: this.getConnectionStatus(),
            timestamp: Date.now()
        });
    }

    /**
     * Check connection and reconnect if needed
     */
    async checkAndReconnect() {
        if (!this.connectionStatus.realTimeActive && this.connectionStatus.isOnline) {
            try {
                await this.connectToSupabase();
                if (this.connectionStatus.realTimeActive) {
                    this.disableFallbackMode();
                }
            } catch (error) {
                console.error('❌ Reconnection failed:', error);
                this.scheduleRetry();
            }
        }
    }

    /**
     * Schedule retry with exponential backoff
     */
    scheduleRetry() {
        if (this.retryAttempts >= this.maxRetryAttempts) {
            console.error('❌ Max retry attempts reached, staying in fallback mode');
            return;
        }

        const delay = Math.min(
            this.retryDelay * Math.pow(2, this.retryAttempts),
            this.maxRetryDelay
        );
        
        this.retryAttempts++;
        console.log(`⏳ Scheduling retry ${this.retryAttempts}/${this.maxRetryAttempts} in ${delay}ms`);
        
        setTimeout(() => {
            this.checkAndReconnect();
        }, delay);
    }

    /**
     * Enable fallback mode (periodic polling)
     */
    enableFallbackMode() {
        if (this.connectionStatus.fallbackMode) {
            return; // Already in fallback mode
        }

        console.log('🔄 Enabling fallback mode with periodic polling');
        this.connectionStatus.fallbackMode = true;
        this.connectionStatus.realTimeActive = false;
        
        // Start periodic polling
        this.pollingInterval = setInterval(() => {
            this.pollForUpdates();
        }, this.pollingFrequency);
        
        // Notify subscribers about mode change
        this.notifySubscribers('fallback_mode_enabled', {
            reason: 'Connection issues',
            pollingFrequency: this.pollingFrequency
        });
    }

    /**
     * Disable fallback mode
     */
    disableFallbackMode() {
        if (!this.connectionStatus.fallbackMode) {
            return; // Not in fallback mode
        }

        console.log('✅ Disabling fallback mode, real-time active');
        this.connectionStatus.fallbackMode = false;
        
        // Stop periodic polling
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        
        // Notify subscribers about mode change
        this.notifySubscribers('fallback_mode_disabled', {
            reason: 'Real-time connection restored'
        });
    }

    /**
     * Poll for updates (fallback mechanism)
     */
    async pollForUpdates() {
        if (!this.connectionStatus.isOnline) {
            return;
        }

        try {
            console.log('🔍 Polling for updates...');
            
            // Get fresh data from Supabase
            if (window.supabaseCarManager) {
                const cars = await window.supabaseCarManager.getCars();
                
                // Notify subscribers about the update
                this.notifySubscribers('cars_updated', {
                    cars: cars,
                    source: 'polling',
                    timestamp: Date.now()
                });
                
                this.connectionStatus.lastSuccessfulSync = Date.now();
            }
        } catch (error) {
            console.error('❌ Polling failed:', error);
        }
    }

    /**
     * Handle Supabase real-time updates
     */
    handleSupabaseUpdate(payload) {
        const updateData = {
            type: payload.eventType || 'UPDATE',
            carId: payload.new?.id || payload.old?.id,
            carData: payload.new || null,
            source: 'realtime',
            timestamp: Date.now(),
            tabId: this.tabId
        };

        console.log('📡 Processing Supabase update:', updateData);
        
        // Notify all local subscribers
        this.notifySubscribers('car_updated', updateData);
        
        // Broadcast to other tabs
        this.broadcastToTabs('car_updated', updateData);
        
        // Update connection status
        this.connectionStatus.lastSuccessfulSync = Date.now();
    }

    /**
     * Subscribe to real-time updates
     */
    subscribeToCarUpdates(callback) {
        const subscriptionId = this.generateSubscriptionId();
        this.subscribers.set(subscriptionId, callback);
        
        console.log('📝 New subscription registered:', subscriptionId);
        
        // Return unsubscribe function
        return () => {
            this.subscribers.delete(subscriptionId);
            console.log('🗑️ Subscription removed:', subscriptionId);
        };
    }

    /**
     * Notify all subscribers
     */
    notifySubscribers(eventType, data) {
        const event = {
            type: eventType,
            data: data,
            timestamp: Date.now(),
            tabId: this.tabId
        };

        console.log(`📢 Notifying ${this.subscribers.size} subscribers:`, event);
        
        this.subscribers.forEach((callback, subscriptionId) => {
            try {
                callback(event);
            } catch (error) {
                console.error(`❌ Error in subscriber ${subscriptionId}:`, error);
            }
        });
    }

    /**
     * Get current connection status
     */
    getConnectionStatus() {
        return { ...this.connectionStatus };
    }

    /**
     * Generate unique tab ID
     */
    generateTabId() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique subscription ID
     */
    generateSubscriptionId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Cleanup resources
     */
    destroy() {
        console.log('🧹 Destroying RealTimeManager...');
        
        // Clear polling interval
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        
        // Unsubscribe from Supabase
        if (this.subscription && typeof this.subscription.unsubscribe === 'function') {
            this.subscription.unsubscribe();
        }
        
        // Clean up cross-tab subscriptions
        this.crossTabSubscriptions.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.crossTabSubscriptions = [];
        
        // Destroy cross-tab bridge
        if (this.crossTabBridge) {
            this.crossTabBridge.destroy();
            this.crossTabBridge = null;
        }
        
        // Clear subscribers
        this.subscribers.clear();
        
        this.isInitialized = false;
        console.log('✅ RealTimeManager destroyed');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeManager;
} else {
    window.RealTimeManager = RealTimeManager;
}