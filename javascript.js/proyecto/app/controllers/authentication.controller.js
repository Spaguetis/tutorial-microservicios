import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const usuarios = [{
    user : "a",
    email: "a@a.com",
    password :"$2b$05$rXHfFggQVXmBH05c/LpP0OtysVx9bhbNKiKF572bQnVTVIijyI5fe"
    
}]

async function login(req,res){
  console.log(req.body);
  const user = req.body.user;
  const password =req.body.password;
  if(!user || !password){
    return res.status(400).send({status:"error",message:"Los campos estan incorrectos"})
    }
    const usuarioarevisar = usuarios.find(usuario => usuario.user === user)
    if(!usuarioarevisar){
        return res.status(400).send({status:"error", messsage : "error en el login"})
    }
    const logincorrecto = await bcrypt.compare(password,usuarioarevisar.password);
    if(!logincorrecto){
        return res.status(400).send({status:"error", messsage : "error en el login"})
    }
    const token = jsonwebtoken.sign(
        {user:usuarioarevisar.user},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE});

    const cookieOptions = {
        httpOnly:true,
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        path: "/"
    }
    
    res.cookie("jwt",token,cookieOptions);
    res.send({
        status:"ok",
        message:'Usuario loggeado',
        redirect:"/admin"
    });
}

async function register(req,res){
console.log(req.body);
const user = req.body.user;
const password = req.body.password;
const email = req.body.email;
if(!user || !password || !email){
    return res.status(400).send({status:"error",message:"los campos estan incompletos"})
    } 
    const usuarioarevisar = usuarios.find(usuario => usuario.user === user)
    if(usuarioarevisar){
    return res.status(400).send({status:"error", message : "Este usuario ya existe "})
}
   const salt = await bcrypt.genSalt(5);
   const hashPassword = await  bcrypt.hash(password,salt);
   const nuevousuario = {
    user,email,password: hashPassword
    }   
   usuarios.push(nuevousuario),
   console.log(nuevousuario);
   return res.status(201).send({status:"ok",message:'Usuario creado',redirect:"/"})
   }

export const methods = {
    login,
    register
}