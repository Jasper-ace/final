// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Course enrollment functionality
document.querySelectorAll('.btn-primary').forEach(button => {
    if (button.textContent.includes('Enroll Now')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if user is authenticated before showing enrollment modal
            if (window.supabaseAuth && window.supabaseAuth.isAuthenticated()) {
                showEnrollmentModal(button.closest('.course-card'));
            } else {
                showAuthRequiredModal('enroll', button.closest('.course-card'));
            }
        });
    }
});

// Login button functionality
document.querySelector('.btn-login').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginModal();
});

// Sign up button functionality
document.querySelector('.btn-signup').addEventListener('click', (e) => {
    e.preventDefault();
    showSignupModal();
});

// Free trial button functionality
document.querySelector('.btn.btn-secondary').addEventListener('click', (e) => {
    e.preventDefault();
    // Check if user is authenticated before showing free trial
    if (window.supabaseAuth && window.supabaseAuth.isAuthenticated()) {
        showFreeTrialModal();
    } else {
        showAuthRequiredModal('trial');
    }
});

// View all courses button functionality
document.querySelector('.btn-outline').addEventListener('click', (e) => {
    e.preventDefault();
    showAllCoursesModal();
});

// Social media links functionality
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i').classList[1].split('-')[1];
        showNotification(`Redirecting to ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
        // In a real app, you would redirect to actual social media pages
        setTimeout(() => {
            window.open(`https://${platform}.com/codemasteracademy`, '_blank');
        }, 1000);
    });
});

// Footer links functionality
document.querySelectorAll('.footer-section ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkText = link.textContent;
        showNotification(`Opening ${linkText} page...`, 'info');
        // In a real app, these would navigate to actual pages
    });
});

// Course category links in footer
document.querySelectorAll('.footer-section:nth-child(2) ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const course = link.textContent;
        showCourseFilterModal(course);
    });
});

// Enrollment Modal
function showEnrollmentModal(courseCard) {
    const courseName = courseCard.querySelector('h3').textContent;
    const coursePrice = courseCard.querySelector('.price-current').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Enroll in ${courseName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="course-summary">
                    <h4>Course Summary</h4>
                    <p><strong>Course:</strong> ${courseName}</p>
                    <p><strong>Price:</strong> ${coursePrice}</p>
                    <p><strong>Access:</strong> Lifetime</p>
                </div>
                <form class="enrollment-form">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiry">Expiry Date</label>
                            <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="text" id="cvv" name="cvv" placeholder="123" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Complete Enrollment - ${coursePrice}</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Form submission
    const form = modal.querySelector('.enrollment-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processEnrollment(form, courseName, modal);
    });
}

