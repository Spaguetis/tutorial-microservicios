const messageError = document.getElementsByClassName("error")[0]

document.getElementById("login-form").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;
    const res = await fetch ("http://localhost:2000/api/login",{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user, password
     })
     
    })
   
    if(!res.ok) return messageError.classList.toggle("escondido",false);
    
    const resjson = await res.json();
    if (resjson.rediect){
        window.location.href = resjson.redirect;
    }
})