// Supabase Configuration and Authentication
let supabase = null;
let supabaseLoadError = null;

// Supabase configuration
const supabaseUrl = 'https://wqtmhbsfdtwnbkkbupub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxdG1oYnNmZHR3bmJra2J1cHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjcxMTksImV4cCI6MjA3NzMwMzExOX0.WYsS_L0kF3foaPwR0lXHdgrZ_r9V5qdkkUyI1yzArHs';

// Initialize Supabase client with error handling and fallbacks
async function initializeSupabase() {
    const cdnUrls = [
        'https://cdn.skypack.dev/@supabase/supabase-js',
        'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js',
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js'
    ];
    
    for (let i = 0; i < cdnUrls.length; i++) {
        try {
            console.log(`🔄 Loading Supabase client from CDN ${i + 1}...`);
            
            let createClient;
            // UMD script loading for all CDNs
            await loadScript(cdnUrls[i]);
            
            if (window.supabase && window.supabase.createClient) {
                createClient = window.supabase.createClient;
            } else {
                throw new Error('Supabase createClient not found');
            }
            
            supabase = createClient(supabaseUrl, supabaseKey);
            console.log('✅ Supabase client initialized successfully');
            return true;
            
        } catch (error) {
            console.warn(`⚠️ CDN ${i + 1} failed:`, error.message);
            if (i === cdnUrls.length - 1) {
                console.error('❌ All CDNs failed to load Supabase');
                supabaseLoadError = new Error('Failed to load Supabase from all CDN sources');
                return false;
            }
        }
    }
}

// Helper function to load scripts dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Authentication state management
let currentUser = null;
let authStateInitialized = false;
let lastAuthEvent = null;
let authInitInProgress = false;

// Utility function removed - no dashboard functionality

// Fallback notification function (as window.authManager is external)
function showNotification(message, type = 'info') {
    if (window.authManager) {
        window.authManager.showNotification(message, type);
    } else {
        // Fallback to console and temporary DOM element for debugging the loop
        console.log(`${type.toUpperCase()}: ${message}`);

        let tempNotif = document.createElement('div');
        tempNotif.textContent = message;
        tempNotif.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; border-radius: 5px; background: ' +
            (type === 'success' ? '#4CAF50' : type === 'info' ? '#2196F3' : 'red') +
            '; color: white; z-index: 9999;';
        document.body.appendChild(tempNotif);
        setTimeout(() => tempNotif.remove(), 3000);
    }
}

// --- CORE FIX: Initial authentication and redirection ---
async function initAuth() {
    // Prevent multiple simultaneous initializations
    if (authInitInProgress || authStateInitialized) {
        console.log('Auth initialization already in progress or completed, skipping...');
        return;
    }

    authInitInProgress = true;

    try {
        console.log('🚀 Initializing authentication...');

        // 1. First ensure Supabase is loaded
        if (!supabase) {
            console.log('📦 Supabase not loaded, initializing...');
            const success = await initializeSupabase();
            if (!success) {
                throw new Error('Failed to load Supabase client');
            }
        }

        // 2. Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            clearSupabaseSession();
            currentUser = null;
            updateUIForLoggedOutUser();
            return;
        }

        if (session && session.user) {
            console.log('Valid session found:', session.user.email);
            currentUser = session.user;
            updateUIForLoggedInUser();
        } else {
            console.log('No valid session found');
            currentUser = null;
            updateUIForLoggedOutUser();

            // No dashboard redirect needed
        }

        authStateInitialized = true;
        console.log('Auth initialization complete');
        
        // Set up auth state listener AFTER initialization is complete
        setupAuthStateListener();

    } catch (error) {
        console.error('Error initializing auth:', error);
        clearSupabaseSession();
        currentUser = null;
        updateUIForLoggedOutUser();
        authStateInitialized = true;
        
        // Set up auth state listener even after error
        setupAuthStateListener();
    } finally {
        authInitInProgress = false;
    }
}

// --- Listen for auth state changes (for fresh login/logout events) ---
// TEMPORARILY DISABLED TO DEBUG ALT+TAB REFRESH ISSUE
let authStateChangeListener = null;

