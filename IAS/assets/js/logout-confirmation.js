// Custom Logout Confirmation Modal
class LogoutConfirmation {
    constructor() {
        this.createModal();
        this.resolveCallback = null;
    }

    createModal() {
        // Check if modal already exists
        if (document.getElementById('logoutConfirmationOverlay')) {
            return;
        }

        const modalHTML = `
            <div id="logoutConfirmationOverlay" class="logout-confirmation-overlay">
                <div class="logout-confirmation-modal">
                    <div class="logout-confirmation-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <h2 class="logout-confirmation-title">Logout Confirmation</h2>
                    <p class="logout-confirmation-message">
                        Are you sure you want to logout? You will need to sign in again to access your account.
                    </p>
                    <div class="logout-confirmation-buttons">
                        <button class="logout-btn logout-btn-cancel" id="logoutCancelBtn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="logout-btn logout-btn-confirm" id="logoutConfirmBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        const overlay = document.getElementById('logoutConfirmationOverlay');
        const cancelBtn = document.getElementById('logoutCancelBtn');
        const confirmBtn = document.getElementById('logoutConfirmBtn');

        // Cancel button
        cancelBtn?.addEventListener('click', () => {
            this.hide();
            if (this.resolveCallback) {
                this.resolveCallback(false);
            }
        });

        // Confirm button
        confirmBtn?.addEventListener('click', () => {
            this.hide();
            if (this.resolveCallback) {
                this.resolveCallback(true);
            }
        });

        // Click outside to cancel
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hide();
                if (this.resolveCallback) {
                    this.resolveCallback(false);
                }
            }
        });

        // ESC key to cancel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay?.classList.contains('show')) {
                this.hide();
                if (this.resolveCallback) {
                    this.resolveCallback(false);
                }
            }
        });
    }

    show() {
        return new Promise((resolve) => {
            this.resolveCallback = resolve;
            const overlay = document.getElementById('logoutConfirmationOverlay');
            if (overlay) {
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    hide() {
        const overlay = document.getElementById('logoutConfirmationOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
}

// Create global instance
window.logoutConfirmation = new LogoutConfirmation();

// Helper function for easy use
window.confirmLogout = async function() {
    return await window.logoutConfirmation.show();
};
