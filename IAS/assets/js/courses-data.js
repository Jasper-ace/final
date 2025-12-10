const coursesData = [
    // Web Development - Frontend (15 courses)
    {
        id: 1,
        title: "Complete JavaScript Mastery",
        description: "Learn JavaScript from scratch to advanced concepts including ES6+, DOM manipulation, and modern frameworks.",
        instructor: "John Smith",
        level: "Beginner",
        duration: 40,
        price: 5544, // ₱5,544 (was $99)
        originalPrice: 11144, // ₱11,144 (was $199)
        rating: 4.9,
        reviews: 2340,
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        badge: "Bestseller",
        category: "web"
    },
    {
        id: 2,
        title: "React & Next.js Complete Guide",
        description: "Build modern web applications with React, Next.js, and the latest frontend technologies.",
        instructor: "Mike Chen",
        level: "Advanced",
        duration: 50,
        price: 8344, // ₱8,344 (was )
        originalPrice: 13944, // 13,944 (was )
        rating: 4.9,
        reviews: 3120,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        category: "web"
    },
    {
        id: 3,
        title: "Vue.js 3 Masterclass",
        description: "Master Vue.js 3 with Composition API, Pinia state management, and modern development practices.",
        instructor: "Emma Wilson",
        level: "Intermediate",
        duration: 35,
        price: 6664, // ₱6,664 (was )
        rating: 4.8,
        reviews: 1890,
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
        badge: "Popular",
        category: "web"
    },
    {
        id: 4,
        title: "Python for Data Science",
        description: "Master Python programming with focus on data analysis, machine learning, and scientific computing.",
        instructor: "Sarah Johnson",
        level: "Intermediate",
        duration: 35,
        price: 7224, // ₱7,224 (was )
        originalPrice: null,
        rating: 4.8,
        reviews: 1890,
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop",
        badge: "New",
        category: "data"
    },
    {
        id: 5,
        title: "React & Next.js Complete Guide",
        description: "Build modern web applications with React, Next.js, and the latest frontend technologies.",
        instructor: "Mike Chen",
        level: "Advanced",
        duration: 50,
        price: 8344, // ₱8,344 (was )
        originalPrice: 13944, // 13,944 (was )
        rating: 4.9,
        reviews: 3120,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        badge: null,
        category: "web"
    },
    {
        id: 6,
        title: "Java Spring Boot Backend Development",
        description: "Learn to build robust, scalable RESTful APIs using Java, Spring Boot, and modern database integration.",
        instructor: "Alex Rodriguez",
        level: "Intermediate",
        duration: 60,
        price: 11144, // ₱11,144 (was )
        originalPrice: 16744, // 16,744 (was )
        rating: 4.7,
        reviews: 1500,
        image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&h=250&fit=crop",
        badge: "Sale",
        category: "web"
    },
    {
        id: 7,
        title: "Complete C# & .NET Core Developer",
        description: "Everything you need to know about C# and building modern web and desktop apps with .NET Core.",
        instructor: "Emily Davis",
        level: "Beginner",
        duration: 75,
        price: 10024, // ₱10,024 (was )
        originalPrice: null,
        rating: 4.6,
        reviews: 980,
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop",
        badge: null,
        category: "web"
    },
    {
        id: 8,
        title: "HTML5 & CSS3 Responsive Web Design",
        description: "Build beautiful, mobile-friendly websites using the fundamentals of HTML and CSS with Flexbox and Grid.",
        instructor: "David Lee",
        level: "Beginner",
        duration: 20,
        price: 4424, // ₱4,424 (was )
        originalPrice: null,
        rating: 4.7,
        reviews: 4120,
        image: "https://imgs.search.brave.com/_GRse1OA4nu0WsdMkcqfKoPG9I2hepbLvGi9cpuC4mY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly96YWst/bGVhcm5pbmcuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzEwL2h0bWwtYW5k/LWNzcy0yLmpwZw",
        badge: "Quick Start",
        category: "web"
    },
    {
        id: 9,
        title: "Go (Golang) Microservices Mastery",
        description: "Architect and build high-performance, concurrent microservices using the Go programming language.",
        instructor: "Jessica Kim",
        level: "Advanced",
        duration: 45,
        price: 8904, // 8,904 (was )
        originalPrice: 14504, // 14,504 (was )
        rating: 4.5,
        reviews: 610,
        image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=250&fit=crop",
        badge: null,
        category: "web"
    },
    {
        id: 10,
        title: "Fundamentals of SQL and Database Design",
        description: "Learn to write efficient SQL queries and master relational database design concepts (MySQL, PostgreSQL).",
        instructor: "Mark Wilson",
        level: "Beginner",
        duration: 30,
        price: 5544, // ₱5,544 (was )
        originalPrice: null,
        rating: 5.0,
        reviews: 1230,
        image: "https://imgs.search.brave.com/uNVjj2ED7D_FVA3ZwTRaQNyD3HkzL8IUjmKWBYRocdc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYWhh/cmF0ZWNoLmdvdi5l/Zy9wbHVnaW5maWxl/LnBocC8xNTU2Mzcv/Y291cnNlL292ZXJ2/aWV3ZmlsZXMvQ291/cnNlX0RhdGFiYXNl/LmpwZw",
        badge: "Essential",
        category: "data"
    },
    {
        id: 11,
        title: "Modern DevOps with Docker and Kubernetes",
        description: "Automate your deployment pipeline and scale applications using industry-standard tools like Docker and K8s.",
        instructor: "Chris White",
        level: "Advanced",
        duration: 70,
        price: 13944, // 13,944 (was )
        originalPrice: 19544, // 19,544 (was )
        rating: 4.6,
        reviews: 1150,
        image: "https://imgs.search.brave.com/xomVC2wqnHsyf7tcTnqmTLpmmUy-a065zXMj3yNPJqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zcGFj/ZWxpZnQuaW8vX25l/eHQvaW1hZ2U_dXJs/PWh0dHBzOi8vc3Bh/Y2VsaWZ0aW8ud3Bj/b21zdGFnaW5nLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NC8wNy80MjMuZG9j/a2VyLXN3YXJtLXZz/LWt1YmVybmV0ZXMu/cG5nJnc9Mzg0MCZx/PTc1",
        badge: null,
        category: "devops"
    },
    {
        id: 12,
        title: "Machine Learning with Python and TensorFlow",
        description: "Dive deep into neural networks, data preprocessing, and model deployment for real-world AI solutions.",
        instructor: "Dr. Ava Sharma",
        level: "Expert",
        duration: 80,
        price: 16744, // 16,744 (was )
        originalPrice: 22344, // 22,344 (was )
        rating: 4.8,
        reviews: 890,
        image: "https://imgs.search.brave.com/wt953lICdk-0CSVsKQ4q_roX-Ao-PJbuHDWoGR9310I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGVuc29yZmxvdy5v/cmcvc3RhdGljL3Np/dGUtYXNzZXRzL2lt/YWdlcy9tYXJrZXRp/bmcvZWR1L2VkdV9s/ZWFybmluZy10ZW5z/b3JmbG93anMtZ2Fu/dC1sYWJvcmRlLmpw/Zw",
        badge: "AI Track",
        category: "data"
    },
    {
        id: 13,
        title: "Backend with Node.js, Express, and MongoDB (MERN)",
        description: "Master the backend development process using the popular Node.js, Express.js, and MongoDB stack.",
        instructor: "Ryan O'Connell",
        level: "Intermediate",
        duration: 55,
        price: 8344, // ₱8,344 (was )
        originalPrice: null,
        rating: 4.5,
        reviews: 1600,
        image: "https://imgs.search.brave.com/xLS5eltUu1JCa27jTdWj03wbpftGVhGarDcCfp0aPXw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/Lm5leHRpZGVhdGVj/aC5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjMvMDEvbW9u/Z29kYi0yLTEwMjR4/MTAyNC5wbmc",
        badge: null,
        category: "web"
    },
    {
        id: 14,
        title: "iOS App Development with Swift",
        description: "Build native mobile applications for iPhone and iPad using Apple's modern programming language, Swift.",
        instructor: "Chloe Park",
        level: "Beginner",
        duration: 65,
        price: 10024, // ₱10,024 (was )
        originalPrice: 15624, // 15,624 (was )
        rating: 4.9,
        reviews: 2100,
        image: "https://imgs.search.brave.com/lGewwJr8vNrz7JKoy7_8dgFD7PEnCzwcyydibrh-xY0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hcHBp/bnZlbnRpdi5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTcv/MDgvU3dpZnQtJUUy/JTgwJTkzLVNoYXBp/bmctdGhlLUZ1dHVy/ZS1vZi1pT1MtQXBw/LURldmVsb3BtZW50/LnBuZw",
        badge: "Mobile",
        category: "mobile"
    },
    {
        id: 15,
        title: "Blockchain and Solidity Development",
        description: "Learn to create smart contracts and decentralized applications (DApps) on the Ethereum blockchain.",
        instructor: "Samira Khan",
        level: "Expert",
        duration: 40,
        price: 12824, // 12,824 (was )
        originalPrice: null,
        rating: 4.4,
        reviews: 450,
        image: "https://imgs.search.brave.com/iA4QOMM5ECJitummCPduUozjP63HwWEyJ6QwJilOfa0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Y29pbmdhdGUuY29t/L3VwbG9hZHMvMjAy/NC8wNy8xMDA2MzI1/MC9lZHVyZWthX2Js/b2NrY2hhaW5fY291/cnNlczM2NTIwLnBu/Zw",
        badge: null,
        category: "web"
    },
    {
        id: 16,
        title: "Cybersecurity & Ethical Hacking Bootcamp",
        description: "A comprehensive bootcamp covering penetration testing, network security, and defensive strategies.",
        instructor: "Ben Harris",
        level: "All Levels",
        duration: 90,
        price: 19544, // 19,544 (was )
        originalPrice: 27944, // 27,944 (was )
        rating: 4.7,
        reviews: 1950,
        image: "https://imgs.search.brave.com/A0ROTbYVHctcH4L44CGrktQuYshZXTlDOPN9_-eW0OQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZXRoaWNhbGhhY2tp/bmdpbnN0aXR1dGUu/Y29tL2Jsb2cvdXBs/b2Fkcy9pbWFnZXMv/MjAyNTA2L2ltYWdl/Xzg3MHhfNjg1ZTU1/MDhiNTVlMy53ZWJw",
        badge: "Limited",
        category: "devops"
    },
    {
        id: 17,
        title: "Software Architecture and Design Patterns",
        description: "Learn to design large-scale, maintainable software systems using SOLID principles and GoF patterns.",
        instructor: "Professor Lee",
        level: "Advanced",
        duration: 30,
        price: 10584, // 10,584 (was )
        originalPrice: null,
        rating: 4.6,
        reviews: 720,
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
        badge: null,
        category: "web"
    },
    {
        id: 18,
        title: "Android App Development with Kotlin",
        description: "Learn to build powerful and user-friendly Android applications using Kotlin, the official language for modern Android development.",
        instructor: "Ethan Cruz",
        level: "Beginner",
        duration: 70,
        price: 10024, // ₱10,024 (was )
        originalPrice: 15624, // 15,624 (was )
        rating: 4.8,
        reviews: 1950,
        image: "https://imgs.search.brave.com/nW4KDgEmFX0bZ_6A5Wgg-lFwgCd_M-obe5sNBeRMvgI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bmV0c29sdXRpb25z/LmNvbS93cC1jb250/ZW50L3VwbG9hZHMv/MjAyMy8wMS9IZWFk/ZXItSW1hZ2VfV2h5/LUtvdGxpbi1pcy10/aGUtRnV0dXJlLW9m/LUFuZHJvaWQtQXBw/LURldmVsb3BtZW50/Xy53ZWJw",
        badge: "Mobile",
        category: "mobile"
    }
];