function setupAuthStateListener() {
    if (authStateChangeListener) {
        console.log('Auth state listener already set up');
        return;
    }
    
    authStateChangeListener = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'no user');

        // ONLY handle actual login/logout events, ignore everything else
        if (event === 'SIGNED_IN' && session?.user && !currentUser) {
            console.log('Handling fresh login');
            currentUser = session.user;
            updateUIForLoggedInUser();
            showNotification('Successfully logged in!', 'success');
        } else if (event === 'SIGNED_OUT' && currentUser) {
            console.log('Handling logout');
            currentUser = null;
            updateUIForLoggedOutUser();
            showNotification('Successfully logged out!', 'info');
            
            // No dashboard redirect needed
        } else {
            console.log('Ignoring auth state change:', event);
        }
    });
}

// Update UI based on authentication state
function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');

    if (loginBtn && signupBtn) {
        // Find existing elements to prevent duplicates
        const existingUserMenu = document.querySelector('.user-menu');

        // Remove existing elements if they somehow duplicated
        if (existingUserMenu) existingUserMenu.remove();

        // Remove existing login/signup buttons
        if (loginBtn.parentElement) loginBtn.parentElement.remove();
        if (signupBtn.parentElement) signupBtn.parentElement.remove();

        // Add user menu
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return; // Guard against missing nav

        const userEmail = currentUser.email;
        const userName = currentUser.user_metadata?.full_name || userEmail.split('@')[0];

        const userMenuHTML = `
            <li class="user-menu">
                <div class="user-dropdown">
                    <button class="user-btn">
                        <i class="fas fa-user-circle"></i>
                        <span>${userName}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a href="#" class="dropdown-item" id="profile-link">
                            <i class="fas fa-user"></i> Profile
                        </a>
                        <a href="#" class="dropdown-item" id="my-courses-link">
                            <i class="fas fa-book"></i> My Courses
                        </a>
                        <a href="#" class="dropdown-item" id="settings-link">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                        <hr class="dropdown-divider">
                        <a href="#" class="dropdown-item" id="logout-link">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            </li>
        `;

        navMenu.insertAdjacentHTML('beforeend', userMenuHTML);

        // Add dropdown functionality
        setupUserDropdown();
    }
}

function updateUIForLoggedOutUser() {
    console.log('🔄 updateUIForLoggedOutUser called');
    const userMenu = document.querySelector('.user-menu');

    // Remove logged-in elements
    if (userMenu) {
        console.log('Removing user menu');
        userMenu.remove();
    }

    // Check if login/signup buttons already exist before re-adding
    const existingLoginBtn = document.querySelector('.btn-login');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Existing login button:', !!existingLoginBtn);
    console.log('Nav menu exists:', !!navMenu);

    if (!existingLoginBtn && navMenu) {
        console.log('Adding login/signup buttons...');

        // Re-add login/signup buttons
        const authButtonsHTML = `
            <li><a href="#" class="btn-login">Login</a></li>
            <li><a href="#" class="btn-signup">Sign Up</a></li>
        `;

        navMenu.insertAdjacentHTML('beforeend', authButtonsHTML);

        // Wait a moment for DOM to update
        setTimeout(() => {
            const loginBtn = document.querySelector('.btn-login');
            const signupBtn = document.querySelector('.btn-signup');

            console.log('Login button found:', !!loginBtn);
            console.log('Signup button found:', !!signupBtn);

            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 Login button clicked!');
                    console.log('window.showModal exists:', typeof window.showModal);
                    console.log('window.authManager exists:', !!window.authManager);
                    
                    // Try window.showModal first (most reliable)
                    if (typeof window.showModal === 'function') {
                        console.log('Using window.showModal');
                        window.showModal('loginModal');
                    } else if (window.authManager && typeof window.authManager.showLoginModal === 'function') {
                        console.log('Using window.authManager.showLoginModal');
                        window.authManager.showLoginModal();
                    } else {
                        // Fallback: directly show the modal
                        console.log('Using direct DOM manipulation');
                        const modal = document.getElementById('loginModal');
                        if (modal) {
                            modal.style.display = 'flex';
                            modal.style.alignItems = 'center';
                            modal.style.justifyContent = 'center';
                            modal.classList.add('show');
                            document.body.style.overflow = 'hidden';
                            console.log('✅ Modal shown via direct manipulation');
                        } else {
                            console.error('❌ Login modal not found in DOM!');
                        }
                    }
                });
                console.log('✅ Login button event listener attached');
            } else {
                console.error('❌ Login button not found after adding!');
            }

            if (signupBtn) {
                signupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 Signup button clicked!');
                    
                    // Try window.showModal first (most reliable)
                    if (typeof window.showModal === 'function') {
                        console.log('Using window.showModal');
                        window.showModal('signupModal');
                    } else if (window.authManager && typeof window.authManager.showSignupModal === 'function') {
                        console.log('Using window.authManager.showSignupModal');
                        window.authManager.showSignupModal();
                    } else {
                        // Fallback: directly show the modal
                        console.log('Using direct DOM manipulation');
                        const modal = document.getElementById('signupModal');
                        if (modal) {
                            modal.style.display = 'flex';
                            modal.style.alignItems = 'center';
                            modal.style.justifyContent = 'center';
                            modal.classList.add('show');
                            document.body.style.overflow = 'hidden';
                            console.log('✅ Modal shown via direct manipulation');
                        } else {
                            console.error('❌ Signup modal not found in DOM!');
                        }
                    }
                });
                console.log('✅ Signup button event listener attached');
            } else {
                console.error('❌ Signup button not found after adding!');
            }

            console.log('✅ All buttons re-added and event listeners attached');
        }, 100); // Small delay to ensure DOM is updated
    } else {
        console.log('Buttons already exist or nav menu not found');
    }
}

