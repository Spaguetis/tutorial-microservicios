const express = require("express");
const mysql = require("mysql")
const app = express();

let conexion = mysql.createConnection({
    host:"localhost",
    database:"tutorial_1_microservicio",
    user:"root",
    password:"Mayito16",
})


app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", function(req, res) {
    res.render("register");
});

app.get("/", function(req, res) {
    console.log("Se llamó a /");
    res.render("register");
});

app.post("/validar", function(req,res){
    const data = req.body;

    let cedula = data.rut;
    let name = data.nombre;
    let lastname = data.primer_apellido;
    let Direccion = data.direccion;
    let Correo = data.correo_electronico;
    let Key = data.pass;

    let register = "INSERT INTO informacion_cliente (RUT,nombre,primer_apellido,direccion,correo_electronico,password) VALUES('"+cedula+"','"+name+"','"+lastname+"','"+Direccion+"','"+Correo+"','"+Key+"')";
    
    conexion.query(register, function(error){
        if(error){
            throw error;
        }else{
            console.log("datos almacenados");
        }
    });
})

app.listen(3000, function() {
    console.log("servidor creado http://localhost:3000");
});
