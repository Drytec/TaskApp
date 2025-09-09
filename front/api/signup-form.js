document.addEventListener('DOMContentLoaded', function() {
    // Select form and input elements
    const form = document.querySelector('.signup-form');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const ageInput = document.getElementById('age');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('signup-btn');
    const btnText = signupBtn.querySelector('.btn-text');
    const spinner = document.getElementById('signup-spinner');

    // Password requirements indicators elements
    const requirements = {
        length: document.getElementById('req-length'),
        uppercase: document.getElementById('req-uppercase'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special')
    };

    // Show toast notification with message and type (error or success)
    function showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        toastMessage.textContent = message;
        toast.className = `toast ${type}`; // Add class based on type
        toast.style.display = 'block';

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // Validate email format using regex
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password against requirements
    function validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        // Update UI indicators based on which checks passed
        Object.keys(checks).forEach(key => {
            if (checks[key]) {
                requirements[key].classList.add('met');
            } else {
                requirements[key].classList.remove('met');
            }
        });

        // Return true only if all checks are met
        return Object.values(checks).every(check => check);
    }

    // Clear error message and error styling for a given input
    function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('error');
    }

    // Show error message and apply error styling to input
    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('error');
    }

    // Listen for password input changes to validate password live
    passwordInput.addEventListener('input', function() {
        const isValid = validatePassword(this.value);

        // Enable signup button only if password is valid and matches confirmation
        if (isValid && confirmPasswordInput.value === this.value) {
            signupBtn.disabled = false;
        } else {
            signupBtn.disabled = true;
        }
    });

    // Listen for confirm password input changes to validate matching passwords live
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== passwordInput.value) {
            showError(this, 'Passwords do not match');
            signupBtn.disabled = true;
        } else {
            clearError(this);
            if (validatePassword(passwordInput.value)) {
                signupBtn.disabled = false;
            }
        }
    });

    // Validate email format on blur event
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email');
        } else {
            clearError(this);
        }
    });

    // Validate age input on blur event
    ageInput.addEventListener('blur', function() {
        const age = parseInt(this.value);
        if (age < 13) {
            showError(this, 'You must be at least 13 years old');
        } else if (age > 120) {
            showError(this, 'Please enter a valid age');
        } else {
            clearError(this);
        }
    });

    // Form submission event handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear all previous errors
        form.querySelectorAll('input').forEach(input => clearError(input));

        // Collect trimmed form data
        const formData = {
            name: firstNameInput.value.trim(),
            lastname: lastNameInput.value.trim(),
            age: parseInt(ageInput.value),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        let hasErrors = false;

        // Validate first name presence
        if (!formData.name) {
            showError(firstNameInput, 'First name is required');
            hasErrors = true;
        }

        // Validate last name presence
        if (!formData.lastname) {
            showError(lastNameInput, 'Last name is required');
            hasErrors = true;
        }

        // Validate age presence and minimum age
        if (!formData.age || formData.age < 13) {
            showError(ageInput, 'Invalid age');
            hasErrors = true;
        }

        // Validate email format
        if (!validateEmail(formData.email)) {
            showError(emailInput, 'Invalid email');
            hasErrors = true;
        }

        // Validate password against requirements
        if (!validatePassword(formData.password)) {
            showError(passwordInput, 'Password does not meet requirements');
            hasErrors = true;
        }

        // Validate password confirmation matches
        if (confirmPasswordInput.value !== formData.password) {
            showError(confirmPasswordInput, 'Passwords do not match');
            hasErrors = true;
        }

        // Stop submission if there are validation errors
        if (hasErrors) return;

        // Show loading spinner and disable signup button during async operation
        btnText.style.display = 'none';
        spinner.classList.remove('hidden');
        signupBtn.disabled = true;

        // Call signup function (assumes signup is defined elsewhere)
        const result = await signup(formData);

        // Restore button state
        btnText.style.display = 'inline';
        spinner.classList.add('hidden');

        // Handle signup result
        if (result.success) {
            showToast('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showToast(result.error);
            signupBtn.disabled = false;
        }
    });
});