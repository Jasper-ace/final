// Settings Manager - User Settings and Preferences
class SettingsManager {
    constructor() {
        this.currentUser = null;
        this.userSettings = null;
        this.initializeSettingsManager();
    }

    async initializeSettingsManager() {
        // Wait for auth to be ready
        await this.waitForAuth();
        this.currentUser = window.supabaseAuth.getCurrentUser();
        
        if (this.currentUser) {
            await this.loadUserSettings();
        }
    }

    async waitForAuth() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (window.supabaseAuth && window.supabaseAuth.supabase) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    async loadUserSettings() {
        try {
            // Try to load from localStorage first (for quick access)
            const localSettings = localStorage.getItem(`user_settings_${this.currentUser.id}`);
            
            if (localSettings) {
                this.userSettings = JSON.parse(localSettings);
            } else {
                // Default settings
                this.userSettings = {
                    theme: 'light',
                    language: 'en',
                    emailNotifications: true,
                    marketingEmails: false,
                    soundEffects: true,
                    autoplay: true,
                    playbackSpeed: 1.0,
                    subtitles: false,
                    privacy: {
                        showProfile: true,
                        showProgress: true,
                        showAchievements: true
                    }
                };
                
                // Save default settings
                await this.saveSettings();
            }
        } catch (error) {
            console.error('Error loading user settings:', error);
        }
    }

