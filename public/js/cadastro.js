document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const inputs = signupForm.querySelectorAll('input');
    
    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearErrors(input));
    });
    
    signupForm.addEventListener('submit', handleSubmit);
    
    function validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous error states
        clearErrors(input);
        
        switch (fieldName) {
            case 'nome':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Nome deve ter pelo menos 2 caracteres';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Digite um e-mail válido';
                }
                break;
                
            case 'usuario':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Nome de usuário deve ter pelo menos 3 caracteres';
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Use apenas letras, números e underscore';
                }
                break;
                
            case 'senha':
                if (value.length < 8) {
                    isValid = false;
                    errorMessage = 'Senha deve ter pelo menos 8 caracteres';
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    isValid = false;
                    errorMessage = 'Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula e 1 número';
                }
                break;
                
            case 'confirmarSenha':
                const senha = document.getElementById('senha').value;
                if (value !== senha) {
                    isValid = false;
                    errorMessage = 'As senhas não coincidem';
                }
                break;
                
            case 'dataNascimento':
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                
                if (age < 13) {
                    isValid = false;
                    errorMessage = 'Você deve ter pelo menos 13 anos';
                } else if (age > 120) {
                    isValid = false;
                    errorMessage = 'Digite uma data válida';
                }
                break;
        }
        
        if (!isValid) {
            showError(input, errorMessage);
        } else {
            showSuccess(input);
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    function showSuccess(input) {
        input.classList.add('success');
        input.classList.remove('error');
        
        // Remove error message
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function clearErrors(input) {
        input.classList.remove('error', 'success');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Show loading state
            const submitBtn = signupForm.querySelector('.btn-signup');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Criando conta...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Show success message and redirect
                alert('Conta criada com sucesso! Redirecionando para o login...');
                window.location.href = 'login.html';
            }, 2000);
        } else {
            // Scroll to first error
            const firstError = signupForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    }
    
    // Auto-format username (remove @ if user types it)
    const usernameInput = document.getElementById('usuario');
    usernameInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (value.startsWith('@')) {
            value = value.substring(1);
        }
        e.target.value = value;
    });
    
    // Add @ prefix display
    usernameInput.addEventListener('focus', () => {
        if (!usernameInput.value) {
            usernameInput.placeholder = 'nomedeusuario';
        }
    });
    
    usernameInput.addEventListener('blur', () => {
        usernameInput.placeholder = '@nomedeusuario';
    });
});

