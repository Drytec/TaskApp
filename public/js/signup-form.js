
document.addEventListener('DOMContentLoaded', function() {
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

    
    const requirements = {
        length: document.getElementById('req-length'),
        uppercase: document.getElementById('req-uppercase'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special')
    };

    
    function showToast(message, type = 'error') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    
    function validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        
        
        Object.keys(checks).forEach(key => {
            if (checks[key]) {
                requirements[key].classList.add('met');
            } else {
                requirements[key].classList.remove('met');
            }
        });

        
        return Object.values(checks).every(check => check);
    }

    
    function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('error');
    }

    
    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('error');
    }

    
    passwordInput.addEventListener('input', function() {
        const isValid = validatePassword(this.value);
        
        
        if (isValid && confirmPasswordInput.value === this.value) {
            signupBtn.disabled = false;
        } else {
            signupBtn.disabled = true;
        }
    });

    
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== passwordInput.value) {
            showError(this, 'Las contraseñas no coinciden');
            signupBtn.disabled = true;
        } else {
            clearError(this);
            if (validatePassword(passwordInput.value)) {
                signupBtn.disabled = false;
            }
        }
    });

    
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            showError(this, 'Ingrese un email válido');
        } else {
            clearError(this);
        }
    });

    ageInput.addEventListener('blur', function() {
        const age = parseInt(this.value);
        if (age < 13) {
            showError(this, 'Debes tener al menos 13 años');
        } else if (age > 120) {
            showError(this, 'Ingrese una edad válida');
        } else {
            clearError(this);
        }
    });

    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        
        form.querySelectorAll('input').forEach(input => clearError(input));

        
        const formData = {
            name: firstNameInput.value.trim(),
            lastname: lastNameInput.value.trim(),
            age: parseInt(ageInput.value),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        
        let hasErrors = false;

        if (!formData.name) {
            showError(firstNameInput, 'El nombre es requerido');
            hasErrors = true;
        }

        if (!formData.lastname) {
            showError(lastNameInput, 'Los apellidos son requeridos');
            hasErrors = true;
        }

        if (!formData.age || formData.age < 13) {
            showError(ageInput, 'Edad inválida');
            hasErrors = true;
        }

        if (!validateEmail(formData.email)) {
            showError(emailInput, 'Email inválido');
            hasErrors = true;
        }

        if (!validatePassword(formData.password)) {
            showError(passwordInput, 'La contraseña no cumple los requisitos');
            hasErrors = true;
        }

        if (confirmPasswordInput.value !== formData.password) {
            showError(confirmPasswordInput, 'Las contraseñas no coinciden');
            hasErrors = true;
        }

        if (hasErrors) return;

        
        btnText.style.display = 'none';
        spinner.classList.remove('hidden');
        signupBtn.disabled = true;

        
        const result = await signup(formData);

        
        btnText.style.display = 'inline';
        spinner.classList.add('hidden');

        if (result.success) {
            showToast('¡Registro exitoso! Redirigiendo al login...', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showToast(result.error);
            signupBtn.disabled = false;
        }
    });
});