import fetch from "node-fetch";

const form = document.querySelector('.login-form');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const email = document.getElementById('email');
    const senha = document.getElementById('senha');

    const dados = {
        email:email,
        senha:senha
    }

    try {
       await fetch('/login',{
        method:'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
       }).then(response => response.json())
 .then(data =>{
    if(data.success == true) return window.location.href = '/'
 })
 .catch(error => console.error('Erro:', error));
    } catch (error) {
        
    }
})