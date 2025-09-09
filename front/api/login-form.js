document.addEventListener('DOMContentLoaded', function() {
    // Select the login form and input elements
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = document.getElementById('login-spinner');

    // Function to show a toast message (error or success)
    function showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`; // Add class based on type ('error' or 'success')
        toast.style.display = 'block';
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Email validation function using regex
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Clear error messages and styles
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    // Validate email when input loses focus (blur event)
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            emailError.textContent = 'Please enter a valid email';
            this.classList.add('error');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Form submission event handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submit
        clearErrors();      // Clear previous errors

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasErrors = false;

        // Validate email presence and format
        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('error');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email';
            emailInput.classList.add('error');
            hasErrors = true;
        }

        // Validate password presence
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
            hasErrors = true;
        }

        // Stop if there are validation errors
        if (hasErrors) return;

        // Show loading spinner and disable login button during async operation
        btnText.style.display = 'none';
        spinner.classList.remove('hidden');
        loginBtn.disabled = true;

        // Call the login function (assumes login is defined elsewhere)
        const result = await login(email, password);

        // Restore button state
        btnText.style.display = 'inline';
        spinner.classList.add('hidden');
        loginBtn.disabled = false;

        // Handle login result
        if (result.success) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = '/welcome-dashboard'; // Redirect on success
            }, 1000);
        } else {
            showToast(result.error); // Show error message
        }
    });
});