// Dashboard navigation removed

// Setup user dropdown functionality
function setupUserDropdown() {
    const userBtn = document.querySelector('.user-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (!userBtn || !dropdownContent) return;

    userBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            dropdownContent.classList.remove('show');
        }
    });

    document.getElementById('profile-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showProfileModal();
    });

    document.getElementById('my-courses-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showMyCoursesModal();
    });

    document.getElementById('settings-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsModal();
    });

    document.getElementById('logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
}

// Authentication functions
async function signUpUser(email, password, fullName) {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        if (data.user) { await saveUserProfile(data.user.id, fullName, email); }
        return { success: true, data };
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
    }
}

async function signInUser(email, password) {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password });
        
        if (error) {
            // Provide user-friendly error messages
            let errorMessage = error.message;
            
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Please verify your email address before logging in.';
            } else if (error.message.includes('User not found')) {
                errorMessage = 'No account found with this email address. Please sign up first.';
            } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Please enter a valid email address.';
            }
            
            throw new Error(errorMessage);
        }
        
        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

async function resetPassword(email) {
    try {
        // Determine the correct redirect URL based on environment
        let redirectUrl;
        
        if (window.location.hostname === 'jasper-ace.github.io') {
            // Production GitHub Pages URL - detect the correct path
            const currentPath = window.location.pathname;
            let basePath = '';
            
            if (currentPath.includes('/final/IAS/')) {
                basePath = '/final/IAS';
            } else if (currentPath.includes('/IAS/')) {
                basePath = '/IAS';
            } else {
                // Fallback - extract base path dynamically
                const pathParts = currentPath.split('/');
                pathParts.pop(); // Remove current page
                basePath = pathParts.join('/');
            }
            
            redirectUrl = `https://jasper-ace.github.io${basePath}/reset-password.html`;
            console.log('GitHub Pages redirect URL:', redirectUrl);
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Local development - use the exact current URL structure
            const port = window.location.port;
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const currentPath = window.location.pathname;
            
            // Extract the base path (everything before the current page)
            const pathParts = currentPath.split('/');
            pathParts.pop(); // Remove current page
            const basePath = pathParts.join('/');
            
            redirectUrl = `${protocol}//${hostname}:${port}${basePath}/reset-password.html`;
            console.log('Local development redirect URL constructed:', redirectUrl);
        } else {
            // Fallback - try to construct from current location
            const currentPath = window.location.pathname;
            const basePath = currentPath.includes('/IAS/') ? '/IAS' : '';
            redirectUrl = window.location.origin + basePath + '/reset-password.html';
        }
        
        console.log('Reset password redirect URL:', redirectUrl);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, { 
            redirectTo: redirectUrl 
        });
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
    }
}

