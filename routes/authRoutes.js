import express from 'express'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import MensagensModel from '../models/mensagen.js'
import LoginModel from '../models/login.js'


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

//Create
router.post('/mgs',VerificarToken,async (req,res)=>{
  const id = req.userId;
  
  const user = await LoginModel.findById(id).select('-senha')

  if(!user) return res.status(404).send("Usuario não encontrado");
    const name = user.nome
    
    try {
        const {msg} = req.body;
        await MensagensModel.create({name,msg,likes:0,dislikes:0,comments:[],ipReactionsTrue: [],ipReactionsFalse: []})
        res.status(201).json("Tudo certo");  
    } catch (error) {
        res.status(500).json({ erro: error.message, stack: error.stack });
        console.log(error)
    }

    
})
router.post('/mgs/comments/:id',VerificarToken,async(req,res)=>{
    console.log('ACESSANDO CMMENTS')
    const ID = req.params.id
    const {msg} = req.body

    const id = req.userId;
  
    const user = await LoginModel.findById(id).select('-senha')

    if(!user) return res.status(404).send("Usuario não encontrado");
    const name = user.nome

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

router.post('/mgs/react/:id', async (req, res) => {
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

router.post('/register',async(req,res) =>{
  
  console.log('Entrou no register');
  try{
    const {nome,email,usuario,senha,dataNascimento} = req.body

    const existe = await LoginModel.findOne({email});
    if(existe) return res.status(404).json({erro:"Usuari o ja existe"})

    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha,salt);

    await LoginModel.create({nome,email,usuario,senha:senhaHash,dataNascimento})

    res.json({ success: true });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
})


router.post('/login',async (req,res)=>{
  const {email,senha} = req.body
  const user = await LoginModel.findOne({email});
  if(!user) return res.status(404).send('Usuario não encontrado');

  const valide = await bcrypt.compare(senha,user.senha);
  if(!valide) return res.status(404).send('Senha incorreta');

  const token = jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRET,{expiresIn:'1d'})

  res.cookie('token',token,{httpOnly:true, sameSite:'Strict', maxAge: 3600000})

  res.json({ success: true });
})

//READE
router.get('/mgs',async (req,res)=>{
     try {
    const mensagens = await MensagensModel.find().sort({createdAt: -1}) ;
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar mensagens' });
  }
})
//mgs mais curtidos

router.get('/mgs/top',async(req,res)=>{
  try {
    const limit = parseInt(req.query.limit) || 5;

    const maisCurtidas = await MensagensModel.find()
      .sort({ likes: -1 }) 
      .limit(limit); 

    res.json(maisCurtidas);
  } catch (error) {
    console.error("Erro ao buscar mensagens mais curtidas:", error);
    res.status(500).json({ erro: 'Erro ao buscar mensagens mais curtidas' });
  }
});



router.get("/mgs/:id",async (req,res)=>{
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
//ROTAS PROTEGIDAS
router.get('/pages/home', VerificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../privatePages/home.html'));

    
});

router.get('/api/userinfo', VerificarToken, async (req, res) => {
  // Aqui você pode buscar mais dados do usuário no banco, se quiser
  const id = req.userId;

  const user = await LoginModel.findById(id).select('-senha')

  if(!user) return res.status(404).send("Usuario não encontrado");

  res.json(user)

});

  function VerificarToken(req,res,next){
    const JWT_SECRETs = process.env.JWT_SECRET
    const token = req.cookies.token
    
    if(!token) return res.redirect('/pages/login.html')
    
    jwt.verify(token,JWT_SECRETs,(err,decoded)=>{
      if(err) return res.redirect('/pages/login.html')
        req.userId = decoded.id
        next();
    })

  }


export default router;