// Course rendering and filtering functionality
class CourseManager {
    constructor() {
        this.courses = coursesData;
        this.filteredCourses = coursesData;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderCourses();
        this.setupFilters();
    }

    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;

        if (!this.filteredCourses || this.filteredCourses.length === 0) {
            coursesGrid.innerHTML = '<p>No courses available</p>';
            return;
        }

        const coursesHTML = this.filteredCourses.map(course => this.createCourseCard(course)).join('');
        coursesGrid.innerHTML = coursesHTML;
    }

    createCourseCard(course) {
        const stars = this.generateStars(course.rating);
        const badge = course.badge ? `<div class="course-badge">${course.badge}</div>` : '';
        const originalPrice = course.originalPrice ? `<span class="price-old">${course.originalPrice.toLocaleString()}</span>` : '';

        return `
            <div class="course-card" data-category="${course.category}" data-level="${course.level.toLowerCase()}">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title}">
                    ${badge}
                </div>
                <div class="course-content">
                    <div class="course-meta">
                        <span class="course-level">${course.level}</span>
                        <span class="course-duration">${course.duration} hours</span>
                    </div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-instructor">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Instructor">
                        <span>${course.instructor}</span>
                    </div>
                    <div class="course-rating">
                        <div class="stars">${stars}</div>
                        <span>${course.rating} (${course.reviews ? course.reviews.toLocaleString() : '0'} reviews)</span>
                    </div>
                    <div class="course-footer">
                        <div class="course-price">
                            ${originalPrice}
                            <span class="price-current">₱${course.price.toLocaleString()}</span>
                        </div>
                        <button class="btn btn-primary course-enroll-btn" 
                                onclick="enrollInCourse(${course.id})"
                                id="enroll-btn-${course.id}">
                            <span class="btn-text">Enroll Now</span>
                            <span class="btn-loading" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i> Processing...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter courses
                const filter = e.target.getAttribute('data-filter');
                this.filterCourses(filter);
            });
        });
    }

    filterCourses(filter) {
        this.currentFilter = filter;

        if (filter === 'all') {
            this.filteredCourses = this.courses;
        } else if (['beginner', 'intermediate', 'advanced'].includes(filter)) {
            this.filteredCourses = this.courses.filter(course =>
                course.level.toLowerCase() === filter
            );
        } else {
            this.filteredCourses = this.courses.filter(course =>
                course.category === filter
            );
        }

        this.renderCourses();
    }

    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }
}

// Global functions
async function enrollInCourse(courseId) {
    console.log('Enrolling in course:', courseId);

    // Show loading state
    const enrollBtn = document.getElementById(`enroll-btn-${courseId}`);
    if (enrollBtn) {
        const btnText = enrollBtn.querySelector('.btn-text');
        const btnLoading = enrollBtn.querySelector('.btn-loading');

        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline';
        enrollBtn.disabled = true;
    }

    try {
        // Check if user is authenticated
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            if (window.showNotification) {
                window.showNotification('Please log in to enroll in courses', 'warning');
            }

            // Show login modal if available
            if (window.authManager && window.authManager.showLoginModal) {
                window.authManager.showLoginModal();
            } else {
                // Fallback to clicking login button
                const loginBtn = document.querySelector('.btn-login');
                if (loginBtn) {
                    loginBtn.click();
                }
            }
            return;
        }

        // Check if already enrolled
        const alreadyEnrolled = await isUserEnrolled(courseId);
        if (alreadyEnrolled) {
            if (window.showNotification) {
                window.showNotification('You are already enrolled in this course!', 'info');
            }

            // Update button to show enrolled state
            if (enrollBtn) {
                enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
                enrollBtn.classList.remove('btn-primary');
                enrollBtn.classList.add('btn-success');
                enrollBtn.disabled = true;
            }
            return;
        }

        // Get course details
        const course = window.courseManager ? window.courseManager.getCourseById(courseId) :
            coursesData.find(c => c.id === courseId);

        if (course) {
            // Show Xendit payment modal
            if (window.showXenditPayment) {
                window.showXenditPayment(course);
            } else {
                console.error('Xendit payment module not loaded');
                alert('Payment system is loading. Please try again in a moment.');
            }
        } else {
            throw new Error('Course not found');
        }

    } catch (error) {
        console.error('Error during enrollment:', error);
        if (window.showNotification) {
            window.showNotification(`Enrollment failed: ${error.message}`, 'error');
        }
    } finally {
        // Reset button state (only if not enrolled)
        if (enrollBtn && !enrollBtn.classList.contains('btn-success')) {
            const btnText = enrollBtn.querySelector('.btn-text');
            const btnLoading = enrollBtn.querySelector('.btn-loading');

            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
            enrollBtn.disabled = false;
        }
    }
}

// OLD PAYMONGO/STRIPE CODE - REPLACED WITH XENDIT
// This function is no longer used
function showStripePaymentModal_OLD(course) {
    const modalHTML = `
        <div id="stripePaymentModal" class="modal stripe-modal">
            <div class="modal-content payment-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-credit-card"></i> Complete Your Enrollment</h2>
                    <span class="close" onclick="closeStripeModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <!-- Course Summary -->
                    <div class="course-summary">
                        <img src="${course.image}" alt="${course.title}" class="course-thumb">
                        <div class="course-details">
                            <h3>${course.title}</h3>
                            <p class="instructor">by ${course.instructor}</p>
                            <div class="course-meta">
                                <span class="level">${course.level}</span>
                                <span class="duration">${course.duration} hours</span>
                                <span class="rating">⭐ ${course.rating}</span>
                            </div>
                        </div>
                        <div class="course-price">
                            ${course.originalPrice ? `<span class="price-old">₱${course.originalPrice.toLocaleString()}</span>` : ''}
                            <span class="price-current">₱${course.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <!-- Stripe Payment Form -->
                    <form id="stripePaymentForm" class="stripe-form">
                        <div class="payment-section">
                            <h4><i class="fas fa-credit-card"></i> Payment Information</h4>
                            <p class="secure-notice">
                                <i class="fas fa-shield-alt"></i>
                                Your payment is secured by PayMongo • Test Mode Active
                            </p>
                        </div>

                        <!-- Payment Method Selection will be inserted here by main.js -->

                        <!-- PayMongo Card Input Fields -->
                        <div id="card-payment-fields">
                            <div class="form-group">
                                <label for="card-number">Card Number</label>
                                <input type="text" id="card-number" placeholder="4242 4242 4242 4242" maxlength="19" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="card-expiry">Expiry Date</label>
                                    <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required>
                                </div>
                                <div class="form-group">
                                    <label for="card-cvc">CVC</label>
                                    <input type="text" id="card-cvc" placeholder="123" maxlength="4" required>
                                </div>
                            </div>
                            <div id="card-errors" class="error-message" role="alert"></div>
                        </div>

                        <!-- E-Wallet Payment Fields -->
                        <div id="ewallet-payment-fields" style="display: none;">
                            <div class="ewallet-info">
                                <i class="fas fa-info-circle"></i>
                                <p>You will be redirected to complete your payment securely.</p>
                            </div>
                        </div>

                        <!-- Billing Information -->
                        <div class="billing-section">
                            <h4>Billing Information</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="billing-name">Full Name</label>
                                    <input type="text" id="billing-name" name="billing-name" required>
                                </div>
                                <div class="form-group">
                                    <label for="billing-email">Email Address</label>
                                    <input type="email" id="billing-email" name="billing-email" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="billing-address">Address</label>
                                <input type="text" id="billing-address" name="billing-address" placeholder="123 Main Street" required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="billing-city">City</label>
                                    <input type="text" id="billing-city" name="billing-city" required>
                                </div>
                                <div class="form-group">
                                    <label for="billing-state">State</label>
                                    <input type="text" id="billing-state" name="billing-state" required>
                                </div>
                                <div class="form-group">
                                    <label for="billing-zip">ZIP Code</label>
                                    <input type="text" id="billing-zip" name="billing-zip" required>
                                </div>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div class="order-summary">
                            <h4>Order Summary</h4>
                            <div class="summary-row">
                                <span>Course Price:</span>
                                <span>₱${course.price.toLocaleString()}</span>
                            </div>
                            <div class="summary-row">
                                <span>Processing Fee:</span>
                                <span>$2.99</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>${(parseFloat(course.price) + 167).toLocaleString()}</span>
                            </div>
                        </div>

                        <!-- Terms and Conditions -->
                        <div class="terms-section">
                            <label class="checkbox-container">
                                <input type="checkbox" id="agree-terms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="privacy-link">Privacy Policy</a>
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary btn-full payment-btn" id="submit-payment">
                            <span class="btn-text">
                                <i class="fas fa-lock"></i>
                                Complete Payment - ${(parseFloat(course.price) + 167).toLocaleString()}
                            </span>
                            <span class="btn-loading" style="display: none;">
                                <i class="fas fa-spinner fa-spin"></i>
                                Processing Payment...
                            </span>
                        </button>

                        <div class="payment-security">
                            <p>
                                <i class="fas fa-shield-alt"></i>
                                256-bit SSL encryption • PCI DSS compliant • Your data is secure
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('stripePaymentModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = document.getElementById('stripePaymentModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Initialize PayMongo payment (card formatting is handled in main.js)
    console.log('Payment modal ready for:', course.title);

    // Pre-fill user information if available
    const currentUser = window.supabaseAuth.getCurrentUser();
    if (currentUser) {
        document.getElementById('billing-email').value = currentUser.email;
        if (currentUser.user_metadata?.full_name) {
            document.getElementById('billing-name').value = currentUser.user_metadata.full_name;
        }
    }

    // Attach form submission handler for PayMongo
    const form = document.getElementById('stripePaymentForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('💳 Form submitted, calling PayMongo API...');
            
            // Call PayMongo payment handler from main.js
            if (typeof window.handlePayMongoPayment === 'function') {
                await window.handlePayMongoPayment(course);
            } else {
                console.error('❌ PayMongo payment handler not found');
                alert('Payment system not initialized. Please refresh the page.');
            }
        });
        console.log('✅ PayMongo form handler attached');
    }
}

