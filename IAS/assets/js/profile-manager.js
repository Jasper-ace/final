// Profile Manager - User Profile Management
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.initializeProfileManager();
    }

    async initializeProfileManager() {
        // Wait for auth to be ready
        await this.waitForAuth();
        this.currentUser = window.supabaseAuth.getCurrentUser();
        
        if (this.currentUser) {
            await this.loadUserProfile();
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

    async loadUserProfile() {
        try {
            const { data, error } = await window.supabaseAuth.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error loading profile:', error);
                return;
            }

            this.userProfile = data || {
                id: this.currentUser.id,
                full_name: this.currentUser.user_metadata?.full_name || '',
                email: this.currentUser.email,
                bio: '',
                location: '',
                website: '',
                github: '',
                linkedin: '',
                twitter: '',
                created_at: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    showProfileModal() {
        const modalHTML = `
            <div id="profileModal" class="modal">
                <div class="modal-content large-modal">
                    <div class="modal-header">
                        <h2><i class="fas fa-user"></i> My Profile</h2>
                        <span class="close" data-modal="profileModal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="profile-tabs">
                            <button class="tab-btn active" data-tab="profile-info">
                                <i class="fas fa-user"></i> Profile Info
                            </button>
                            <button class="tab-btn" data-tab="account-settings">
                                <i class="fas fa-cog"></i> Account Settings
                            </button>
                            <button class="tab-btn" data-tab="learning-stats">
                                <i class="fas fa-chart-bar"></i> Learning Stats
                            </button>
                        </div>

                        <div class="tab-content active" id="profile-info">
                            <form id="profileForm" class="profile-form">
                                <div class="profile-avatar">
                                    <div class="avatar-circle">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <button type="button" class="btn-change-avatar">
                                        <i class="fas fa-camera"></i> Change Photo
                                    </button>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="profileFullName">Full Name</label>
                                        <input type="text" id="profileFullName" name="fullName" 
                                               value="${this.userProfile?.full_name || ''}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="profileEmail">Email Address</label>
                                        <input type="email" id="profileEmail" name="email" 
                                               value="${this.currentUser?.email || ''}" readonly>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="profileBio">Bio</label>
                                    <textarea id="profileBio" name="bio" rows="3" 
                                              placeholder="Tell us about yourself...">${this.userProfile?.bio || ''}</textarea>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="profileLocation">Location</label>
                                        <input type="text" id="profileLocation" name="location" 
                                               value="${this.userProfile?.location || ''}" 
                                               placeholder="City, Country">
                                    </div>
                                    <div class="form-group">
                                        <label for="profileWebsite">Website</label>
                                        <input type="url" id="profileWebsite" name="website" 
                                               value="${this.userProfile?.website || ''}" 
                                               placeholder="https://yourwebsite.com">
                                    </div>
                                </div>

                                <div class="social-links-section">
                                    <h3>Social Links</h3>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="profileGithub">
                                                <i class="fab fa-github"></i> GitHub
                                            </label>
                                            <input type="text" id="profileGithub" name="github" 
                                                   value="${this.userProfile?.github || ''}" 
                                                   placeholder="github.com/username">
                                        </div>
                                        <div class="form-group">
                                            <label for="profileLinkedin">
                                                <i class="fab fa-linkedin"></i> LinkedIn
                                            </label>
                                            <input type="text" id="profileLinkedin" name="linkedin" 
                                                   value="${this.userProfile?.linkedin || ''}" 
                                                   placeholder="linkedin.com/in/username">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="profileTwitter">
                                            <i class="fab fa-twitter"></i> Twitter
                                        </label>
                                        <input type="text" id="profileTwitter" name="twitter" 
                                               value="${this.userProfile?.twitter || ''}" 
                                               placeholder="twitter.com/username">
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary btn-full" id="saveProfileBtn">
                                    <span class="btn-text">
                                        <i class="fas fa-save"></i> Save Profile
                                    </span>
                                    <span class="btn-loading" style="display: none;">
                                        <i class="fas fa-spinner fa-spin"></i> Saving...
                                    </span>
                                </button>
                            </form>
                        </div>

                        <div class="tab-content" id="account-settings">
                            <div class="settings-section">
                                <h3>Account Security</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Change Password</h4>
                                        <p>Update your password to keep your account secure</p>
                                    </div>
                                    <button class="btn btn-secondary" onclick="profileManager.showChangePasswordForm()">
                                        <i class="fas fa-key"></i> Change Password
                                    </button>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Two-Factor Authentication</h4>
                                        <p>Add an extra layer of security to your account</p>
                                    </div>
                                    <button class="btn btn-secondary" disabled>
                                        <i class="fas fa-shield-alt"></i> Coming Soon
                                    </button>
                                </div>
                            </div>

                            <div class="settings-section">
                                <h3>Preferences</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Email Notifications</h4>
                                        <p>Receive updates about your courses and progress</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="emailNotifications" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Marketing Emails</h4>
                                        <p>Receive information about new courses and offers</p>
                                    </div>
                                    <label class="toggle-switch">
                                        <input type="checkbox" id="marketingEmails">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div class="settings-section danger-zone">
                                <h3>Danger Zone</h3>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <h4>Delete Account</h4>
                                        <p>Permanently delete your account and all associated data</p>
                                    </div>
                                    <button class="btn btn-danger" onclick="profileManager.showDeleteAccountConfirm()">
                                        <i class="fas fa-trash"></i> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" id="learning-stats">
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-book-open"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-number" id="totalEnrolled">0</span>
                                        <span class="stat-label">Courses Enrolled</span>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-trophy"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-number" id="totalCompleted">0</span>
                                        <span class="stat-label">Courses Completed</span>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-number" id="totalHoursLearned">0</span>
                                        <span class="stat-label">Hours Learned</span>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-calendar"></i>
                                    </div>
                                    <div class="stat-info">
                                        <span class="stat-number" id="memberSince">2024</span>
                                        <span class="stat-label">Member Since</span>
                                    </div>
                                </div>
                            </div>

                            <div class="progress-section">
                                <h3>Learning Progress</h3>
                                <div class="progress-chart">
                                    <canvas id="progressChart" width="400" height="200"></canvas>
                                </div>
                            </div>

                            <div class="achievements-section">
                                <h3>Achievements</h3>
                                <div class="achievements-grid">
                                    <div class="achievement-badge earned">
                                        <i class="fas fa-star"></i>
                                        <span>First Course</span>
                                    </div>
                                    <div class="achievement-badge">
                                        <i class="fas fa-fire"></i>
                                        <span>7-Day Streak</span>
                                    </div>
                                    <div class="achievement-badge">
                                        <i class="fas fa-graduation-cap"></i>
                                        <span>Course Master</span>
                                    </div>
                                    <div class="achievement-badge">
                                        <i class="fas fa-rocket"></i>
                                        <span>Fast Learner</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('profileModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = document.getElementById('profileModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Initialize modal functionality
        this.initializeProfileModal();
        this.loadLearningStats();
    }

    initializeProfileModal() {
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

        // Profile form submission
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Close modal functionality
        document.querySelector('[data-modal="profileModal"]').addEventListener('click', () => {
            this.hideProfileModal();
        });

        document.getElementById('profileModal').addEventListener('click', (e) => {
            if (e.target.id === 'profileModal') {
                this.hideProfileModal();
            }
        });
    }

    async saveProfile() {
        const form = document.getElementById('profileForm');
        const formData = new FormData(form);
        const profileData = Object.fromEntries(formData.entries());

        // Set loading state
        this.setLoadingState('saveProfileBtn', true);

        try {
            const { error } = await window.supabaseAuth.supabase
                .from('profiles')
                .upsert({
                    id: this.currentUser.id,
                    full_name: profileData.fullName,
                    email: this.currentUser.email,
                    bio: profileData.bio,
                    location: profileData.location,
                    website: profileData.website,
                    github: profileData.github,
                    linkedin: profileData.linkedin,
                    twitter: profileData.twitter,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            // Update local profile data
            this.userProfile = { ...this.userProfile, ...profileData };

            // Show success message
            window.showNotification('Profile updated successfully!', 'success');

            // Update UI if user name changed
            if (profileData.fullName !== this.userProfile?.full_name) {
                // Profile name updated successfully
                console.log('Profile name updated:', profileData.fullName);
            }

        } catch (error) {
            console.error('Error saving profile:', error);
            window.showNotification('Failed to update profile. Please try again.', 'error');
        } finally {
            this.setLoadingState('saveProfileBtn', false);
        }
    }

    async loadLearningStats() {
        try {
            // Get user enrollments for stats
            const result = await window.supabaseAuth.getUserEnrollments(this.currentUser.id);
            
            if (result.success) {
                const enrollments = result.data || [];
                
                // Update stats
                document.getElementById('totalEnrolled').textContent = enrollments.length;
                document.getElementById('totalCompleted').textContent = enrollments.filter(e => e.progress === 100).length;
                
                // Calculate total hours (this would need course duration data)
                const totalHours = enrollments.length * 40; // Placeholder calculation
                document.getElementById('totalHoursLearned').textContent = totalHours;
                
                // Member since
                const memberSince = new Date(this.currentUser.created_at || Date.now()).getFullYear();
                document.getElementById('memberSince').textContent = memberSince;
            }
        } catch (error) {
            console.error('Error loading learning stats:', error);
        }
    }

    showChangePasswordForm() {
        window.showNotification('Password change feature will be available soon!', 'info');
    }

    showDeleteAccountConfirm() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            window.showNotification('Account deletion feature will be available soon. Please contact support for now.', 'info');
        }
    }

    hideProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    setLoadingState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');

        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline-flex';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }
}

// Initialize profile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.supabaseAuth && window.supabaseAuth.isAuthenticated()) {
        window.profileManager = new ProfileManager();
    }
});

// Also initialize when auth state changes
if (window.supabaseAuth) {
    window.supabaseAuth.supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user && !window.profileManager) {
            window.profileManager = new ProfileManager();
        } else if (event === 'SIGNED_OUT') {
            window.profileManager = null;
        }
    });
}