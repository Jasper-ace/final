// ============================================
// XENDIT PAYMENT INTEGRATION
// ============================================

class XenditPayment {
    constructor() {
        this.backendUrl = 'http://localhost:3000/api';
        this.currentCourse = null;
    }

    // Show payment modal
    showPaymentModal(course) {
        this.currentCourse = course;
        
        const modal = document.createElement('div');
        modal.id = 'xenditPaymentModal';
        modal.className = 'xendit-modal';
        modal.innerHTML = `
            <div class="xendit-modal-content">
                <div class="xendit-modal-header">
                    <h2>Complete Your Enrollment</h2>
                    <button class="xendit-close">&times;</button>
                </div>
                
                <div class="xendit-modal-body">
                    <div class="course-summary">
                        <h3>${course.title}</h3>
                        <div class="price-display">
                            <span class="price-label">Total Amount:</span>
                            <span class="price-amount">₱${course.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="payment-methods">
                        <h4>Select Payment Method</h4>
                        
                        <div class="payment-method-grid">
                            <!-- Credit/Debit Card -->
                            <button class="payment-method-btn" data-method="card">
                                <i class="fas fa-credit-card"></i>
                                <span>Credit/Debit Card</span>
                            </button>

                            <!-- GCash -->
                            <button class="payment-method-btn" data-method="gcash">
                                <img src="assets/images/payment-logos/Gcash.png" alt="GCash" style="height: 40px; width: auto;">
                                <span>GCash</span>
                            </button>

                            <!-- PayMaya -->
                            <button class="payment-method-btn" data-method="paymaya">
                                <img src="assets/images/payment-logos/Maya.png" alt="PayMaya" style="height: 40px; width: auto;">
                                <span>PayMaya</span>
                            </button>

                            <!-- GrabPay -->
                            <button class="payment-method-btn" data-method="grabpay">
                                <img src="assets/images/payment-logos/Grabpay.png" alt="GrabPay" style="height: 40px; width: auto;">
                                <span>GrabPay</span>
                            </button>
                        </div>
                    </div>

                    <div class="customer-info-form" style="display: none;">
                        <h4>Customer Information</h4>
                        <form id="customerInfoForm">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" id="customerName" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" id="customerEmail" required>
                            </div>
                            <button type="submit" class="btn-proceed">
                                <span class="btn-text">Proceed to Payment</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Processing...
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.attachModalEvents(modal);
    }

    // Attach event listeners to modal
    attachModalEvents(modal) {
        // Close button
        const closeBtn = modal.querySelector('.xendit-close');
        closeBtn.addEventListener('click', () => this.closeModal());

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Payment method selection
        const methodButtons = modal.querySelectorAll('.payment-method-btn');
        methodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                methodButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                // Show customer info form
                modal.querySelector('.customer-info-form').style.display = 'block';
                // Store selected method
                this.selectedMethod = btn.dataset.method;
            });
        });

        // Form submission
        const form = modal.querySelector('#customerInfoForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });
    }

    // Process payment
    async processPayment() {
        const modal = document.getElementById('xenditPaymentModal');
        const btnText = modal.querySelector('.btn-text');
        const btnLoading = modal.querySelector('.btn-loading');
        const proceedBtn = modal.querySelector('.btn-proceed');

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        proceedBtn.disabled = true;

        try {
            // Get customer info
            const customerInfo = {
                name: document.getElementById('customerName').value.trim(),
                email: document.getElementById('customerEmail').value.trim(),
                phone: '',
                successUrl: `${window.location.origin}/IAS/payment-success.html?course=${this.currentCourse.id}`,
                failureUrl: `${window.location.origin}/IAS/payment-failed.html?course=${this.currentCourse.id}`,
                description: this.currentCourse.title
            };

            // Store payment info
            const referenceId = `${this.selectedMethod}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('pendingPayment', JSON.stringify({
                paymentId: referenceId,
                paymentMethod: this.selectedMethod,
                amount: this.currentCourse.price,
                courseId: this.currentCourse.id,
                courseName: this.currentCourse.title,
                customerName: customerInfo.name,
                customerEmail: customerInfo.email
            }));

            // For e-wallets, redirect to custom payment pages (bypass Xendit callback URL requirement)
            if (this.selectedMethod === 'gcash') {
                const paymentUrl = `gcash.html?course=${this.currentCourse.id}&amount=${this.currentCourse.price}&name=${encodeURIComponent(this.currentCourse.title)}&ref=${referenceId}`;
                window.location.href = paymentUrl;
            } else if (this.selectedMethod === 'paymaya') {
                const paymentUrl = `paymaya.html?course=${this.currentCourse.id}&amount=${this.currentCourse.price}&name=${encodeURIComponent(this.currentCourse.title)}&ref=${referenceId}`;
                window.location.href = paymentUrl;
            } else if (this.selectedMethod === 'grabpay') {
                const paymentUrl = `grabpay.html?course=${this.currentCourse.id}&amount=${this.currentCourse.price}&name=${encodeURIComponent(this.currentCourse.title)}&ref=${referenceId}`;
                window.location.href = paymentUrl;
            } else if (this.selectedMethod === 'card') {
                // For cards, use invoice (supports all methods)
                const response = await this.createInvoice(customerInfo);
                
                if (response.success) {
                    const paymentUrl = response.data.invoice_url;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                    } else {
                        throw new Error('Payment URL not found');
                    }
                } else {
                    throw new Error(response.error || 'Payment creation failed');
                }
            }

        } catch (error) {
            console.error('Payment error:', error);
            alert(`Payment Error: ${error.message}`);
            
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            proceedBtn.disabled = false;
        }
    }

    // Create Xendit Invoice
    async createInvoice(customerInfo) {
        try {
            const response = await fetch(`${this.backendUrl}/payments/create-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: this.currentCourse.price,
                    description: this.currentCourse.title,
                    customer: customerInfo,
                    items: [{
                        name: this.currentCourse.title,
                        quantity: 1,
                        price: this.currentCourse.price,
                        category: 'Education'
                    }]
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Create invoice error:', error);
            return { success: false, error: error.message };
        }
    }

    // Create E-Wallet Charge
    async createEWalletCharge(ewalletType, customerInfo) {
        try {
            const response = await fetch(`${this.backendUrl}/payments/create-ewallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ewalletType: ewalletType.toUpperCase(),
                    amount: this.currentCourse.price,
                    customer: customerInfo
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Create e-wallet charge error:', error);
            return { success: false, error: error.message };
        }
    }

    // Close modal
    closeModal() {
        const modal = document.getElementById('xenditPaymentModal');
        if (modal) {
            modal.remove();
        }
    }
}

// Create global instance
window.xenditPayment = new XenditPayment();

// Helper function to show payment modal
window.showXenditPayment = function(course) {
    window.xenditPayment.showPaymentModal(course);
};
