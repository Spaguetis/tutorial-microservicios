const express = require("express");
const mysql = require("mysql2"); // Cambiado de 'mysql' a 'mysql2'
const app = express();

// Conexión usando mysql2
let conexion = mysql.createConnection({
    host: "localhost",
    database: "tutorial_1_ microservicio",
    user: "root",
    password: "Mayito16",
});

conexion.connect(function(err) {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conexión a la base de datos exitosa.");
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    console.log("Se llamó a /");
    res.render("register");
});

app.post("/validar", function (req, res) {
    const data = req.body;

    let cedula = data.rut;
    let name = data.nombre;
    let lastname = data.primer_apellido;
    let Direccion = data.direccion;
    let Correo = data.correo_electronico;
    let Key = data.pass;

    let register = `
        INSERT INTO informacion_cliente 
        (RUT, nombre, primer_apellido, direccion, correo_electronico, password) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    let values = [cedula, name, lastname, Direccion, Correo, Key];

    conexion.query(register, values, function (error) {
        if (error) {
            console.error("Error al guardar datos:", error);
            res.status(500).send("Error al guardar datos");
        } else {
            console.log("Datos almacenados correctamente.");
            res.send("Registro exitoso");
        }
    });
});

app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000");
});