function closeStripeModal() {
    const modal = document.getElementById('stripePaymentModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Payment initialization is now handled in main.js
// Form submission is set up when the modal is created

// Demo payment for development (when Stripe fails to load)
function initializeDemoPayment(course) {
    console.log('Using demo payment mode - Stripe failed to initialize');

    // Replace card element with demo message
    const cardElement = document.getElementById('card-element');
    cardElement.innerHTML = `
        <div class="demo-card-element">
            <div class="demo-notice">
                <i class="fas fa-exclamation-triangle"></i> 
                <strong>Test Mode</strong> - Stripe connection failed, using demo
            </div>
            <input type="text" value="4242 4242 4242 4242" class="demo-card-input" readonly>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                <input type="text" value="12/25" style="flex: 1;" readonly>
                <input type="text" value="123" style="flex: 1;" readonly>
            </div>
            <p class="demo-info">Demo mode - No real payment will be processed. This simulates a successful payment.</p>
        </div>
    `;

    // Handle demo form submission
    const form = document.getElementById('stripePaymentForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await handleDemoPayment(course);
    });
}

// Real Stripe payment handler
async function handleRealStripePayment(course) {
    const submitButton = document.getElementById('submit-payment');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');

    // Show loading state
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';

    try {
        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: document.getElementById('billing-name').value,
                email: document.getElementById('billing-email').value,
                address: {
                    line1: document.getElementById('billing-address').value,
                    city: document.getElementById('billing-city').value,
                    state: document.getElementById('billing-state').value,
                    postal_code: document.getElementById('billing-zip').value,
                }
            }
        });

        if (error) {
            throw error;
        }

        console.log('✅ Payment method created:', paymentMethod.id);

        // Store the actual card data from Stripe for database saving
        window.currentCardData = {
            lastFour: paymentMethod.card.last4,
            expiry: `${paymentMethod.card.exp_month.toString().padStart(2, '0')}/${paymentMethod.card.exp_year.toString().slice(-2)}`,
            brand: paymentMethod.card.brand
        };

        console.log('💳 Captured card data:', window.currentCardData);

        // Store the actual card data from Stripe for database saving
       

        console.log('� Casptured card data:', window.currentCardData);

        // Since we don't have a real server backend yet, we'll simulate success
        // In production, you would:
        // 1. Send paymentMethod.id to your server
        // 2. Create a PaymentIntent on your server
        // 3. Return the client_secret to the frontend
        // 4. Confirm the payment with the real client_secret

        // Capture billing data from the form while it's still accessible
        window.currentBillingData = {
            fullName: document.getElementById('billing-name').value,
            email: document.getElementById('billing-email').value,
            address: document.getElementById('billing-address').value,
            city: document.getElementById('billing-city').value,
            state: document.getElementById('billing-state').value,
            zipCode: document.getElementById('billing-zip').value
        };

        console.log('📋 Captured billing data:', window.currentBillingData);
        console.log('💡 Test mode: Payment method validated successfully');
        console.log('🔧 Next step: Set up server backend for real payment processing');

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success
        showPaymentSuccess(course);

    } catch (error) {
        console.error('❌ Payment error:', error);
        showPaymentError(error.message);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
    }
}

