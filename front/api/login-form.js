
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const spinner = document.getElementById('login-spinner');

    
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

    
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    
    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            emailError.textContent = 'Ingrese un email válido';
            this.classList.add('error');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        
        let hasErrors = false;

        if (!email) {
            emailError.textContent = 'El email es requerido';
            emailInput.classList.add('error');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Ingrese un email válido';
            emailInput.classList.add('error');
            hasErrors = true;
        }

        if (!password) {
            passwordError.textContent = 'La contraseña es requerida';
            passwordInput.classList.add('error');
            hasErrors = true;
        }

        if (hasErrors) return;

        
        btnText.style.display = 'none';
        spinner.classList.remove('hidden');
        loginBtn.disabled = true;

        
        const result = await login(email, password);

        
        btnText.style.display = 'inline';
        spinner.classList.add('hidden');
        loginBtn.disabled = false;

        if (result.success) {
            showToast('¡Inicio de sesión exitoso!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard'; 
            }, 1000);
        } else {
            showToast(result.error);
        }
    });
});