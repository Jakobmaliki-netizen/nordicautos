// Cross-Tab Communication Bridge for Nordic Autos
// Handles communication between browser tabs using localStorage events

class CrossTabBridge {
    constructor() {
        this.tabId = this.generateTabId();
        this.eventSubscribers = new Map();
        this.processedEvents = new Set();
        this.maxProcessedEvents = 1000; // Prevent memory leaks
        
        this.setupStorageListener();
        console.log('🌉 CrossTabBridge initialized with tabId:', this.tabId);
    }

    /**
     * Set up storage event listener
     */
    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            this.handleStorageEvent(event);
        });
    }

    /**
     * Broadcast event to all tabs
     */
    broadcast(eventType, data) {
        const eventData = {
            id: this.generateEventId(),
            type: eventType,
            data: data,
            timestamp: Date.now(),
            sourceTabId: this.tabId
        };

        console.log('📡 Broadcasting cross-tab event:', eventData);

        try {
            // Store in localStorage to trigger storage events in other tabs
            localStorage.setItem('nordic-autos-cross-tab-event', JSON.stringify(eventData));
            
            // Remove immediately to allow for rapid successive events
            setTimeout(() => {
                localStorage.removeItem('nordic-autos-cross-tab-event');
            }, 100);
            
            return eventData.id;
        } catch (error) {
            console.error('❌ Failed to broadcast cross-tab event:', error);
            return null;
        }
    }

    /**
     * Subscribe to specific event types
     */
    subscribe(eventType, callback) {
        if (!this.eventSubscribers.has(eventType)) {
            this.eventSubscribers.set(eventType, new Set());
        }
        
        const subscriptionId = this.generateSubscriptionId();
        const subscription = {
            id: subscriptionId,
            callback: callback
        };
        
        this.eventSubscribers.get(eventType).add(subscription);
        
        console.log(`📝 Subscribed to cross-tab event '${eventType}':`, subscriptionId);
        
        // Return unsubscribe function
        return () => {
            this.unsubscribe(eventType, subscriptionId);
        };
    }

    /**
     * Unsubscribe from event type
     */
    unsubscribe(eventType, subscriptionId) {
        if (this.eventSubscribers.has(eventType)) {
            const subscribers = this.eventSubscribers.get(eventType);
            const subscription = Array.from(subscribers).find(sub => sub.id === subscriptionId);
            
            if (subscription) {
                subscribers.delete(subscription);
                console.log(`🗑️ Unsubscribed from cross-tab event '${eventType}':`, subscriptionId);
                
                // Clean up empty event type
                if (subscribers.size === 0) {
                    this.eventSubscribers.delete(eventType);
                }
            }
        }
    }

    /**
     * Handle storage events from other tabs
     */
    handleStorageEvent(event) {
        // Only handle our cross-tab events
        if (event.key !== 'nordic-autos-cross-tab-event' || !event.newValue) {
            return;
        }

        try {
            const eventData = JSON.parse(event.newValue);
            
            // Ignore events from the same tab
            if (eventData.sourceTabId === this.tabId) {
                return;
            }
            
            // Prevent duplicate processing
            if (this.processedEvents.has(eventData.id)) {
                return;
            }
            
            console.log('📨 Received cross-tab event:', eventData);
            
            // Mark as processed
            this.processedEvents.add(eventData.id);
            this.cleanupProcessedEvents();
            
            // Notify subscribers
            this.notifySubscribers(eventData.type, eventData);
            
        } catch (error) {
            console.error('❌ Error processing cross-tab event:', error);
        }
    }

    /**
     * Notify subscribers of specific event type
     */
    notifySubscribers(eventType, eventData) {
        if (!this.eventSubscribers.has(eventType)) {
            return;
        }

        const subscribers = this.eventSubscribers.get(eventType);
        console.log(`📢 Notifying ${subscribers.size} cross-tab subscribers for '${eventType}'`);
        
        subscribers.forEach(subscription => {
            try {
                subscription.callback(eventData);
            } catch (error) {
                console.error(`❌ Error in cross-tab subscriber ${subscription.id}:`, error);
            }
        });
    }

    /**
     * Clean up old processed events to prevent memory leaks
     */
    cleanupProcessedEvents() {
        if (this.processedEvents.size > this.maxProcessedEvents) {
            const eventsArray = Array.from(this.processedEvents);
            const toKeep = eventsArray.slice(-Math.floor(this.maxProcessedEvents * 0.8));
            
            this.processedEvents.clear();
            toKeep.forEach(eventId => this.processedEvents.add(eventId));
            
            console.log('🧹 Cleaned up processed events cache');
        }
    }

    /**
     * Generate unique tab ID
     */
    generateTabId() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique event ID
     */
    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique subscription ID
     */
    generateSubscriptionId() {
        return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get current tab ID
     */
    getTabId() {
        return this.tabId;
    }

    /**
     * Get subscriber count for event type
     */
    getSubscriberCount(eventType) {
        return this.eventSubscribers.has(eventType) ? 
               this.eventSubscribers.get(eventType).size : 0;
    }

    /**
     * Get all subscribed event types
     */
    getSubscribedEventTypes() {
        return Array.from(this.eventSubscribers.keys());
    }

    /**
     * Cleanup resources
     */
    destroy() {
        console.log('🧹 Destroying CrossTabBridge...');
        
        // Clear all subscribers
        this.eventSubscribers.clear();
        
        // Clear processed events
        this.processedEvents.clear();
        
        // Remove storage listener (note: this removes ALL storage listeners)
        // In a real implementation, you'd want to track the specific listener
        console.log('✅ CrossTabBridge destroyed');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossTabBridge;
} else {
    window.CrossTabBridge = CrossTabBridge;
}