const express = require("express");
const nodemailer = require("nodemailer")
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",  
    auth: {
        user: process.env.USER, 
        pass: process.env.PASS 
    }
});


router.post("/correo", (req, res) => {
    const { nombre, destinatario, mensaje, asunto } = req.body; 
    const messageData = mensaje; 

    const mailOptions = {
        from: "alfredocrd@gmail.com",
        to: destinatario, 
        subject: `NODEMAILER - ${asunto}`,
        text: `Nombre: ${nombre}. \n
        ${messageData}` 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error enviando email:", error);
            res.status(500).json({ error: "Error al enviar el correo" });
        } else {
            console.log("Email enviado");
            res.status(200).json({ message: "Correo enviado con éxito" });
        }
    });
});


module.exports = router;