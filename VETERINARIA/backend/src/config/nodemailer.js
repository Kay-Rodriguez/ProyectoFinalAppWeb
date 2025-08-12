import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToRegister = (userMail, token) => {

    let mailOptions = {
        from: 'soporte@vidanova.com',
        to: userMail,
        subject: "VidaNova - Plataforma de Atención al Cliente 💬",
        html: ` <h1>¡Bienvenido/a a VidaNova!</h1>
            <p>💙 VIDANOVA🎗<p>
            <p>Gracias por registrarte en nuestra plataforma.</p>
            <p>Haz clic <a href="${process.env.URL_FRONTEND}confirm/${token}">aquí</a> para confirmar tu cuenta y comenzar a recibir atención personalizada.</p>
        <hr>
        <footer>El equipo de VidaNova está aquí para ayudarte. 💙</footer>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'soporte@vidanova.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña, Recupera tu acceso a VidaNova",
    html: `
    <h1>VidaNova - Atención al Cliente</h1>
    <p>Haz clic en el siguiente enlace para recuperar el acceso a tu cuenta:</p>
    <a href=${process.env.URL_FRONTEND}reset/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>¿Necesitas ayuda adicional? Estamos aquí para ti. 🌱</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToOwner = async(userMail,password)=>{
    let info = await transporter.sendMail({
    from: 'soporte@vidanova.com',
    to: userMail,
    subject: "Correo de bienvenida - Afiliado",
    html: `
    <h1> 💙 VIDANOVA🎗 </h1>
    <hr>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_BACKEND}login >Clic para iniciar sesión</a>
    <hr>
    <footer>El equipo de VidaNova te da la más cordial bienvenida.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
}
