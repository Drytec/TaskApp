const form = document.getElementById('form')
const nameInput = form.querySelector('[name="name"]')
const lastNamesInput = form.querySelector('[name="lastNames"]')
const ageInput = form.querySelector('[name="age"]')
const emailInput = form.querySelector('[name="email"]')
const passwordInput = form.querySelector('[name="password"]')
const confirmPasswordInput = form.querySelector('[name="confirmPassword"]')
const errorMessage = document.getElementById('error-message')
const rules = {
    length: document.getElementById('rule-length'),
    uppercase: document.getElementById('rule-uppercase'),
    number: document.getElementById('rule-number'),
    special: document.getElementById('rule-special')
};

function setValid(element) {
    element.classList.add('valid');
    element.classList.remove('invalid');
}

function setInvalid(element) {
    element.classList.add('invalid');
    element.classList.remove('valid');
}

form.addEventListener('submit', (e) => {
    form.querySelectorAll('.incorrect').forEach(el => el.classList.remove('incorrect'))
    let errors = []
    if (nameInput){
        errors=getSignupFormErrors(nameInput.value,lastNamesInput.value,ageInput.value,emailInput.value,passwordInput.value,confirmPasswordInput.value)
    }
    else {
        errors=getLoginFormErrors(emailInput.value,passwordInput.value)
    }
    if (errors.length>0) {
        e.preventDefault()
        errorMessage.innerText = errors.join(" - ")
    }
})
passwordInput.addEventListener('input', () => {
    updatePasswordRules(passwordInput.value);
});

function updatePasswordRules(password) {

    password.length >= 8 ? setValid(rules.length) : setInvalid(rules.length);
    /[A-Z]/.test(password) ? setValid(rules.uppercase) : setInvalid(rules.uppercase);
    /[0-9]/.test(password) ? setValid(rules.number) : setInvalid(rules.number);
    /[!@#$%^&*]/.test(password) ? setValid(rules.special) : setInvalid(rules.special);
}

function getSignupFormErrors(name,lastNames,age,email,password,confirmPassword) {
    let errors = []
    if (name==='' || name===null) {
        errors.push('Nombre es requerido');
        nameInput.classList.add('incorrect');
    }
    if (lastNames==='' || lastNames===null) {
        errors.push('Apellidos son requeridos');
        lastNamesInput.classList.add('incorrect');
    }
    if (age==='' || age===null) {
        errors.push('Edad es requerida');
        ageInput.classList.add('incorrect');
    }
    if (age < 0) {
        errors.push('Edad no puede ser negativa');
        ageInput.classList.add('incorrect');
    }
    if (email==='' || email===null) {
        errors.push('Correo Electrónico es requerido');
        emailInput.classList.add('incorrect');
    }
    if (!/[@.]/.test(email)) {
        errors.push('El correo electrónico es inválido');
        emailInput.classList.add('incorrect');
    }
    if (password==='' || password===null) {
        errors.push('Contraseña es requerida');
        passwordInput.classList.add('incorrect');
    }
    if (password !== confirmPassword) {
        errors.push('Las contraseñas no coinciden');
        confirmPasswordInput.classList.add('incorrect');
    }

    
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        errors.push('La contraseña es invalida');
    }

    return errors
}

function getLoginFormErrors(email,password){
    let errors = []

    if (email==='' || email===null) {
        errors.push('Correo Electrónico es requerido');
        emailInput.classList.add('incorrect');}
    if (password==='' || password===null) {
        errors.push('Contraseña es requerida');
        passwordInput.classList.add('incorrect');
    
    return errors
}
}

const allInputs = [nameInput, lastNamesInput, ageInput, emailInput, passwordInput, confirmPasswordInput]
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('incorrect')) {
            input.classList.remove('incorrect')
        }
    })
})