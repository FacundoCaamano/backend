import { Router } from "express";
import UserModel from "../dao/models/user.model.js";

const router=Router()

//vista de register
router.get('/register', (req,res)=> {
    res.render('sessions/register')
})


//api para crear usuarios
router.post('/register', async(req, res)=>{
    const userNew = req.body
    console.log(userNew)

    const user = new UserModel(userNew)
    await user.save()

    res.redirect('/session/login')
})

//vista de login

router.get('/login',(req,res)=>{
    res.render('sessions/login')
})

//api para login
router.post('/login' , async(req,res)=>{
    const {email}=req.body
    const {password}=req.body

    
    const user= await UserModel.findOne({email, password}).lean().exec()
    if (!user){
        return res.status(401).render('error/base', {
            error: 'Error en usuario y password'
        })
    }
    if (email=== 'adminCoder@coder.com' && password==='adminCod3r123'){
        user.role='admin'
    }
    req.session.user=user

    res.redirect('/api/products')
})

//cerrar sesion
router.get('/logout', async(req, res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
            res.status(500).render('error/base', {error: err})
        }else res.redirect('/session/login')
    })
})

export default router