// Demo payment handler (fallback)
async function handleDemoPayment(course) {
    const submitButton = document.getElementById('submit-payment');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');

    // Show loading state
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';

    try {
        // Simulate payment processing
        await simulatePaymentProcessing();

        // Show success
        showPaymentSuccess(course);

    } catch (error) {
        showPaymentError(error.message);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
    }
}

// Simulate server-side payment intent creation
async function createPaymentIntent(course, paymentMethodId) {
    try {
        // In a real application, this would be a call to your server
        // For demo purposes, we'll simulate a successful response

        console.log('🔄 Creating payment intent for course:', course.title);
        console.log('💳 Payment method ID:', paymentMethodId);

        // Simulate server processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return success without fake client_secret
        // In production, your server would create a real PaymentIntent and return the client_secret
        return {
            success: true,
            message: 'Payment method validated - server backend needed for real processing'
        };

        /* 
        // Real server call would look like this:
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_id: course.id,
                amount: Math.round((parseFloat(course.price) + 2.99) * 100), // Amount in cents
                currency: 'usd',
                payment_method_id: paymentMethodId
            })
        });
        
        return await response.json();
        */

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return { error: error.message };
    }
}

function simulatePaymentProcessing() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000); // Simulate 2 second processing time
    });
}

async function showPaymentSuccess(course) {
    closeStripeModal();

    // Show payment success modal with checkmark animation
    showPaymentSuccessModal(course);

    try {
        // Save enrollment to database
        const enrollmentResult = await saveCourseEnrollment(course);

        // Also save billing and payment information to accounts table
        if (window.supabaseAuth && window.supabaseAuth.saveAccount) {
            const user = window.supabaseAuth.getCurrentUser();
            
            if (user) {
                // Use captured billing data from payment processing, with fallbacks
                const billingData = {
                    fullName: window.currentBillingData?.fullName || 
                             user.user_metadata?.full_name || 
                             user.email?.split('@')[0] || 
                             'User',
                    email: window.currentBillingData?.email || user.email || '',
                    address: window.currentBillingData?.address || '',
                    city: window.currentBillingData?.city || '',
                    state: window.currentBillingData?.state || '',
                    zipCode: window.currentBillingData?.zipCode || '',
                    cardLastFour: getCardLastFour() || '',
                    cardExpiry: getCardExpiry() || '',
                    cardType: getCardType() || '',
                    cvv: window.currentBillingData?.cvv ||''
                };

                const accountResult = await window.supabaseAuth.saveAccount(user.id, billingData);
                if (accountResult.success) {
                    console.log('✅ Account information saved to accounts table');
                } else {
                    console.warn('⚠️ Failed to save account information:', accountResult.error);
                }
            }
        }

        if (enrollmentResult.success) {
            // Show enrollment confirmation
            setTimeout(() => {
                if (window.showNotification) {
                    window.showNotification(`🎓 You're now enrolled in "${course.title}"! Check your profile to start learning.`, 'success');
                }
            }, 2000);

            // Update local storage for immediate UI updates
            updateLocalEnrollment(course.id);

            // Refresh course display if course manager exists
            if (window.courseManager && window.courseManager.renderCourses) {
                window.courseManager.renderCourses();
            }

        } else {
            // Show error if enrollment saving failed
            setTimeout(() => {
                if (window.showNotification) {
                    window.showNotification(`⚠️ Payment processed but enrollment failed to save. Please contact support.`, 'warning');
                }
            }, 2000);
        }

    } catch (error) {
        console.error('Error saving enrollment:', error);
        setTimeout(() => {
            if (window.showNotification) {
                window.showNotification(`⚠️ Payment processed but there was an issue saving your enrollment. Please contact support.`, 'warning');
            }
        }, 2000);
    }
}

