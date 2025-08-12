const form = document.querySelector('#signupForm');

form.addEventListener('submit', async (e)=>{
    e.preventDefault(); //Nao deixa a pagina recarregar

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
    
    if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
    }

     const dados = {
            nome,
            email,
            usuario,
            senha,
            dataNascimento
    };

    try{
        const respota = await fetch('/register',{
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        const data = await respota.json();
        console.log(data);

        if (data.success) {
            window.location.href = '/pages/login.html'; // redireciona no navegador
        } else {
            alert(data.erro || 'Erro no login');
        }

    } catch{

    }

})