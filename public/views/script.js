const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');

const test = {
    pass1: '',
    pass2: ''
}

const inputValidation = () => {
    if (test.pass1 === test.pass2){
        submitBtn.disabled = false;
    }
    else {
        submitBtn.disabled = true;
    }
}

password.addEventListener("input", (e) => {
    test.pass1 = e.target.value;
    inputValidation();
})

confirmPassword.addEventListener("input", (e) => {
    test.pass2 = e.target.value;
    inputValidation();
})