// Helper functions to extract card information safely
function getCardLastFour() {
    try {
        // Use stored card data from Stripe Elements
        if (window.currentCardData && window.currentCardData.lastFour) {
            return window.currentCardData.lastFour;
        }
        
        // Return empty string if no card data available
        return '';
    } catch (error) {
        console.log('Could not extract card last four:', error);
        return '';
    }
}

function getCardExpiry() {
    try {
        // Use stored card data
        if (window.currentCardData && window.currentCardData.expiry) {
            return window.currentCardData.expiry;
        }
        
        // Return empty string if no card data available
        return '';
    } catch (error) {
        console.log('Could not extract card expiry:', error);
        return '';
    }
}

function getCardType() {
    try {
        // Use stored card data
        if (window.currentCardData && window.currentCardData.brand) {
            return window.currentCardData.brand;
        }
        
        // Return empty string if no card data available
        return '';
    } catch (error) {
        console.log('Could not detect card type:', error);
        return '';
    }
}

// Check if user is already enrolled in a course
async function isUserEnrolled(courseId) {
    try {
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            return false;
        }

        const user = window.supabaseAuth.getCurrentUser();
        if (!user || !window.supabase) {
            return false;
        }

        // Try to get working Supabase client
        let supabaseClient = window.supabaseAuth.supabase;
        if (!supabaseClient && window.supabaseDirect) {
            supabaseClient = window.supabaseDirect;
        }
        
        if (!supabaseClient) {
            console.warn('⚠️ No Supabase client available for enrollment check');
            return false;
        }

        const { data, error } = await supabaseClient
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('payment_data->course_id', courseId)
            .eq('status', 'active')
            .limit(1);

        if (error) {
            console.error('Error checking enrollment:', error);
            return false;
        }

        return data && data.length > 0;

    } catch (error) {
        console.error('Error checking enrollment:', error);
        return false;
    }
}