// Process enrollment
async function processEnrollment(form, courseName, modal) {
    const formData = new FormData(form);
    const enrollmentData = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        const currentUser = window.supabaseAuth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        // Get course price from modal
        const coursePrice = modal.querySelector('.course-summary p:nth-child(3)').textContent.split(': ')[1];
        
        // Simulate payment processing (in real app, integrate with Stripe/PayPal)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save enrollment to Supabase
        const result = await window.supabaseAuth.saveEnrollment(
            currentUser.id,
            courseName,
            coursePrice,
            {
                cardNumber: enrollmentData.cardNumber.slice(-4), // Only store last 4 digits
                fullName: enrollmentData.fullName,
                email: enrollmentData.email
            }
        );
        
        if (result.success) {
            // Show success message
            modal.querySelector('.modal-body').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Enrollment Successful!</h3>
                    <p>Welcome to <strong>${courseName}</strong>!</p>
                    <p>You will receive a confirmation email shortly with access details.</p>
                    <button class="btn btn-primary" onclick="document.body.removeChild(this.closest('.enrollment-modal'))">
                        Start Learning
                    </button>
                </div>
            `;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification(`Enrollment failed: ${error.message}`, 'error');
    }
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.course-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter animation for hero stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/[\d,]+/, target.toLocaleString());
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/[\d,]+/, Math.floor(current).toLocaleString());
            }
        }, 20);
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}//
 Login Modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login to Your Account</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form class="login-form">
                    <div class="form-group">
                        <label for="loginEmail">Email Address</label>
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="remember"> Remember me
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Login</button>
                    <div class="form-links">
                        <a href="#" class="forgot-password">Forgot Password?</a>
                        <span>Don't have an account? <a href="#" class="signup-link">Sign up</a></span>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    // Handle form submission
    const form = modal.querySelector('.login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processLogin(form, modal);
    });
    
    // Handle signup link
    modal.querySelector('.signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        showSignupModal();
    });
    
    // Handle forgot password
    modal.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });
}

// Signup Modal
function showSignupModal() {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create Your Account</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form class="signup-form">
                    <div class="form-group">
                        <label for="signupName">Full Name</label>
                        <input type="text" id="signupName" name="fullName" required>
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
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="terms" required> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Create Account</button>
                    <div class="form-links">
                        <span>Already have an account? <a href="#" class="login-link">Login</a></span>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    // Handle form submission
    const form = modal.querySelector('.signup-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processSignup(form, modal);
    });
    
    // Handle login link
    modal.querySelector('.login-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        showLoginModal();
    });
}

// Free Trial Modal
function showFreeTrialModal() {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Start Your Free Trial</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="trial-info">
                    <div class="trial-benefits">
                        <h4>What's Included in Your Free Trial:</h4>
                        <ul>
                            <li><i class="fas fa-check"></i> Access to 3 complete courses</li>
                            <li><i class="fas fa-check"></i> 7 days unlimited learning</li>
                            <li><i class="fas fa-check"></i> Community forum access</li>
                            <li><i class="fas fa-check"></i> Mobile app access</li>
                            <li><i class="fas fa-check"></i> No credit card required</li>
                        </ul>
                    </div>
                </div>
                <form class="trial-form">
                    <div class="form-group">
                        <label for="trialName">Full Name</label>
                        <input type="text" id="trialName" name="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="trialEmail">Email Address</label>
                        <input type="email" id="trialEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="experience">Programming Experience</label>
                        <select id="experience" name="experience" required>
                            <option value="">Select your level</option>
                            <option value="beginner">Complete Beginner</option>
                            <option value="some">Some Experience</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Start Free Trial</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    // Handle form submission
    const form = modal.querySelector('.trial-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processFreeTrial(form, modal);
    });
}

// All Courses Modal
function showAllCoursesModal() {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3>All Programming Courses</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="course-filters">
                    <button class="filter-btn active" data-filter="all">All Courses</button>
                    <button class="filter-btn" data-filter="beginner">Beginner</button>
                    <button class="filter-btn" data-filter="intermediate">Intermediate</button>
                    <button class="filter-btn" data-filter="advanced">Advanced</button>
                </div>
                <div class="courses-list">
                    <div class="course-item" data-level="beginner">
                        <img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=80&h=60&fit=crop" alt="JavaScript">
                        <div class="course-details">
                            <h4>Complete JavaScript Mastery</h4>
                            <p>Beginner • 40 hours • $99</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Enroll</button>
                    </div>
                    <div class="course-item" data-level="intermediate">
                        <img src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=80&h=60&fit=crop" alt="Python">
                        <div class="course-details">
                            <h4>Python for Data Science</h4>
                            <p>Intermediate • 35 hours • $129</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Enroll</button>
                    </div>
                    <div class="course-item" data-level="advanced">
                        <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&h=60&fit=crop" alt="React">
                        <div class="course-details">
                            <h4>React & Next.js Complete Guide</h4>
                            <p>Advanced • 50 hours • $149</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Enroll</button>
                    </div>
                    <div class="course-item" data-level="beginner">
                        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=60&fit=crop" alt="HTML CSS">
                        <div class="course-details">
                            <h4>HTML & CSS Fundamentals</h4>
                            <p>Beginner • 25 hours • $79</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Enroll</button>
                    </div>
                    <div class="course-item" data-level="intermediate">
                        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=60&fit=crop" alt="Node.js">
                        <div class="course-details">
                            <h4>Node.js Backend Development</h4>
                            <p>Intermediate • 45 hours • $139</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Enroll</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    // Handle course filtering
    const filterBtns = modal.querySelectorAll('.filter-btn');
    const courseItems = modal.querySelectorAll('.course-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            courseItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-level') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Handle course enrollment
    modal.querySelectorAll('.btn-sm').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseName = btn.parentElement.querySelector('h4').textContent;
            showNotification(`Redirecting to ${courseName} enrollment...`, 'info');
            document.body.removeChild(modal);
        });
    });
}

// Course Filter Modal (for footer course links)
function showCourseFilterModal(courseName) {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${courseName} Courses</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Explore our comprehensive ${courseName} learning path:</p>
                <div class="course-path">
                    <div class="path-item">
                        <h4>${courseName} Fundamentals</h4>
                        <p>Perfect for beginners starting their ${courseName} journey</p>
                        <span class="price">$79</span>
                    </div>
                    <div class="path-item">
                        <h4>Advanced ${courseName}</h4>
                        <p>Deep dive into advanced concepts and real-world applications</p>
                        <span class="price">$129</span>
                    </div>
                    <div class="path-item">
                        <h4>${courseName} Masterclass</h4>
                        <p>Complete mastery with projects and certification</p>
                        <span class="price">$199</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-full">View All ${courseName} Courses</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
}

// Forgot Password Modal
function showForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reset Your Password</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form class="forgot-form">
                    <div class="form-group">
                        <label for="resetEmail">Email Address</label>
                        <input type="email" id="resetEmail" name="email" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Send Reset Link</button>
                    <div class="form-links">
                        <a href="#" class="back-to-login">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupModalClose(modal);
    
    // Handle form submission
    const form = modal.querySelector('.forgot-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processForgotPassword(form, modal);
    });
    
    // Handle back to login
    modal.querySelector('.back-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        document.body.removeChild(modal);
        showLoginModal();
    });
}

// Utility function to setup modal close functionality
function setupModalClose(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Process functions
async function processLogin(form, modal) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        const result = await window.supabaseAuth.signInUser(email, password);
        
        if (result.success) {
            modal.querySelector('.modal-body').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Welcome Back!</h3>
                    <p>You have successfully logged in to your account.</p>
                    <button class="btn btn-primary" onclick="document.body.removeChild(this.closest('.enrollment-modal'))">
                        Continue Learning
                    </button>
                </div>
            `;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification(`Login failed: ${error.message}`, 'error');
    }
}

