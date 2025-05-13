const express = require("express");
const mysql = require("mysql2");
const app = express();

// Conexión a MySQL
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

// Configuración del motor de vistas
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Ruta principal - Registro
app.get("/", function (req, res) {
    console.log("Se llamó a /");
    res.render("register");
});

// Ruta para mostrar la vista del login
app.get("/login", function (req, res) {
    console.log("Se llamó a /login");
    res.render("login");
});

// Ruta para validar registro
app.post("/validar", function (req, res) {
    const data = req.body;

    let cedula = data.rut;
    let name = data.nombre;
    let lastname = data.primer_apellido;
    let Direccion = data.direccion;
    let Correo = data.correo_electronico;
    let Key = data.pass;

    let search = "SELECT * FROM informacion_cliente WHERE rut = ?";
    conexion.query(search, [cedula], function (error, row) {
        if (error) {
            console.error("Error al buscar el usuario:", error);
            res.status(500).send("Error en la base de datos");
        } else {
            if (row.length > 0) {
                console.log("Usuario ya existe");
                res.status(400).send("Usuario ya existe");
            } else {
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
            }
        }
    });
});

// Ruta para validar login
app.post("/login", function (req, res) {
    const data = req.body;

    let rut = data.rut;
    let password = data.pass;

    let loginQuery = "SELECT * FROM informacion_cliente WHERE RUT = ? AND password = ?";
    let values = [rut, password];

    conexion.query(loginQuery, values, function (error, results) {
        if (error) {
            console.error("Error al verificar el login:", error);
            res.status(500).send("Error en el servidor");
        } else {
            if (results.length > 0) {
                console.log("Inicio de sesión exitoso para RUT:", rut);
                res.send("Inicio de sesión exitoso");
            } else {
                console.log("Credenciales incorrectas");
                res.status(401).send("Usuario o contraseña incorrectos");
            }
        }
    });
});

// Iniciar el servidor
app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000");
});