// Save course enrollment to Supabase database
async function saveCourseEnrollment(course) {
    try {
        // Check if user is authenticated
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        // Get current user
        const user = window.supabaseAuth.getCurrentUser();
        if (!user) {
            throw new Error('No user found');
        }

        // Check if user is already enrolled
        const alreadyEnrolled = await isUserEnrolled(course.id);
        if (alreadyEnrolled) {
            console.log('User already enrolled in this course');
            return { success: true, message: 'Already enrolled' };
        }

        // Wait for Supabase auth to be ready
        console.log('🔍 Checking Supabase auth availability...');
        console.log('window.supabaseAuth exists:', !!window.supabaseAuth);
        console.log('window.supabaseAuth.saveEnrollment exists:', !!(window.supabaseAuth && window.supabaseAuth.saveEnrollment));
        
        if (!window.supabaseAuth || !window.supabaseAuth.saveEnrollment) {
            console.log('⏳ Waiting for Supabase auth to initialize...');
            // Wait a bit for Supabase to initialize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('🔍 After waiting - window.supabaseAuth exists:', !!window.supabaseAuth);
            console.log('🔍 After waiting - saveEnrollment exists:', !!(window.supabaseAuth && window.supabaseAuth.saveEnrollment));
            
            if (!window.supabaseAuth || !window.supabaseAuth.saveEnrollment) {
                console.error('❌ Supabase auth still not available after waiting');
                throw new Error('Supabase auth not available');
            }
        }
        
        console.log('✅ Supabase auth is available, proceeding with enrollment save');

        // Prepare enrollment data
        const enrollmentData = {
            user_id: user.id,
            course_id: course.id,
            course_title: course.title,
            course_instructor: course.instructor,
            course_price: course.price,
            course_duration: course.duration,
            course_level: course.level,
            enrolled_at: new Date().toISOString(),
            payment_status: 'completed',
            progress: 0,
            status: 'active'
        };

        console.log('💾 Saving enrollment to database:', enrollmentData);

        // Use the existing saveEnrollment function from supabaseAuth
        const result = await window.supabaseAuth.saveEnrollment(
            user.id,
            course.title,
            course.price,
            {
                course_id: course.id,
                instructor: course.instructor,
                duration: course.duration,
                level: course.level,
                payment_method: 'stripe',
                payment_status: 'completed'
            }
        );

        if (!result.success) {
            console.error('Database error:', result.error);
            throw new Error(result.error || 'Failed to save enrollment');
        }

        const data = result.data;

        console.log('✅ Enrollment saved successfully:', data);
        return { success: true, data };

    } catch (error) {
        console.error('❌ Error saving enrollment:', error);
        return { success: false, error: error.message };
    }
}

