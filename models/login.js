import mongoose from 'mongoose';

const LoginSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // Nome completo
  email: { type: String, required: true, unique: true }, // E-mail único
  usuario: { type: String, required: true, unique: true }, // Nome de usuário único
  senha: { type: String, required: true }, // Senha criptografada
  dataNascimento: { type: Date, required: true }, // Data de nascimento

  // Lista de IDs dos posts que o usuário deu like
  likes: { type: [String], default: [] },

  // Lista de IDs dos tweets/posts do usuário
  tweets: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('login', LoginSchema);