async function processSignup(form, modal) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const fullName = formData.get('fullName');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        const result = await window.supabaseAuth.signUpUser(email, password, fullName);
        
        if (result.success) {
            modal.querySelector('.modal-body').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Account Created!</h3>
                    <p>Welcome to CodeMaster Academy! Check your email for verification.</p>
                    <button class="btn btn-primary" onclick="document.body.removeChild(this.closest('.enrollment-modal'))">
                        Start Learning
                    </button>
                </div>
            `;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification(`Signup failed: ${error.message}`, 'error');
    }
}

function processFreeTrial(form, modal) {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Setting up trial...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        modal.querySelector('.modal-body').innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Free Trial Activated!</h3>
                <p>Your 7-day free trial has started. Enjoy unlimited access to our courses!</p>
                <button class="btn btn-primary" onclick="document.body.removeChild(this.closest('.enrollment-modal'))">
                    Start Learning Now
                </button>
            </div>
        `;
    }, 2000);
}

async function processForgotPassword(form, modal) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const email = formData.get('email');
    
    try {
        const result = await window.supabaseAuth.resetPassword(email);
        
        if (result.success) {
            modal.querySelector('.modal-body').innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Reset Link Sent!</h3>
                    <p>Check your email for password reset instructions.</p>
                    <button class="btn btn-primary" onclick="document.body.removeChild(this.closest('.enrollment-modal'))">
                        Close
                    </button>
                </div>
            `;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showNotification(`Password reset failed: ${error.message}`, 'error');
    }
}

// Notification system (if not already defined)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}