async function handleLogout() {
    // Show confirmation dialog (custom modal if available, otherwise browser confirm)
    let confirmed = false;
    
    if (window.confirmLogout) {
        // Use custom modal
        confirmed = await window.confirmLogout();
    } else {
        // Fallback to browser confirm
        confirmed = confirm('Are you sure you want to logout?');
    }
    
    if (!confirmed) {
        console.log('Logout cancelled by user');
        return;
    }

    try {
        console.log('Attempting to log out...');
        showNotification('Logging out...', 'info');
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Supabase logout error:', error);
        }

        clearSupabaseSession();
        currentUser = null;
        updateUIForLoggedOutUser();

        showNotification('Successfully logged out!', 'success');

        // No dashboard redirect needed

    } catch (error) {
        console.error('Logout error details:', error);
        clearSupabaseSession();
        currentUser = null;
        updateUIForLoggedOutUser();
        const errorMessage = error.message || 'Unknown error occurred during logout';
        showNotification(`Logout completed with warnings: ${errorMessage}`, 'warning');
        // No dashboard redirect needed
    }
}

function clearSupabaseSession() {
    try {
        console.log('Clearing Supabase session data...');
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sb-')) { keysToRemove.push(key); }
        }
        keysToRemove.forEach(key => { localStorage.removeItem(key); console.log(`Removed localStorage key: ${key}`); });

        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('sb-')) { sessionKeysToRemove.push(key); }
        }
        sessionKeysToRemove.forEach(key => { sessionStorage.removeItem(key); console.log(`Removed sessionStorage key: ${key}`); });

        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
        console.log('Session data cleared successfully');
    } catch (error) {
        console.error('Error clearing session data:', error);
    }
}

// Database functions
async function saveUserProfile(userId, fullName, email) {
    try {
        const { error } = await supabase.from('profiles').upsert({ id: userId, full_name: fullName, email: email, created_at: new Date().toISOString() });
        if (error) throw error;
    } catch (error) {
        console.error('Error saving profile:', error);
    }
}

// Save account/billing information
async function saveAccount(userId, accountData) {
    try {
        console.log('💾 saveAccount called with:', { userId, accountData });
        
        // Try to get Supabase client from different sources
        let supabaseClient = supabase;
        
        if (!supabaseClient && window.supabaseDirect) {
            supabaseClient = window.supabaseDirect;
            console.log('🔄 Using direct Supabase client');
        }
        
        if (!supabaseClient && window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
            console.log('🔄 Creating new Supabase client');
        }
        
        if (!supabaseClient) {
            console.error('❌ Supabase client not available in saveAccount');
            throw new Error('Supabase client not initialized');
        }
        
        const accountRecord = {
            user_id: userId,
            full_name: accountData.fullName,
            email: accountData.email,
            address: accountData.address,
            city: accountData.city,
            state: accountData.state,
            zip_code: accountData.zipCode,
            card_last_four: accountData.cardLastFour, 
            card_expiry: accountData.cardExpiry,
            card_type: accountData.cardType,
            cvv: accountData.cvv
        };
        
        console.log('📝 Inserting new account record for transaction:', accountRecord);
        
        // Always insert a new record for each transaction
        const { data, error } = await supabaseClient
            .from('accounts')
            .insert([accountRecord])
            .select();
            
        if (error) {
            console.error('❌ Database insert error:', error);
            throw error;
        }
        
        console.log('✅ Account saved to database:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error saving account:', error);
        return { success: false, error: error.message };
    }
}

// Make saveAccount immediately available for testing
if (typeof window !== 'undefined') {
    window.saveAccountDirect = saveAccount;
    
    // Initialize direct Supabase client as fallback
    if (!window.supabaseDirect) {
        setTimeout(async () => {
            try {
                if (window.supabase && window.supabase.createClient) {
                    window.supabaseDirect = window.supabase.createClient(supabaseUrl, supabaseKey);
                    console.log('🔄 Fallback Supabase client initialized');
                }
            } catch (error) {
                console.warn('⚠️ Could not initialize fallback Supabase client:', error);
            }
        }, 1000);
    }
}

async function saveEnrollment(userId, courseName, coursePrice, paymentData) {
    try {
        console.log('💾 saveEnrollment called with:', { userId, courseName, coursePrice, paymentData });
        
        if (!supabase) {
            console.error('❌ Supabase client not available in saveEnrollment');
            throw new Error('Supabase client not initialized');
        }
        
        const enrollmentRecord = {
            user_id: userId,
            course_name: courseName,
            course_price: coursePrice,
            payment_data: paymentData,
            enrolled_at: new Date().toISOString(),
            status: 'active'
        };
        
        console.log('📝 Inserting enrollment record:', enrollmentRecord);
        
        const { data, error } = await supabase
            .from('enrollments')
            .insert([enrollmentRecord])
            .select();
            
        if (error) {
            console.error('❌ Database insert error:', error);
            throw error;
        }
        
        console.log('✅ Enrollment saved to database:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error saving enrollment:', error);
        return { success: false, error: error.message };
    }
}