// Create the course_enrollments table if it doesn't exist
async function createEnrollmentsTable() {
    try {
        console.log('🔨 Creating course_enrollments table...');

        // Note: In a real application, you would create this table through Supabase dashboard
        // or migration scripts. This is a fallback for development.

        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS course_enrollments (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                course_id INTEGER NOT NULL,
                course_title TEXT NOT NULL,
                course_instructor TEXT,
                course_price DECIMAL(10,2),
                course_duration INTEGER,
                course_level TEXT,
                enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                payment_status TEXT DEFAULT 'completed',
                progress INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                completed_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE(user_id, course_id)
            );
            
            -- Enable Row Level Security
            ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
            
            -- Create policy for users to see their own enrollments
            CREATE POLICY "Users can view their own enrollments" ON course_enrollments
                FOR SELECT USING (auth.uid() = user_id);
            
            -- Create policy for users to insert their own enrollments
            CREATE POLICY "Users can insert their own enrollments" ON course_enrollments
                FOR INSERT WITH CHECK (auth.uid() = user_id);
            
            -- Create policy for users to update their own enrollments
            CREATE POLICY "Users can update their own enrollments" ON course_enrollments
                FOR UPDATE USING (auth.uid() = user_id);
        `;

        // Execute the SQL (Note: This requires elevated permissions)
        const { error } = await window.supabase.rpc('exec_sql', { sql: createTableSQL });

        if (error) {
            console.warn('⚠️ Could not create table automatically:', error);
            console.log('📋 Please create the course_enrollments table manually in Supabase dashboard');

            // For now, we'll store in localStorage as fallback
            return false;
        }

        console.log('✅ Course enrollments table created successfully');
        return true;

    } catch (error) {
        console.error('❌ Error creating enrollments table:', error);
        return false;
    }
}

// Update local storage for immediate UI feedback
function updateLocalEnrollment(courseId) {
    try {
        // Get existing enrollments from localStorage
        const existingEnrollments = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');

        // Add new enrollment if not already present
        if (!existingEnrollments.includes(courseId)) {
            existingEnrollments.push(courseId);
            localStorage.setItem('enrolledCourses', JSON.stringify(existingEnrollments));
            console.log('📱 Local enrollment updated for course:', courseId);
        }

        // Update course progress tracking
        const progressData = JSON.parse(localStorage.getItem('userCourseProgress') || '{}');
        if (!progressData[courseId]) {
            progressData[courseId] = {
                enrolled: true,
                enrolledAt: new Date().toISOString(),
                progress: 0,
                completed: false
            };
            localStorage.setItem('userCourseProgress', JSON.stringify(progressData));
            console.log('📊 Course progress initialized for course:', courseId);
        }

    } catch (error) {
        console.error('Error updating local enrollment:', error);
    }
}

// Get user's enrolled courses from database
async function getUserEnrollments() {
    try {
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        const user = window.supabaseAuth.getCurrentUser();
        if (!user) {
            return { success: false, error: 'No user found' };
        }

        if (!window.supabase) {
            return { success: false, error: 'Supabase not available' };
        }

        // Try to get working Supabase client
        let supabaseClient = window.supabaseAuth.supabase;
        if (!supabaseClient && window.supabaseDirect) {
            supabaseClient = window.supabaseDirect;
        }
        
        if (!supabaseClient) {
            return { success: false, error: 'Supabase not available' };
        }

        const { data, error } = await supabaseClient
            .from('enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('enrolled_at', { ascending: false });

        if (error) {
            console.error('Error fetching enrollments:', error);
            return { success: false, error: error.message };
        }

        console.log('📚 User enrollments fetched:', data);
        return { success: true, data };

    } catch (error) {
        console.error('Error getting user enrollments:', error);
        return { success: false, error: error.message };
    }
}

// Update course progress
async function updateCourseProgress(courseId, progress, completed = false) {
    try {
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            return { success: false, error: 'Not authenticated' };
        }

        const user = window.supabaseAuth.getCurrentUser();
        if (!user || !window.supabase) {
            return { success: false, error: 'User or Supabase not available' };
        }

        const updateData = {
            progress: Math.min(100, Math.max(0, progress)),
            updated_at: new Date().toISOString()
        };

        if (completed) {
            updateData.completed_at = new Date().toISOString();
            updateData.status = 'completed';
        }

        // Try to get working Supabase client
        let supabaseClient = window.supabaseAuth.supabase;
        if (!supabaseClient && window.supabaseDirect) {
            supabaseClient = window.supabaseDirect;
        }
        
        if (!supabaseClient) {
            return { success: false, error: 'Supabase not available' };
        }

        const { data, error } = await supabaseClient
            .from('enrollments')
            .update(updateData)
            .eq('user_id', user.id)
            .eq('payment_data->course_id', courseId)
            .select();

        if (error) {
            console.error('Error updating course progress:', error);
            return { success: false, error: error.message };
        }

        console.log('📈 Course progress updated:', data);

        // Also update localStorage for immediate UI feedback
        const progressData = JSON.parse(localStorage.getItem('userCourseProgress') || '{}');
        if (!progressData[courseId]) {
            progressData[courseId] = {};
        }
        progressData[courseId].progress = progress;
        progressData[courseId].completed = completed;
        progressData[courseId].lastUpdated = new Date().toISOString();
        localStorage.setItem('userCourseProgress', JSON.stringify(progressData));

        return { success: true, data };

    } catch (error) {
        console.error('Error updating course progress:', error);
        return { success: false, error: error.message };
    }
}

function showPaymentError(message) {
    if (window.showNotification) {
        window.showNotification(`Payment failed: ${message}. Please try again.`, 'error');
    }

    const errorElement = document.getElementById('card-errors');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Initialize enrollment states for all course buttons
async function initializeEnrollmentStates() {
    try {
        if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
            return; // User not logged in, keep default states
        }

        // Get user's enrollments
        const enrollments = await getUserEnrollments();
        if (!enrollments.success) {
            return;
        }

        // Update button states for enrolled courses
        enrollments.data.forEach(enrollment => {
            const courseId = enrollment.payment_data?.course_id;
            if (courseId) {
                const enrollBtn = document.getElementById(`enroll-btn-${courseId}`);
                if (enrollBtn) {
                    enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
                    enrollBtn.classList.remove('btn-primary');
                    enrollBtn.classList.add('btn-success');
                    enrollBtn.disabled = true;
                }
            }
        });

    } catch (error) {
        console.error('Error initializing enrollment states:', error);
    }
}

// Initialize course manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing CourseManager...');
    console.log('📚 Courses data available:', coursesData ? coursesData.length : 0);
    console.log('📍 coursesGrid element:', document.getElementById('coursesGrid'));
    
    try {
        window.courseManager = new CourseManager();
        console.log('✅ CourseManager initialized successfully');
        console.log('📊 Filtered courses:', window.courseManager.filteredCourses.length);
    } catch (error) {
        console.error('❌ Error initializing CourseManager:', error);
    }

    // Initialize enrollment states after a delay to ensure auth is ready
    setTimeout(initializeEnrollmentStates, 2000);
});

// Export for use in other files
// Show payment success modal with animated checkmark
function showPaymentSuccessModal(course) {
    // Create modal HTML
    const modalHTML = `
        <div id="paymentSuccessModal" class="payment-success-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        ">
            <div class="success-modal-content" style="
                background: white;
                border-radius: 20px;
                padding: 3rem 2rem;
                text-align: center;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.8);
                transition: transform 0.3s ease;
            ">
                <div class="success-checkmark" style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #28a745;
                    margin: 0 auto 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: checkmarkPop 0.6s ease-out 0.3s both;
                ">
                    <i class="fas fa-check" style="
                        color: white;
                        font-size: 2.5rem;
                        animation: checkmarkScale 0.4s ease-out 0.6s both;
                    "></i>
                </div>
                
                <h2 style="
                    color: #28a745;
                    margin: 0 0 1rem 0;
                    font-size: 2rem;
                    font-weight: 600;
                ">Payment Successful!</h2>
                
                <p style="
                    color: #666;
                    margin: 0 0 1.5rem 0;
                    font-size: 1.1rem;
                    line-height: 1.5;
                ">
                    Congratulations! You've successfully enrolled in<br>
                    <strong style="color: #333;">"${course.title}"</strong>
                </p>
                
                <div style="
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1.5rem 0;
                    border-left: 4px solid #28a745;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: #666;">Course Price:</span>
                        <span style="font-weight: 600; color: #333;">₱${course.price.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: #666;">Instructor:</span>
                        <span style="font-weight: 600; color: #333;">${course.instructor}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #666;">Duration:</span>
                        <span style="font-weight: 600; color: #333;">${course.duration} hours</span>
                    </div>
                </div>
                
                <p style="
                    color: #28a745;
                    margin: 1.5rem 0;
                    font-weight: 500;
                    font-size: 1rem;
                ">
                    <i class="fas fa-envelope" style="margin-right: 0.5rem;"></i>
                    A confirmation email has been sent to your inbox
                </p>
                
                <button onclick="closePaymentSuccessModal()" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    margin-top: 1rem;
                " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
                    Start Learning Now
                </button>
            </div>
        </div>
    `;

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes checkmarkPop {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @keyframes checkmarkScale {
            0% {
                transform: scale(0);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Animate modal in
    const modal = document.getElementById('paymentSuccessModal');
    const content = modal.querySelector('.success-modal-content');
    
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 100);
}

// Close payment success modal
function closePaymentSuccessModal() {
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Make functions globally available
window.closePaymentSuccessModal = closePaymentSuccessModal;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { coursesData, CourseManager };
}



