// Selecionando o formulário de login
const form = document.querySelector('.login-form');
const loginBtn = document.getElementById('login-btn');
const btnText = document.querySelector('.btn-text');
const loadingSpinner = document.getElementById('loading-spinner');

// Função para mostrar o indicador de carregamento
function showLoading() {
    btnText.textContent = 'Carregando...';
    loadingSpinner.style.display = 'inline-block';
    loginBtn.disabled = true;
}

// Função para esconder o indicador de carregamento
function hideLoading() {
    btnText.textContent = 'Entrar';
    loadingSpinner.style.display = 'none';
    loginBtn.disabled = false;
}

// Event listener para o formulário de login (código atualizado)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mostra o indicador de carregamento
    showLoading();
    
    // Pegando os valores dos campos de email e senha
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dados = {
        email,
        senha
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const data = await response.json();
        
        // Esconde o indicador de carregamento
        hideLoading();
        
        // Se o login for bem-sucedido, abre o modal de verificação ao invés de redirecionar
        if (data.success == true) {
            showVerificationModal(); // Nova função para mostrar o modal
            return; // Remove o redirecionamento direto
        } else {
            alert('Email ou senha incorretos. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        hideLoading();
        alert('Erro ao fazer login. Tente novamente.');
    }
});

// NOVAS FUNÇÕES PARA O MODAL DE VERIFICAÇÃO

// Função para mostrar o modal de verificação
function showVerificationModal() {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'flex';
    modal.classList.add('no-close');
    
    // Limpa o campo de código
    document.getElementById('verification-code').value = '';
    
    // Foca no campo de código
    document.getElementById('verification-code').focus();
    
    // Previne o fechamento do modal clicando fora dele
    modal.addEventListener('click', preventModalClose);
    
    // Previne o fechamento do modal com a tecla ESC
    document.addEventListener('keydown', preventEscapeClose);
}

// Função para esconder o modal de verificação
function hideVerificationModal() {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'none';
    modal.classList.remove('no-close');
    
    // Remove os event listeners de prevenção de fechamento
    modal.removeEventListener('click', preventModalClose);
    document.removeEventListener('keydown', preventEscapeClose);
}

// Função para prevenir o fechamento do modal clicando fora
function preventModalClose(e) {
    if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
    }
}

// Função para prevenir o fechamento do modal com ESC
function preventEscapeClose(e) {
    if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
    }
}

// Selecionando elementos do modal
const verifyBtn = document.getElementById('verify-btn');
const resendBtn = document.getElementById('resend-btn');
const verificationCodeInput = document.getElementById('verification-code');

// Event listener para o botão de verificar
verifyBtn.addEventListener('click', async () => {
    // Pegando o valor do código de verificação
    const verificationCode = verificationCodeInput.value;
    
    if (!verificationCode || verificationCode.length < 4) {
        alert('Por favor, digite um código válido.');
        return;
    }

    try {
        const response = await fetch('/verificarcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                codigo: verificationCode,
            })
        });

        const data = await response.json();

        if (data.success) {
            // Redireciona para a página home após verificação bem-sucedida
            window.location.href = '/pages/home';
        } else {
            alert('Código inválido. Tente novamente.');
            verificationCodeInput.value = '';
            verificationCodeInput.focus();
        }
    } catch (error) {
        console.error('Erro na verificação:', error);
        alert('Erro ao verificar código. Tente novamente.');
    }
});

// Event listener para o botão de reenviar código
resendBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/verificarcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: document.getElementById('email').value // Usando o email do login
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Código reenviado para seu email!');
        } else {
            alert('Erro ao reenviar código. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao reenviar código:', error);
        alert('Erro ao reenviar código. Tente novamente.');
    }
});

// Event listener para permitir apenas números no campo de código
verificationCodeInput.addEventListener('input', (e) => {
    // Remove caracteres não numéricos
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Event listener para pressionar Enter no campo de código
verificationCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyBtn.click();
    }
});

