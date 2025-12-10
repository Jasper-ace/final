# Password Reset Functionality Guide

## How It Works

The password reset functionality is fully implemented and working. Here's how users can reset their password:

### Step 1: Request Password Reset
1. Go to the homepage: https://jasper-ace.github.io/IAS/
2. Click the "Login" button in the navigation
3. In the login modal, click "Forgot Password?"
4. Enter your email address
5. Click "Send Reset Link"

### Step 2: Check Email
- You will receive an email from Supabase with a password reset link
- The email subject will be something like "Reset Your Password"
- Click the link in the email

### Step 3: Reset Password
- The link will take you to: https://jasper-ace.github.io/IAS/reset-password.html
- The URL will include a secure token (e.g., `?access_token=...&type=recovery`)
- Enter your new password (minimum 6 characters)
- Confirm your new password
- Click "Reset Password"

### Step 4: Login with New Password
- After successful reset, you'll be redirected to the homepage
- Click "Login" and use your new password

## Features

### Password Strength Indicator
- The reset password page shows a real-time password strength indicator
- Passwords are rated as: Weak, Fair, Good, or Strong
- Based on length, uppercase, lowercase, numbers, and special characters

### Security Features
- Password reset links expire after a certain time
- Links can only be used once
- Minimum password length of 6 characters
- Password confirmation to prevent typos

### User-Friendly Messages
- Clear success messages when reset link is sent
- Helpful error messages if something goes wrong
- Visual feedback during the reset process

## Testing

To test the password reset functionality:

1. Create a test account with a real email address you can access
2. Use the "Forgot Password" flow
3. Check your email for the reset link
4. Click the link and set a new password
5. Login with the new password

## Technical Details

### Files Involved
- `reset-password.html` - The password reset page
- `assets/js/supabase-config.js` - Contains the `resetPassword()` function
- `assets/js/auth.js` - Handles the forgot password modal

### Supabase Configuration
- Uses Supabase Auth's `resetPasswordForEmail()` method
- Redirect URL is automatically set to the correct environment (local or production)
- Email templates can be customized in Supabase dashboard

### URL Parameters
The reset link includes these parameters:
- `access_token` - The secure reset token
- `type=recovery` - Indicates this is a password recovery
- `error` - Present if there's an error
- `error_description` - Details about the error

## Troubleshooting

### "Invalid or expired reset link"
- The link may have expired (usually 1 hour)
- The link may have already been used
- Request a new reset link

### "Failed to send reset email"
- Check that the email address is correct
- Check that the email is registered in the system
- Check your spam folder

### Email not received
- Wait a few minutes (emails can be delayed)
- Check spam/junk folder
- Verify the email address is correct
- Try requesting another reset link

## Production URL
https://jasper-ace.github.io/IAS/reset-password.html

Note: This page should only be accessed via the reset link from email. Direct access will show a helpful message directing users to use the "Forgot Password" link.
