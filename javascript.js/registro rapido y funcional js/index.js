const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("register");
});

app.get("/", function(req, res) {
    console.log("Se llamó a /");
    res.render("register");
});

app.post("/validar", function(req,res){
    const data = req.body;

    console.log(data);
})

app.listen(3000, function() {
    console.log("servidor creado http://localhost:3000");
});

