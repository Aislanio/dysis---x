import express from 'express'
import cors from 'cors';
let IDS = 3

const app = express();
app.use(express.json());
app.use(cors());
const mensagens = [
    {
        id:1,
        name:"Rbson",
        msg:"Vai catar coquinho",
        likes:0,
        dislikes:0,
        comments:[

        ]
    },
    {
        id:2,
        name:"Jeff",
        msg:"SELOKO NUM COMPENSA",
        likes:0,
        dislikes:0,
        comments:[

        ]
    }
]
//Create
app.post('/mgs',(req,res)=>{
    const {name,msg,likes,dislikes,comments} = req.body
    const mensagemUser ={
        id:IDS,
        name:name,
        msg:msg,
        likes:likes,
        dislikes:dislikes,
        comments:comments
    }
    mensagens.push(mensagemUser)
    IDS++;

    res.send('MENSAGEN ENVIADA COM SUCESSO')
    
})
app.post('/mgs/comments/:id',(req,res)=>{
    console.log('ACESSANDO CMMENTS')
    const ID = req.params.id
    const {name,msg} = req.body
    const commentUser ={
        name:name,
        msg:msg
    }
   const index = mensagens.findIndex(ids => ids.id == ID)
    mensagens[index].comments.push(commentUser)
    res.send("SEU COMENTARIO FOI ENVIADO")
    
})

//READE
app.get('/mgs',(req,res)=>{
    res.json(mensagens)
})
app.get("/mgs/:id",(req,res)=>{
    const ID = req.params.id
    //const mgse = mensagens.find((element)=> element.id == ID)
    const mgse = mensagens.findIndex(mensagen => mensagen.id == ID)
    const mensagen = mensagens[mgse]
    res.send(mensagen)

})
//UPDATE
app.put('/mgs/:id',(req,res)=>{
    const ID = req.params.id
    //const mgse = mensagens.find((element)=> element.id == ID)
    const mgse = mensagens.findIndex(mensagen => mensagen.id == ID)
    const novaMSG = req.body
    mensagens[mgse] = novaMSG
    res.send(mgse)
})
//Delete


app.listen(1000,()=>{
    console.log('SERVIDOR RODANDO')
})