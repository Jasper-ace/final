// Authentication JavaScript
class AuthManager {
    constructor() {
        this.waitForSupabaseAuth().then(() => {
            // Modals are now inline in HTML, just initialize them
            this.initializeModalEventListeners();
            this.initializeEventListeners();
        });
    }

    // Wait for Supabase auth to be available
    async waitForSupabaseAuth() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabaseAuth && window.supabaseAuth.supabase) {
                    console.log('✅ Supabase auth is ready');
                    resolve();
                } else {
                    console.log('⏳ Waiting for Supabase auth...');
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    }

    // Load auth modals into the page
    async loadAuthModals() {
        try {
            console.log('Loading auth modals...');
            const response = await fetch('auth-modals.html');
            
            if (!response.ok) {
                throw new Error(`Failed to load auth modals: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Create a container for modals if it doesn't exist
            let modalContainer = document.getElementById('auth-modals');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'auth-modals';
                document.body.appendChild(modalContainer);
            }
            
            modalContainer.innerHTML = html;
            console.log('✅ Auth modals loaded successfully');
            
            // Initialize modal event listeners after loading
            this.initializeModalEventListeners();
        } catch (error) {
            console.error('❌ Error loading auth modals:', error);
            // Fallback: create basic modals inline
            this.createFallbackModals();
        }
    }

    // Load auth modals into the page
    async loadAuthModals() {
        try {
            const response = await fetch('auth-modals.html');
            const html = await response.text();
            
            // Create a container for modals if it doesn't exist
            let modalContainer = document.getElementById('auth-modals');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'auth-modals';
                document.body.appendChild(modalContainer);
            }
            
            modalContainer.innerHTML = html;
            this.initializeModalEventListeners();
        } catch (error) {
            console.error('Error loading auth modals:', error);
        }
    }

    // Create fallback modals if loading fails
    createFallbackModals() {
        console.log('Creating fallback auth modals...');
        const modalHTML = `
            <div id="loginModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Welcome Back</h2>
                        <span class="close" data-modal="loginModal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm" class="auth-form">
                            <div class="form-group">
                                <label for="loginEmail">Email Address</label>
                                <input type="email" id="loginEmail" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <input type="password" id="loginPassword" name="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full" id="loginBtn">
                                <span class="btn-text">Sign In</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Signing in...
                                </span>
                            </button>
                            <div class="auth-switch">
                                <p>Don't have an account? <a href="#" id="switchToSignup">Sign up here</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <div id="signupModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Create Your Account</h2>
                        <span class="close" data-modal="signupModal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="signupForm" class="auth-form">
                            <div class="form-group">
                                <label for="signupFullName">Full Name</label>
                                <input type="text" id="signupFullName" name="fullName" required>
                            </div>
                            <div class="form-group">
                                <label for="signupEmail">Email Address</label>
                                <input type="email" id="signupEmail" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="signupPassword">Password</label>
                                <input type="password" id="signupPassword" name="password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full" id="signupBtn">
                                <span class="btn-text">Create Account</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Creating account...
                                </span>
                            </button>
                            <div class="auth-switch">
                                <p>Already have an account? <a href="#" id="switchToLogin">Sign in here</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <div id="notification" class="notification">
                <div class="notification-content">
                    <i class="notification-icon"></i>
                    <span class="notification-message"></span>
                    <button class="notification-close">&times;</button>
                </div>
            </div>
        `;
        
        let modalContainer = document.getElementById('auth-modals');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'auth-modals';
            document.body.appendChild(modalContainer);
        }
        
        modalContainer.innerHTML = modalHTML;
        console.log('✅ Fallback auth modals created');
        
        // Initialize modal event listeners
        this.initializeModalEventListeners();
    }

    // Initialize modal event listeners
    initializeModalEventListeners() {
        console.log('Initializing modal event listeners...');
        
        // Close modal events (both .close and .modal-close)
        document.querySelectorAll('.close, .modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = e.target.getAttribute('data-modal') || 
                               e.target.closest('button').getAttribute('data-modal');
                if (modalId) {
                    this.hideModal(modalId);
                }
            });
        });

        // Click on modal overlay to close
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Click outside modal content to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Form submissions
        this.initializeLoginForm();
        this.initializeSignupForm();
        this.initializeForgotPasswordForm();

        // Modal switching
        this.initializeModalSwitching();

        // Password toggle functionality
        this.initializePasswordToggles();

        // Password strength checker
        this.initializePasswordStrength();
    }

    // Initialize password toggles
    initializePasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = toggle.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (passwordInput && passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else if (passwordInput) {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // Initialize password strength checker
    initializePasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthUI(strength);
        });
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        return score;
    }

    updatePasswordStrengthUI(strength) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;

        // Remove all strength classes
        strengthFill.className = 'strength-fill';
        
        switch (strength) {
            case 0:
            case 1:
                strengthFill.classList.add('weak');
                strengthText.textContent = 'Weak password';
                break;
            case 2:
                strengthFill.classList.add('fair');
                strengthText.textContent = 'Fair password';
                break;
            case 3:
            case 4:
                strengthFill.classList.add('good');
                strengthText.textContent = 'Good password';
                break;
            case 5:
                strengthFill.classList.add('strong');
                strengthText.textContent = 'Strong password';
                break;
        }
    }

    // Initialize modal switching
    initializeModalSwitching() {
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const backToLogin = document.getElementById('backToLogin');

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.showSignupModal();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('signupModal');
                this.showLoginModal();
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.showForgotPasswordModal();
            });
        }

        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('forgotPasswordModal');
                this.showLoginModal();
            });
        }
    }

    // Show login modal
    showLoginModal() {
        console.log('Showing login modal');
        this.showModal('loginModal');
    }

    // Show signup modal
    showSignupModal() {
        console.log('Showing signup modal');
        this.showModal('signupModal');
    }

    showForgotPasswordModal() {
        console.log('Showing forgot password modal');
        this.showModal('forgotPasswordModal');
    }

    // Initialize forgot password form
    initializeForgotPasswordForm() {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (!forgotForm) return;

        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value.trim();
            
            // Clear previous errors
            this.clearFieldErrors(['resetEmailError']);
            
            if (!this.validateEmail(email)) {
                this.showFieldError('resetEmailError', 'Please enter a valid email address.');
                return;
            }

            this.setLoadingState('resetBtn', true);
            
            try {
                // Wait for supabaseAuth to be fully ready
                await this.ensureSupabaseAuthReady();
                
                const result = await window.supabaseAuth.resetPassword(email);
                
                if (result.success) {
                    this.hideModal('forgotPasswordModal');
                    this.showSuccessModal(
                        'Reset Link Sent!',
                        'We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.'
                    );
                    forgotForm.reset();
                } else {
                    this.showNotification(result.error || 'Failed to send reset email. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Password reset error:', error);
                this.showNotification(`Password reset error: ${error.message || 'An unexpected error occurred. Please try again.'}`, 'error');
            } finally {
                this.setLoadingState('resetBtn', false);
            }
        });
    }

    // Show modal helper
    showModal(modalId) {
        console.log(`🎯 Attempting to show modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        
        if (modal) {
            console.log(`✅ Modal found: ${modalId}`);
            console.log('Modal element:', modal);
            console.log('Modal current classes:', modal.className);
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            console.log('Modal classes after adding show:', modal.className);
            console.log('Modal should now be visible');
            
            // Double check if modal is visible
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(modal);
                console.log('Modal display style:', computedStyle.display);
                console.log('Modal visibility:', computedStyle.visibility);
            }, 100);
        } else {
            console.error(`❌ Modal not found: ${modalId}`);
            console.log('Available modals:', 
                Array.from(document.querySelectorAll('.modal')).map(m => m.id));
        }
    }

    // Hide modal helper
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            console.log(`Closing modal: ${modalId}`);
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Clear form data and errors
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachNavEventListeners();
            });
        } else {
            this.attachNavEventListeners();
        }
    }

    // Attach event listeners to navigation buttons
    attachNavEventListeners() {
        console.log('Attaching navigation event listeners...');
        
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');

        console.log('Login button found:', !!loginBtn);
        console.log('Signup button found:', !!signupBtn);
        
        if (loginBtn) {
            console.log('Login button element:', loginBtn);
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔥 LOGIN BUTTON CLICKED!');
                console.log('Event:', e);
                this.showLoginModal();
            });
            
            // Also add a test click listener
            loginBtn.addEventListener('mousedown', () => {
                console.log('Login button mouse down detected');
            });
        } else {
            console.error('❌ Login button not found!');
        }

        if (signupBtn) {
            console.log('Signup button element:', signupBtn);
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔥 SIGNUP BUTTON CLICKED!');
                console.log('Event:', e);
                this.showSignupModal();
            });
            
            // Also add a test click listener
            signupBtn.addEventListener('mousedown', () => {
                console.log('Signup button mouse down detected');
            });
        } else {
            console.error('❌ Signup button not found!');
        }
    }

    // Attach event listeners to navigation buttons
    attachNavEventListeners() {
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-signup');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupModal();
            });
        }
    }

    // Initialize modal event listeners
    initializeModalEventListeners() {
        // Close modal events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modalId = e.target.getAttribute('data-modal');
                this.hideModal(modalId);
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Form submissions
        this.initializeLoginForm();
        this.initializeSignupForm();
        this.initializeForgotPasswordForm();

        // Modal switching
        this.initializeModalSwitching();

        // Password visibility toggles
        this.initializePasswordToggles();

        // Password strength checker
        this.initializePasswordStrength();

        // Success modal
        this.initializeSuccessModal();
    }

    // Initialize login form
    initializeLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!this.validateLoginForm(email, password)) {
                return;
            }

            this.setLoadingState('loginBtn', true);
            
            try {
                console.log('Attempting login with:', email);
                
                // Wait for supabaseAuth to be fully ready
                await this.ensureSupabaseAuthReady();
                
                const result = await window.supabaseAuth.signInUser(email, password);
                console.log('Login result:', result);
                
                if (result.success) {
                    // Clear any previous error styling
                    document.getElementById('loginEmail').classList.remove('input-error');
                    document.getElementById('loginPassword').classList.remove('input-error');
                    
                    this.hideModal('loginModal');
                    this.showNotification('Welcome back! You have been successfully logged in.', 'success');
                    loginForm.reset();
                    
                    // Login successful - stay on current page
                } else {
                    console.error('Login failed:', result.error);
                    
                    // Add error styling to inputs
                    document.getElementById('loginEmail').classList.add('input-error');
                    document.getElementById('loginPassword').classList.add('input-error');
                    
                    // Show user-friendly error message
                    this.showNotification(result.error || 'Login failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Login error details:', error);
                
                // Add error styling to inputs
                document.getElementById('loginEmail').classList.add('input-error');
                document.getElementById('loginPassword').classList.add('input-error');
                
                this.showNotification(`Login error: ${error.message || 'Authentication system not ready. Please try again.'}`, 'error');
            } finally {
                this.setLoadingState('loginBtn', false);
            }
        });
    }

    // Ensure Supabase auth is fully ready before proceeding
    async ensureSupabaseAuthReady() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 10 seconds max wait
            
            const checkAuth = () => {
                attempts++;
                
                // Check if there's an error
                if (window.supabaseAuth && window.supabaseAuth.hasError) {
                    console.error('❌ Supabase auth has error:', window.supabaseAuth.error);
                    reject(new Error(`Authentication system error: ${window.supabaseAuth.error.message}`));
                    return;
                }
                
                // Check if fully ready
                if (window.supabaseAuth && window.supabaseAuth.isReady) {
                    console.log('✅ Supabase auth is fully ready');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.error('❌ Supabase auth failed to initialize within timeout');
                    
                    // Provide more detailed error information
                    let errorDetails = 'Unknown error';
                    if (!window.supabaseAuth) {
                        errorDetails = 'supabaseAuth object not found';
                    } else if (!window.supabaseAuth.supabase) {
                        errorDetails = 'Supabase client not initialized';
                    } else if (!window.supabaseAuth.signInUser) {
                        errorDetails = 'signInUser function not available';
                    }
                    
                    reject(new Error(`Authentication system timeout: ${errorDetails}. Please refresh the page.`));
                } else {
                    console.log(`⏳ Waiting for Supabase auth... (attempt ${attempts}/${maxAttempts})`);
                    if (window.supabaseAuth) {
                        console.log(`   - isReady: ${window.supabaseAuth.isReady}`);
                        console.log(`   - isInitializing: ${window.supabaseAuth.isInitializing}`);
                        console.log(`   - hasError: ${window.supabaseAuth.hasError}`);
                    }
                    setTimeout(checkAuth, 100);
                }
            };
            
            checkAuth();
        });
    }

    // Initialize signup form
    initializeSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('signupFullName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            if (!this.validateSignupForm(fullName, email, password, confirmPassword, agreeTerms)) {
                return;
            }

            this.setLoadingState('signupBtn', true);
            
            try {
                // Wait for supabaseAuth to be fully ready
                await this.ensureSupabaseAuthReady();
                
                const result = await window.supabaseAuth.signUpUser(email, password, fullName);
                
                if (result.success) {
                    this.hideModal('signupModal');
                    this.showSuccessModal(
                        'Account Created Successfully!',
                        'Welcome to CodeMaster Academy! Please check your email to verify your account.'
                    );
                    signupForm.reset();
                } else {
                    this.showNotification(result.error || 'Signup failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                this.showNotification(`Signup error: ${error.message || 'Authentication system not ready. Please try again.'}`, 'error');
            } finally {
                this.setLoadingState('signupBtn', false);
            }
        });
    }

    // Initialize forgot password form
    initializeForgotPasswordForm() {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (!forgotForm) return;

        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value.trim();
            
            if (!this.validateEmail(email)) {
                this.showFieldError('resetEmailError', 'Please enter a valid email address.');
                return;
            }

            this.setLoadingState('resetBtn', true);
            
            try {
                const result = await window.supabaseAuth.resetPassword(email);
                
                if (result.success) {
                    this.hideModal('forgotPasswordModal');
                    this.showSuccessModal(
                        'Reset Link Sent!',
                        'We have sent a password reset link to your email address. Please check your inbox.'
                    );
                    forgotForm.reset();
                } else {
                    this.showNotification(result.error || 'Failed to send reset email. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Password reset error:', error);
                this.showNotification('An unexpected error occurred. Please try again.', 'error');
            } finally {
                this.setLoadingState('resetBtn', false);
            }
        });
    }

    // Initialize modal switching
    initializeModalSwitching() {
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const backToLogin = document.getElementById('backToLogin');

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.showSignupModal();
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('signupModal');
                this.showLoginModal();
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.showForgotPasswordModal();
            });
        }

        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('forgotPasswordModal');
                this.showLoginModal();
            });
        }
    }

    // Initialize password toggles
    initializePasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = toggle.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    // Initialize password strength checker
    initializePasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrengthUI(strength);
        });
    }

    // Initialize success modal
    initializeSuccessModal() {
        const successOkBtn = document.getElementById('successOkBtn');
        if (successOkBtn) {
            successOkBtn.addEventListener('click', () => {
                this.hideModal('successModal');
            });
        }
    }

    // Validation methods
    validateLoginForm(email, password) {
        let isValid = true;

        // Clear previous errors
        this.clearFieldErrors(['loginEmailError', 'loginPasswordError']);

        if (!this.validateEmail(email)) {
            this.showFieldError('loginEmailError', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!password || password.length < 6) {
            this.showFieldError('loginPasswordError', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        return isValid;
    }

    validateSignupForm(fullName, email, password, confirmPassword, agreeTerms) {
        let isValid = true;

        // Clear previous errors
        this.clearFieldErrors(['signupFullNameError', 'signupEmailError', 'signupPasswordError', 'confirmPasswordError']);

        if (!fullName || fullName.length < 2) {
            this.showFieldError('signupFullNameError', 'Please enter your full name (at least 2 characters).');
            isValid = false;
        }

        if (!this.validateEmail(email)) {
            this.showFieldError('signupEmailError', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!password || password.length < 6) {
            this.showFieldError('signupPasswordError', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showFieldError('confirmPasswordError', 'Passwords do not match.');
            isValid = false;
        }

        if (!agreeTerms) {
            this.showNotification('Please agree to the Terms of Service and Privacy Policy.', 'error');
            isValid = false;
        }

        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        return score;
    }

    updatePasswordStrengthUI(strength) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;

        // Remove all strength classes
        strengthFill.className = 'strength-fill';
        
        switch (strength) {
            case 0:
            case 1:
                strengthFill.classList.add('weak');
                strengthText.textContent = 'Weak password';
                break;
            case 2:
                strengthFill.classList.add('fair');
                strengthText.textContent = 'Fair password';
                break;
            case 3:
            case 4:
                strengthFill.classList.add('good');
                strengthText.textContent = 'Good password';
                break;
            case 5:
                strengthFill.classList.add('strong');
                strengthText.textContent = 'Strong password';
                break;
        }
    }

    // UI Helper methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Clear form data and errors
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                this.clearAllFieldErrors(modal);
            }
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showSignupModal() {
        this.showModal('signupModal');
    }

    showForgotPasswordModal() {
        this.showModal('forgotPasswordModal');
    }

    showSuccessModal(title, message) {
        const titleEl = document.getElementById('successTitle');
        const messageEl = document.getElementById('successMessage');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        this.showModal('successModal');
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
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    showFieldError(errorId, message) {
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    clearFieldErrors(errorIds) {
        errorIds.forEach(errorId => {
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('show');
            }
        });
    }

    clearAllFieldErrors(container) {
        const errorElements = container.querySelectorAll('.error-message');
        errorElements.forEach(errorEl => {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        if (!notification || !messageEl || !iconEl) return;

        // Set message
        messageEl.textContent = message;
        
        // Set icon based on type
        let iconClass = 'fas fa-info-circle';
        switch (type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
        }
        iconEl.className = `notification-icon ${iconClass}`;
        
        // Set notification type class
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.onclick = () => this.hideNotification();
        }
    }

    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }
}

// Initialize auth manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating AuthManager...');
    window.authManager = new AuthManager();
    
    // Add immediate test
    setTimeout(() => {
        console.log('Testing modal setup...');
        console.log('Login modal exists:', !!document.getElementById('loginModal'));
        console.log('Signup modal exists:', !!document.getElementById('signupModal'));
        console.log('Login button exists:', !!document.querySelector('.btn-login'));
        console.log('Signup button exists:', !!document.querySelector('.btn-signup'));
    }, 1000);
});

// Also initialize if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, creating AuthManager...');
    window.authManager = new AuthManager();
    
    // Add immediate test
    setTimeout(() => {
        console.log('Testing modal setup...');
        console.log('Login modal exists:', !!document.getElementById('loginModal'));
        console.log('Signup modal exists:', !!document.getElementById('signupModal'));
        console.log('Login button exists:', !!document.querySelector('.btn-login'));
        console.log('Signup button exists:', !!document.querySelector('.btn-signup'));
    }, 1000);
}

// Debug function to manually test modals
window.testLoginModal = function() {
    console.log('Manual test: Opening login modal...');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Login modal should be visible now');
    } else {
        console.error('Login modal not found!');
    }
};

window.testSignupModal = function() {
    console.log('Manual test: Opening signup modal...');
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Signup modal should be visible now');
    } else {
        console.error('Signup modal not found!');
    }
};

window.closeAllModals = function() {
    console.log('Closing all modals...');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
};

// Debug function to test modals
window.testModals = function() {
    console.log('Testing modals...');
    console.log('Login modal exists:', !!document.getElementById('loginModal'));
    console.log('Signup modal exists:', !!document.getElementById('signupModal'));
    console.log('AuthManager exists:', !!window.authManager);
    
    if (window.authManager) {
        console.log('Testing login modal...');
        window.authManager.showLoginModal();
    }
};