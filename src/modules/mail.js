

const sendMail = (data) => {
    try {
        fetch('http://localhost:80/email', {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json;charset=UTF-8"}
        })
    } catch (error) {
        alert(error.message)   
    }

}

export {sendMail}