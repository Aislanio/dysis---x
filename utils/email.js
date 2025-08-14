import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();

export async function EnviarCodigo(email,codigo){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.SENHA_GMAIL 
        }
    })

    await transporter.sendMail({
    from: '"Dysis--x" <seuemail@gmail.com>',
    to: email,
    subject: "Código de Verificação",
    text: `Seu código é: ${codigo}`,
  });

}