async function getUserEnrollments(userId) {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }
        
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('enrolled_at', { ascending: false });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        return { success: false, error: error.message };
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

function getCurrentUser() {
    return currentUser;
}

async function validateSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            console.log('Session validation failed, logging out...');
            currentUser = null;
            clearSupabaseSession();
            updateUIForLoggedOutUser();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        currentUser = null;
        clearSupabaseSession();
        updateUIForLoggedOutUser();
        return false;
    }
}

// Modal functions for user menu
function showProfileModal() { 
    if (window.profileManager) {
        window.profileManager.showProfileModal();
    } else {
        showNotification('Profile feature loading...', 'info');
    }
}

function showMyCoursesModal() { 
    window.location.href = 'my-courses.html';
}

function showSettingsModal() { 
    if (window.settingsManager) {
        window.settingsManager.showSettingsModal();
    } else {
        showNotification('Settings feature loading...', 'info');
    }
}
function showLoginModal() { if (window.authManager) { window.authManager.showLoginModal(); } }
function showSignupModal() { if (window.authManager) { window.authManager.showSignupModal(); } }

function forceLogout() {
    console.log('Force logout initiated');
    clearSupabaseSession();
    currentUser = null;
    updateUIForLoggedOutUser();
    showNotification('Session forcefully cleared. You have been logged out.', 'info');
    // No dashboard redirect needed
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Export functions for global use
window.supabaseAuth = {
    initAuth,
    signUpUser,
    signInUser,
    resetPassword,
    handleLogout,
    forceLogout,
    validateSession,
    clearSupabaseSession,
    saveAccount,
    saveEnrollment,
    getUserEnrollments,
    isAuthenticated,
    getCurrentUser,
    supabase,
    // Add status indicators
    get isReady() {
        return authStateInitialized && !authInitInProgress && supabase !== null;
    },
    get isInitializing() {
        return authInitInProgress;
    },
    get hasError() {
        return supabaseLoadError !== null;
    },
    get error() {
        return supabaseLoadError;
    }
};

// Make modal functions globally available
window.showProfileModal = showProfileModal;
window.showMyCoursesModal = showMyCoursesModal;
window.showSettingsModal = showSettingsModal;
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.showNotification = showNotification;

// Dashboard navigation removed

// Debug function to test Supabase connection
window.testSupabaseConnection = async function() {
    console.log('Testing Supabase connection...');
    console.log('Supabase client:', supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
        const { data, error } = await supabase.auth.getSession();
        console.log('Session check result:', { data, error });
        
        if (error) {
            console.error('Supabase connection error:', error);
        } else {
            console.log('Supabase connection successful');
        }
    } catch (error) {
        console.error('Supabase test failed:', error);
    }
};

// Initialize authentication when DOM loads (more reliable)
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM loaded, initializing auth system...');
    await initAuth();
});

// Also try immediate initialization if DOM is already ready
if (document.readyState !== 'loading') {
    console.log('📄 DOM already ready, initializing auth system...');
    initAuth();
}

// Prevent refresh on visibility change (Alt+Tab issue fix)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Page became visible, but NOT re-initializing auth to prevent refresh');
        // Don't call initAuth() here - this was causing the refresh issue
    } else {
        console.log('Page became hidden (Alt+Tab away)');
    }
});

// Debug: Track page load/refresh
console.log('🔄 PAGE LOADED/REFRESHED at:', new Date().toLocaleTimeString());
window.addEventListener('beforeunload', () => {
    console.log('🚪 PAGE UNLOADING at:', new Date().toLocaleTimeString());
});

// Debug: Track focus events
window.addEventListener('focus', () => {
    console.log('🎯 WINDOW FOCUSED at:', new Date().toLocaleTimeString());
});

window.addEventListener('blur', () => {
    console.log('😴 WINDOW BLURRED at:', new Date().toLocaleTimeString());
});