import bcrypt from 'bcrypt'
import {modelo, cart_model, products_model} from './models.js'
import nodemailer from 'nodemailer'

function auth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.render('error', {
            data: 'No estas autorizado'
        })
    }
}

async function isAdmin(req, res, next) {
    
    const user = await modelo.findOne({_id: req.session?.passport?.user})
        
    if (user?.admin) {
        return next();  
    }


    res.render('error', {data: "No estas autorizado"})
    
}



 function  hashPassword(password) {
    return  bcrypt.hashSync(password,  bcrypt.genSaltSync(10));
}


 function isValidPassword(plainPassword, hashedPassword) {
    return  bcrypt.compareSync(plainPassword, hashedPassword);
}

function validatePass(req, res, next) {
    if(req.body.password !== req.body.password2){
        return  res.render('error', {data: 'Las contraseñas no coinciden'})
    }

    if(req.body.password.length < 8) {
        return  res.render('error', {data: 'La contraseña es demasiado corta'})
    }

    return next()
}



//// NODEMAILER 

/*
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'raphaelle88@ethereal.email',
        pass: 'QmkFSbdava12t6mh3K'
    }
});




// Funcion para Enviar Mail
const sendMail = async (mail, subject, body) => {

    const mailOptions = {
        from : 'e-Commerce Santi Clf',
        to : mail,
        subject: subject,
        html: `<span>${body}</span>`
    }    

    const info = await transporter.sendMail(mailOptions)
}
*/


export {
    auth,
    hashPassword,
    isValidPassword,
    validatePass,
    isAdmin,
}