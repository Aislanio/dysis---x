
const form = document.querySelector('.login-form');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dados = {
        email,
        senha
    }

    try {
       await fetch('/login',{
        method:'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
       }).then(response => response.json())
 .then(data =>{
    if(data.success == true) return window.location.href = '/pages/home'
 })
 .catch(error => console.error('Erro:', error));
    } catch (error) {
        
    }
})