    showSettingsModal() {
        const modalHTML = `
            <div id="settingsModal" class="modal">
                <div class="modal-content large-modal">
                    <div class="modal-header">
                        <h2><i class="fas fa-cog"></i> Settings</h2>
                        <span class="close" data-modal="settingsModal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="settings-tabs">
                            <button class="tab-btn active" data-tab="general-settings">
                                <i class="fas fa-sliders-h"></i> General
                            </button>
                            <button class="tab-btn" data-tab="learning-settings">
                                <i class="fas fa-graduation-cap"></i> Learning
                            </button>
                            <button class="tab-btn" data-tab="notification-settings">
                                <i class="fas fa-bell"></i> Notifications
                            </button>
                            <button class="tab-btn" data-tab="privacy-settings">
                                <i class="fas fa-shield-alt"></i> Privacy
                            </button>
                        </div>

                        <div class="tab-content active" id="general-settings">
                            <div class="settings-section">
                                <h3>Appearance</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Theme</h4>
                                        <p>Choose your preferred color scheme</p>
                                    </div>
                                    <select id="themeSelect" class="setting-select">
                                        <option value="light" ${this.userSettings?.theme === 'light' ? 'selected' : ''}>Light</option>
                                        <option value="dark" ${this.userSettings?.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                        <option value="auto" ${this.userSettings?.theme === 'auto' ? 'selected' : ''}>Auto</option>
                                    </select>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Language</h4>
                                        <p>Select your preferred language</p>
                                    </div>
                                    <select id="languageSelect" class="setting-select">
                                        <option value="en" ${this.userSettings?.language === 'en' ? 'selected' : ''}>English</option>
                                        <option value="es" ${this.userSettings?.language === 'es' ? 'selected' : ''}>Español</option>
                                        <option value="fr" ${this.userSettings?.language === 'fr' ? 'selected' : ''}>Français</option>
                                        <option value="de" ${this.userSettings?.language === 'de' ? 'selected' : ''}>Deutsch</option>
                                        <option value="pt" ${this.userSettings?.language === 'pt' ? 'selected' : ''}>Português</option>
                                    </select>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>Accessibility</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>High Contrast Mode</h4>
                                        <p>Increase contrast for better visibility</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="highContrast">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Reduce Motion</h4>
                                        <p>Minimize animations and transitions</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="reduceMotion">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="learning-settings">
                            <div class="settings-section">
                                <h3>Video Playback</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Default Playback Speed</h4>
                                        <p>Set your preferred video playback speed</p>
                                    </div>
                                    <select id="playbackSpeedSelect" class="setting-select">
                                        <option value="0.5" ${this.userSettings?.playbackSpeed === 0.5 ? 'selected' : ''}>0.5x</option>
                                        <option value="0.75" ${this.userSettings?.playbackSpeed === 0.75 ? 'selected' : ''}>0.75x</option>
                                        <option value="1.0" ${this.userSettings?.playbackSpeed === 1.0 ? 'selected' : ''}>1.0x (Normal)</option>
                                        <option value="1.25" ${this.userSettings?.playbackSpeed === 1.25 ? 'selected' : ''}>1.25x</option>
                                        <option value="1.5" ${this.userSettings?.playbackSpeed === 1.5 ? 'selected' : ''}>1.5x</option>
                                        <option value="2.0" ${this.userSettings?.playbackSpeed === 2.0 ? 'selected' : ''}>2.0x</option>
                                    </select>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Autoplay Next Video</h4>
                                        <p>Automatically play the next lesson when current one ends</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="autoplayNext" ${this.userSettings?.autoplay ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Show Subtitles</h4>
                                        <p>Display subtitles by default when available</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="showSubtitles" ${this.userSettings?.subtitles ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>Learning Experience</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Sound Effects</h4>
                                        <p>Play sounds for achievements and interactions</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="soundEffects" ${this.userSettings?.soundEffects ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Progress Reminders</h4>
                                        <p>Get gentle reminders to continue your learning</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="progressReminders" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="notification-settings">
                            <div class="settings-section">
                                <h3>Email Notifications</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Course Updates</h4>
                                        <p>Receive notifications about course progress and new content</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="courseUpdates" ${this.userSettings?.emailNotifications ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Marketing Emails</h4>
                                        <p>Receive information about new courses and special offers</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="marketingEmails" ${this.userSettings?.marketingEmails ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Achievement Notifications</h4>
                                        <p>Get notified when you earn badges and complete milestones</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="achievementNotifications" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>Push Notifications</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Browser Notifications</h4>
                                        <p>Allow browser notifications for important updates</p>
                                    </div>
                                    <button class="btn btn-secondary" onclick="settingsManager.requestNotificationPermission()">
                                        <i class="fas fa-bell"></i> Enable Notifications
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="privacy-settings">
                            <div class="settings-section">
                                <h3>Profile Visibility</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Public Profile</h4>
                                        <p>Allow others to view your profile information</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="publicProfile" ${this.userSettings?.privacy?.showProfile ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Show Learning Progress</h4>
                                        <p>Display your course progress on your public profile</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="showProgress" ${this.userSettings?.privacy?.showProgress ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Show Achievements</h4>
                                        <p>Display your badges and achievements publicly</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="showAchievements" ${this.userSettings?.privacy?.showAchievements ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>Data & Privacy</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Analytics</h4>
                                        <p>Help us improve by sharing anonymous usage data</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="analytics" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Download My Data</h4>
                                        <p>Get a copy of all your data stored with us</p>
                                    </div>
                                    <button class="btn btn-secondary" onclick="settingsManager.downloadUserData()">
                                        <i class="fas fa-download"></i> Download Data
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="settings-footer">
                            <button class="btn btn-secondary" onclick="settingsManager.resetToDefaults()">
                                <i class="fas fa-undo"></i> Reset to Defaults
                            </button>
                            <button class="btn btn-primary" onclick="settingsManager.saveAllSettings()">
                                <i class="fas fa-save"></i> Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('settingsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = document.getElementById('settingsModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Initialize modal functionality
        this.initializeSettingsModal();
    }

    initializeSettingsModal() {
        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs and content
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding content
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Close modal functionality
        document.querySelector('[data-modal="settingsModal"]').addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.hideSettingsModal();
            }
        });

        // Theme change handler
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });
    }

    async saveAllSettings() {
        try {
            // Collect all settings from the form
            const settings = {
                theme: document.getElementById('themeSelect').value,
                language: document.getElementById('languageSelect').value,
                playbackSpeed: parseFloat(document.getElementById('playbackSpeedSelect').value),
                autoplay: document.getElementById('autoplayNext').checked,
                subtitles: document.getElementById('showSubtitles').checked,
                soundEffects: document.getElementById('soundEffects').checked,
                emailNotifications: document.getElementById('courseUpdates').checked,
                marketingEmails: document.getElementById('marketingEmails').checked,
                privacy: {
                    showProfile: document.getElementById('publicProfile').checked,
                    showProgress: document.getElementById('showProgress').checked,
                    showAchievements: document.getElementById('showAchievements').checked
                }
            };

            // Update local settings
            this.userSettings = { ...this.userSettings, ...settings };

            // Save to localStorage
            localStorage.setItem(`user_settings_${this.currentUser.id}`, JSON.stringify(this.userSettings));

            // Apply theme immediately
            this.applyTheme(settings.theme);

            // Show success message
            window.showNotification('Settings saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            window.showNotification('Failed to save settings. Please try again.', 'error');
        }
    }

    async saveSettings() {
        // Save to localStorage for now (could be extended to save to database)
        localStorage.setItem(`user_settings_${this.currentUser.id}`, JSON.stringify(this.userSettings));
    }

    applyTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'dark') {
            body.classList.add('theme-dark');
        } else if (theme === 'light') {
            body.classList.add('theme-light');
        } else if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        }
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            // Clear localStorage
            localStorage.removeItem(`user_settings_${this.currentUser.id}`);
            
            // Reload default settings
            this.loadUserSettings();
            
            // Close and reopen modal to reflect changes
            this.hideSettingsModal();
            setTimeout(() => {
                this.showSettingsModal();
            }, 300);
            
            window.showNotification('Settings reset to defaults', 'info');
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    window.showNotification('Browser notifications enabled!', 'success');
                } else {
                    window.showNotification('Notification permission denied', 'warning');
                }
            });
        } else {
            window.showNotification('Browser notifications not supported', 'warning');
        }
    }

    downloadUserData() {
        window.showNotification('Data download feature will be available soon!', 'info');
        // In a real app, this would generate and download a JSON file with user data
    }

    hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
}

// Initialize settings manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseAuth && window.supabaseAuth.isAuthenticated()) {
        window.settingsManager = new SettingsManager();
    }
});

// Also initialize when auth state changes
if (window.supabaseAuth) {
    window.supabaseAuth.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user && !window.settingsManager) {
            window.settingsManager = new SettingsManager();
        } else if (event === 'SIGNED_OUT') {
            window.settingsManager = null;
        }
    });
}