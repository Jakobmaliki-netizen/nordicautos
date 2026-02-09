// Admin Authentication for Nordic Autos - Enhanced Security

class AdminAuth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.maxLoginAttempts = 3;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        
        // Demo credentials (in production, use proper authentication)
        this.credentials = {
            'admin': 'nordic2024',
            'lars': 'porsche911',
            'maria': 'bmwx5'
        };
        
        this.init();
    }

    /**
     * Initialize authentication system
     */
    init() {
        this.checkExistingSession();
        this.setupLoginForm();
        this.setupSessionTimeout();
        this.checkLoginAttempts();
    }

    /**
     * Check login attempts and lockout
     */
    checkLoginAttempts() {
        const attempts = this.getLoginAttempts();
        if (attempts.count >= this.maxLoginAttempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            if (timeSinceLastAttempt < this.lockoutDuration) {
                const remainingTime = Math.ceil((this.lockoutDuration - timeSinceLastAttempt) / 60000);
                this.showMessage(`For mange login forsøg. Prøv igen om ${remainingTime} minutter.`, 'error');
                this.disableLoginForm();
                return false;
            } else {
                // Reset attempts after lockout period
                this.resetLoginAttempts();
            }
        }
        return true;
    }

    /**
     * Get login attempts from localStorage
     */
    getLoginAttempts() {
        const attempts = localStorage.getItem('adminLoginAttempts');
        if (attempts) {
            return JSON.parse(attempts);
        }
        return { count: 0, lastAttempt: 0 };
    }

    /**
     * Record failed login attempt
     */
    recordFailedAttempt() {
        const attempts = this.getLoginAttempts();
        attempts.count += 1;
        attempts.lastAttempt = Date.now();
        localStorage.setItem('adminLoginAttempts', JSON.stringify(attempts));
        
        // Log security event
        this.logSecurityEvent('failed_login_attempt', {
            attempts: attempts.count,
            timestamp: new Date().toISOString(),
            ip: 'client-side' // In production, get real IP
        });
    }

    /**
     * Reset login attempts
     */
    resetLoginAttempts() {
        localStorage.removeItem('adminLoginAttempts');
    }

    /**
     * Disable login form
     */
    disableLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            const inputs = loginForm.querySelectorAll('input, button');
            inputs.forEach(input => input.disabled = true);
        }
    }

    /**
     * Check for existing session
     */
    checkExistingSession() {
        const session = localStorage.getItem('nordicAdminSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const now = new Date().getTime();
                
                if (now < sessionData.expires) {
                    this.isAuthenticated = true;
                    this.currentUser = sessionData.user;
                    
                    // If on login page and authenticated, redirect to dashboard
                    if (window.location.pathname.includes('login.html')) {
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Invalid session data:', error);
                this.logout();
            }
        }
    }

    /**
     * Setup login form
     */
    setupLoginForm() {
        const loginForm = document.getElementById('admin-login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    /**
     * Handle login attempt
     */
    async handleLogin() {
        // Check if login is allowed
        if (!this.checkLoginAttempts()) {
            return;
        }

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        if (!username || !password) {
            this.showMessage('Udfyld alle felter', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Logger ind...';
        submitBtn.disabled = true;

        // Simulate authentication delay (prevent timing attacks)
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Check credentials
        if (this.credentials[username] && this.credentials[username] === password) {
            this.resetLoginAttempts(); // Reset on successful login
            this.login(username, remember);
        } else {
            this.recordFailedAttempt();
            const attempts = this.getLoginAttempts();
            const remaining = this.maxLoginAttempts - attempts.count;
            
            if (remaining > 0) {
                this.showMessage(`Forkert brugernavn eller adgangskode. ${remaining} forsøg tilbage.`, 'error');
            } else {
                this.showMessage('For mange fejlede forsøg. Kontoen er midlertidigt låst.', 'error');
                this.disableLoginForm();
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Login user
     */
    login(username, remember = false) {
        this.isAuthenticated = true;
        this.currentUser = username;
        
        // Create session
        const sessionDuration = remember ? 7 * 24 * 60 * 60 * 1000 : this.sessionTimeout; // 7 days or 30 minutes
        const sessionData = {
            user: username,
            loginTime: new Date().getTime(),
            expires: new Date().getTime() + sessionDuration
        };
        
        localStorage.setItem('nordicAdminSession', JSON.stringify(sessionData));
        
        // Log activity
        this.logActivity('login', { user: username, timestamp: new Date().toISOString() });
        
        this.showMessage('Login succesfuldt! Omdirigerer...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    /**
     * Logout user
     */
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Clear session
        localStorage.removeItem('nordicAdminSession');
        
        // Log activity
        this.logActivity('logout', { timestamp: new Date().toISOString() });
        
        // Redirect to login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    /**
     * Check if user is authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /**
     * Setup session timeout
     */
    setupSessionTimeout() {
        // Check session every minute
        setInterval(() => {
            if (this.isAuthenticated) {
                const session = localStorage.getItem('nordicAdminSession');
                if (session) {
                    try {
                        const sessionData = JSON.parse(session);
                        const now = new Date().getTime();
                        
                        if (now >= sessionData.expires) {
                            this.showMessage('Session udløbet. Logger ud...', 'warning');
                            setTimeout(() => this.logout(), 2000);
                        }
                    } catch (error) {
                        this.logout();
                    }
                }
            }
        }, 60000);
    }

    /**
     * Show message to user
     */
    showMessage(message, type) {
        const messageContainer = document.getElementById('login-message');
        if (!messageContainer) return;

        const bgColor = type === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 
                       type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                       'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200';

        messageContainer.className = `text-sm text-center py-2 rounded-lg ${bgColor}`;
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');

        // Auto-hide after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                messageContainer.classList.add('hidden');
            }, 5000);
        }
    }

    /**
     * Log admin activity
     */
    logActivity(action, data) {
        const activities = JSON.parse(localStorage.getItem('nordicAdminActivities') || '[]');
        activities.push({
            action,
            data,
            timestamp: new Date().toISOString(),
            user: this.currentUser
        });
        
        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }
        
        localStorage.setItem('nordicAdminActivities', JSON.stringify(activities));
    }

    /**
     * Log security events
     */
    logSecurityEvent(event, data) {
        const securityLog = JSON.parse(localStorage.getItem('nordicSecurityLog') || '[]');
        securityLog.push({
            event,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // Keep only last 50 security events
        if (securityLog.length > 50) {
            securityLog.splice(0, securityLog.length - 50);
        }
        
        localStorage.setItem('nordicSecurityLog', JSON.stringify(securityLog));
    }

    /**
     * Get user permissions
     */
    getUserPermissions() {
        const permissions = {
            'admin': ['read', 'write', 'delete', 'manage_users'],
            'lars': ['read', 'write', 'delete'],
            'maria': ['read', 'write']
        };
        
        return permissions[this.currentUser] || ['read'];
    }

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        const userPermissions = this.getUserPermissions();
        return userPermissions.includes(permission);
    }

    /**
     * Get current user info
     */
    getCurrentUser() {
        return {
            username: this.currentUser,
            permissions: this.getUserPermissions(),
            isAuthenticated: this.isAuthenticated
        };
    }

    /**
     * Static method to initialize auth
     */
    static initialize() {
        if (!window.adminAuth) {
            window.adminAuth = new AdminAuth();
        }
        return window.adminAuth;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AdminAuth.initialize();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
} else {
    window.AdminAuth = AdminAuth;
}