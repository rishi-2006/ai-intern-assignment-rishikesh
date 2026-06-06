const form = document.getElementById("leadForm");
const message = document.getElementById("message");
const charCount = document.getElementById("charCount");

message.addEventListener("input", () => {
    charCount.textContent = 300 - message.value.length;
});

form.addEventListener("submit", function(e){

    e.preventDefault();

    document.querySelectorAll(".error").forEach(el=>{
        el.textContent="";
    });

    let valid=true;

    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const country=document.getElementById("country").value;
    const university=document.getElementById("university").value.trim();
    const msg=message.value.trim();

    const course=document.querySelector(
        'input[name="course"]:checked'
    );

    if(name===""){
        document.getElementById("nameError").textContent="Name required";
        valid=false;
    }

    const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        document.getElementById("emailError").textContent="Valid email required";
        valid=false;
    }

    if(country===""){
        document.getElementById("countryError").textContent="Select country";
        valid=false;
    }

    if(!course){
        document.getElementById("courseError").textContent="Select course level";
        valid=false;
    }

    if(university===""){
        document.getElementById("universityError").textContent="University required";
        valid=false;
    }

    if(msg===""){
        document.getElementById("messageError").textContent="Message required";
        valid=false;
    }

    if(!valid) return;

    const data={
        name,
        email,
        country,
        course:course.value,
        university,
        message:msg
    };

    console.log(JSON.stringify(data,null,2));

    document.getElementById("successMessage").innerHTML=
    "Thank You! Form Submitted Successfully.";

    form.reset();
    charCount.textContent=300;
});
