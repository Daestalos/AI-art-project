const validateMail = (email) => {
    const mailformat = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gm);
    if (!mailformat.test(email.value)) {
        email.setCustomValidity("Адрес электронной почты должен содержать символ @ и соответствовать виду приведенного примера");
    } else {
        email.setCustomValidity("");
    }
}

const validatePassword =(password) =>{
	if (password.value.length < 6) {
		password.setCustomValidity("Пароль должен быть меньше 6 символов");
	} else {
		password.setCustomValidity("");
	}
}

function validatePasswordConfirm(password, passwordConfirm){

    if(password.value < 6) {
        passwordConfirm.setCustomValidity("Пароль должен быть меньше 6 символов");
    } else {
        passwordConfirm.setCustomValidity('');
    }

    if(password.value != passwordConfirm.value) {
        passwordConfirm.setCustomValidity("Пароли не совпадают");
    } else {
        passwordConfirm.setCustomValidity('');
    }
}

const validateName = (userName) => {
    if (userName.value.length < 3) {
		userName.setCustomValidity("Имя пользователя должно быть более 3 символов");
	} else {
		userName.setCustomValidity(""); 
	}
}

const validatePhone = (phone) => {

    const pattern = new RegExp(/^\+375(\s+)?\(?(17|29|33|44)\)?(\s+)?[0-9]{3}[0-9]{2}[0-9]{2}$/gm);
    if (!pattern.test(phone.value)) {
        phone.setCustomValidity("Номер телефона должен соответствовать шаблону: +375 (33) 1111111 или +375331111111");
    } else {
        phone.setCustomValidity("");
    }
}

export {validateMail, validatePassword, validatePasswordConfirm, validateName, validatePhone}