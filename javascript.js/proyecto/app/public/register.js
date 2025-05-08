
const messageError = document.getElementsByClassName("error")[0];


document.getElementById("register-form").addEventListener("submit",async(e)=>{
 e.preventDefault();
    console.log(e.target.children.user.value)
    const res = await fetch("http://localhost:2000/api/register",{
        method:"POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            user: e.target.children.user.value,
            email: e.target.children.email.value,
            password: e.target.children.password.value
        })
    });
    if (!res.ok) return messageError.classList.toggle("escondido",false);
   
    
    const resjson =await res.json();
    if(resjson.redirect){
        window.location.href = resjson.redirect;
    }
});