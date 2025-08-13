// Selecionando o formulário de login
const form = document.querySelector('.login-form');

// Event listener para o formulário de login (código original mantido)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Pegando os valores dos campos de email e senha (COMENTÁRIO ADICIONADO)
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dados = {
        email,
        senha
    }

    try {
        await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        }).then(response => response.json())
        .then(data => {
            // Se o login for bem-sucedido, abre o modal de verificação ao invés de redirecionar
            if (data.success == true) {
                showVerificationModal(); // Nova função para mostrar o modal
                return; // Remove o redirecionamento direto
            }
        })
        .catch(error => console.error('Erro:', error));
    } catch (error) {
        console.error('Erro no login:', error);
    }
});

// NOVAS FUNÇÕES PARA O MODAL DE VERIFICAÇÃO

// Função para mostrar o modal de verificação
function showVerificationModal() {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'flex';
    
    // Limpa o campo de código
    document.getElementById('verification-code').value = '';
    
    // Foca no campo de código
    document.getElementById('verification-code').focus();
}

// Função para esconder o modal de verificação
function hideVerificationModal() {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'none';
}

// Selecionando elementos do modal
const verifyBtn = document.getElementById('verify-btn');
const resendBtn = document.getElementById('resend-btn');
const cancelBtn = document.getElementById('cancel-btn');
const verificationCodeInput = document.getElementById('verification-code');

// Event listener para o botão de verificar
verifyBtn.addEventListener('click', async () => {
    // Pegando o valor do código de verificação (COMENTÁRIO ADICIONADO)
    const verificationCode = verificationCodeInput.value;
    
    if (!verificationCode || verificationCode.length < 4) {
        alert('Por favor, digite um código válido.');
        return;
    }

    try {
        const response = await fetch('/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                code: verificationCode,
                email: document.getElementById('email').value // Usando o email do login
            })
        });

        const data = await response.json();

        if (data.success) {
            hideVerificationModal();
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
        const response = await fetch('/resend-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: document.getElementById('email').value // Usando o email do login (COMENTÁRIO ADICIONADO)
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

// Event listener para o botão de cancelar
cancelBtn.addEventListener('click', () => {
    hideVerificationModal();
});

// Event listener para fechar modal clicando fora dele
document.getElementById('verification-modal').addEventListener('click', (e) => {
    if (e.target.id === 'verification-modal') {
        hideVerificationModal();
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

