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

// Module accordion functionality
document.querySelectorAll('.module-header').forEach(header => {
    header.addEventListener('click', () => {
        const module = header.parentElement;
        const content = module.querySelector('.module-content');
        
        // Toggle module content
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            header.querySelector('i').classList.replace('fa-play-circle', 'fa-minus-circle');
        } else {
            content.style.display = 'none';
            header.querySelector('i').classList.replace('fa-minus-circle', 'fa-play-circle');
        }
    });
});

// Initialize modules as collapsed
document.querySelectorAll('.module-content').forEach(content => {
    content.style.display = 'none';
});

// Enroll button functionality
document.querySelector('.btn-enroll').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!window.supabaseAuth || !window.supabaseAuth.isAuthenticated()) {
        alert('Please login first to enroll in this course.');
        if (window.authManager && window.authManager.showLoginModal) {
            window.authManager.showLoginModal();
        } else if (typeof window.showModal === 'function') {
            window.showModal('loginModal');
        }
        return;
    }
    
    // Get course information
    const courseName = document.querySelector('.course-info h1').textContent;
    const priceText = document.querySelector('.price-current').textContent;
    const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Create course object
    const course = {
        id: 1, // You can get this from URL or data attribute
        title: courseName,
        price: priceValue
    };
    
    // Show Xendit payment modal
    if (window.showXenditPayment) {
        window.showXenditPayment(course);
    } else {
        console.error('Xendit payment module not loaded');
        alert('Payment system is loading. Please try again in a moment.');
    }
});

// Wishlist functionality
document.querySelector('.btn-wishlist').addEventListener('click', (e) => {
    e.preventDefault();
    const button = e.target.closest('.btn-wishlist');
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        // Remove from wishlist
        icon.classList.replace('fas', 'far');
        button.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        showNotification('Removed from wishlist', 'info');
    } else {
        // Add to wishlist
        icon.classList.replace('far', 'fas');
        button.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
        showNotification('Added to wishlist', 'success');
    }
});

// Video preview functionality
document.querySelector('.play-button').addEventListener('click', () => {
    showVideoPreview();
});

function showVideoPreview() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-header">
                <h3>Course Preview</h3>
                <button class="close-video">&times;</button>
            </div>
            <div class="video-container">
                <video controls autoplay>
                    <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-video');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Sticky course card behavior
window.addEventListener('scroll', () => {
    const courseCard = document.querySelector('.course-card-sticky');
    const heroSection = document.querySelector('.course-hero');
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    
    if (window.scrollY > heroBottom - 150) {
        courseCard.style.position = 'fixed';
        courseCard.style.top = '100px';
        courseCard.style.right = '20px';
        courseCard.style.width = '350px';
        courseCard.style.zIndex = '1000';
    } else {
        courseCard.style.position = 'sticky';
        courseCard.style.right = 'auto';
        courseCard.style.width = 'auto';
    }
});

// Add styles for video modal and notifications
const additionalStyles = `
<style>
.video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.video-modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    overflow: hidden;
}

.video-header {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
}

.close-video {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
}

.video-container {
    padding: 1rem;
}

.video-container video {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 1rem 1.5rem;
    z-index: 2000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left: 4px solid #10b981;
}

.notification-info {
    border-left: 4px solid #2563eb;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-success i {
    color: #10b981;
}

.notification-info i {
    color: #2563eb;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);