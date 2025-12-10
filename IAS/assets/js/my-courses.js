// My Courses Manager
class MyCoursesManager {
    constructor() {
        this.currentFilter = 'all';
        this.userCourses = [];
        this.init();
    }

    async init() {
        // Wait for Supabase to be ready
        await this.waitForSupabase();
        
        // Check authentication
        const isAuthenticated = await this.checkAuth();
        if (!isAuthenticated) return;
        
        // Load user courses
        await this.loadMyCourses();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    async waitForSupabase() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabaseAuth && window.supabaseDirect) {
                    resolve();
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    }

    async checkAuth() {
        try {
            const { data: { session } } = await window.supabaseDirect.auth.getSession();
            
            if (!session || !session.user) {
                alert('Please login to view your courses');
                window.location.href = 'index.html';
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            alert('Please login to view your courses');
            window.location.href = 'index.html';
            return false;
        }
    }

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterCourses();
            });
        });
    }

    async loadMyCourses() {
        try {
            const { data: { session } } = await window.supabaseDirect.auth.getSession();
            if (!session || !session.user) return;

            // Get user's enrolled courses from database
            const { data, error } = await window.supabaseDirect
                .from('user_courses')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Database error:', error);
                // If table doesn't exist, show empty state
                if (error.message.includes('relation "user_courses" does not exist')) {
                    console.warn('user_courses table does not exist. Please run create-user-courses-table.sql');
                }
                throw error;
            }

            this.userCourses = data || [];
            this.displayCourses();
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showEmptyState();
        }
    }

    displayCourses() {
        const grid = document.getElementById('myCoursesGrid');
        const emptyState = document.getElementById('emptyState');

        console.log('Displaying courses:', this.userCourses);

        if (this.userCourses.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        const coursesHTML = this.userCourses.map(userCourse => {
            const course = this.getCourseDetails(userCourse.course_id);
            console.log('Course details for', userCourse.course_id, ':', course);
            
            if (!course) {
                console.warn('Course not found:', userCourse.course_id);
                return '';
            }

            const progress = userCourse.progress || 0;
            const status = progress === 100 ? 'completed' : 'in-progress';

            return `
                <div class="my-course-card" data-status="${status}">
                    <div class="course-image">
                        <img src="${course.image}" alt="${course.title}">
                        <div class="course-badge ${course.level.toLowerCase()}">${course.level}</div>
                    </div>
                    <div class="course-content">
                        <h3>${course.title}</h3>
                        <p class="course-instructor">
                            <i class="fas fa-user"></i> ${course.instructor}
                        </p>
                        <div class="course-progress">
                            <div class="progress-header">
                                <span>Progress</span>
                                <span class="progress-percent">${progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <div class="course-meta">
                            <span><i class="fas fa-clock"></i> ${course.duration}</span>
                            <span><i class="fas fa-video"></i> ${course.lessons} lessons</span>
                        </div>
                        <div class="course-actions">
                            ${progress === 100 
                                ? '<button class="btn-secondary" onclick="myCoursesManager.reviewCourse(\''+course.id+'\')"><i class="fas fa-star"></i> Review</button>'
                                : '<button class="btn-primary" onclick="window.location.href=\'404.html\'">' +
    '<i class="fas fa-play"></i> Continue Learning' +
'</button>'
                            }
                            <button class="btn-outline" onclick="myCoursesManager.viewCertificate(\'${course.id}\')">
                                <i class="fas fa-certificate"></i> Certificate
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = coursesHTML;
    }

    getCourseDetails(courseId) {
        // Get course details from courses-data.js
        console.log('Looking for course:', courseId, 'Type:', typeof courseId);
        console.log('coursesData available:', typeof coursesData !== 'undefined');
        
        if (typeof coursesData !== 'undefined') {
            console.log('Total courses in data:', coursesData.length);
            
            // Try to match both as number and string
            const numericId = parseInt(courseId);
            const course = coursesData.find(c => c.id === numericId || c.id === courseId);
            
            if (!course) {
                console.error('Course ID not found in coursesData:', courseId);
                console.log('Available course IDs:', coursesData.map(c => c.id));
            } else {
                console.log('✅ Found course:', course.title);
            }
            return course;
        }
        console.error('coursesData is not defined!');
        return null;
    }

    filterCourses() {
        const cards = document.querySelectorAll('.my-course-card');
        
        cards.forEach(card => {
            const status = card.dataset.status;
            
            if (this.currentFilter === 'all') {
                card.style.display = 'block';
            } else if (this.currentFilter === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    continueCourse(courseId) {
        window.location.href = `course-detail.html?id=${courseId}`;
    }

    reviewCourse(courseId) {
        this.showNotification('Review feature coming soon!', 'info');
    }

    viewCertificate(courseId) {
        const userCourse = this.userCourses.find(uc => uc.course_id === courseId);
        if (userCourse && userCourse.progress === 100) {
            this.showNotification('Certificate download feature coming soon!', 'info');
        } else {
            this.showNotification('Complete the course to get your certificate!', 'warning');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }

        const messageEl = notification.querySelector('.notification-message');
        const iconEl = notification.querySelector('.notification-icon');
        
        if (!messageEl || !iconEl) return;

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
        
        // Set notification type class and show
        notification.className = `notification ${type}`;
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide after 4 seconds with slide-out animation
        setTimeout(() => {
            notification.classList.add('hiding');
            notification.classList.remove('show');
            
            // Remove hiding class after animation completes
            setTimeout(() => {
                notification.classList.remove('hiding');
            }, 400);
        }, 4000);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                notification.classList.add('hiding');
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.classList.remove('hiding');
                }, 400);
            };
        }
    }

    showEmptyState() {
        const grid = document.getElementById('myCoursesGrid');
        const emptyState = document.getElementById('emptyState');
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
    }
}

// Initialize when DOM is loaded
let myCoursesManager;
document.addEventListener('DOMContentLoaded', () => {
    myCoursesManager = new MyCoursesManager();
});
