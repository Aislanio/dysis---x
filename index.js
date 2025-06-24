import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import MensagensModel from './models/mensagen.js'

let IDS = 3

const app = express();

dotenv.config()

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const connectDB = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB conectado")     
    } catch (error) {
        console.log('ERRO NA CONEXAO', error)
    }
    
}

connectDB()

//Create
app.post('/mgs',async (req,res)=>{

    try {
        const {name,msg} = req.body;

        const mensagemUser = new MensagensModel({
            name,
            msg,
            likes:0,
            dislikes:0,
            comments:[],
            ipReactionsTrue: [],
            ipReactionsFalse: []
        })
        const salva = await mensagemUser.save();
        res.status(201).json(salva);  
    } catch (error) {
        res.status(500).json({ erro: error.message, stack: error.stack });
    }

    
    
})
app.post('/mgs/comments/:id',async(req,res)=>{
    console.log('ACESSANDO CMMENTS')
    const ID = req.params.id
    const {name,msg} = req.body

    const commentUser ={
        name:name,
        msg:msg
    }

    try {
       const atualizada = await MensagensModel.findOneAndUpdate(
        {_id : ID},
        {$push:{comments:commentUser} },
        {new:true}

       )

       if (!atualizada) return res.status(404).json({ erro: 'Mensagem não encontrada' });
       res.json(atualizada);
    } catch (error) {
         res.status(500).json({ erro: 'Erro ao adicionar comentário' });
    }
    
})

app.post('/mgs/react/:id', async (req, res) => {
  const ID = (req.params.id)
  const { react } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const mensagem = await MensagensModel.findOne({ _id: ID });
    if (!mensagem) return res.status(404).json({ erro: 'Mensagem não encontrada' });

    const jaDeuLike = mensagem.ipReactionsTrue.includes(ip);
    const jaDeuDislike = mensagem.ipReactionsFalse.includes(ip);

    // Like
    if (react === true) {
      if (jaDeuLike) return res.send('Já deu like, fi');

      if (jaDeuDislike) {
        mensagem.dislikes -= 1;
        mensagem.ipReactionsFalse = mensagem.ipReactionsFalse.filter(item => item !== ip);
      }

      mensagem.likes += 1;
      mensagem.ipReactionsTrue.push(ip);
    }

    // Dislike
    else if (react === false) {
      if (jaDeuDislike) return res.send('Já deu dislike, fi');

      if (jaDeuLike) {
        mensagem.likes -= 1;
        mensagem.ipReactionsTrue = mensagem.ipReactionsTrue.filter(item => item !== ip);
      }

      mensagem.dislikes += 1;
      mensagem.ipReactionsFalse.push(ip);
    }

    await mensagem.save();
    return res.json(mensagem);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao processar reação' });
  }
});




//READE
app.get('/mgs',async (req,res)=>{
     try {
    const mensagens = await MensagensModel.find();
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mensagens' });
  }
})
app.get("/mgs/:id",async (req,res)=>{
    const ID = req.params.id
    const mensg = await MensagensModel.findOne({_id: ID})

    const mensagen = {
        id: mensg.id,
        name:mensg.name,
        msg:mensg.msg,
        likes:mensg.likes,
        dislikes:mensg.dislikes,
        comments:mensg.comments
    }
    res.send(mensagen)

})
//UPDATE
app.put('/mgs/:id',(req,res)=>{
    
})
//Delete


const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});