import nodemailer from "nodemailer";

const MailModel = nodemailer.createTransport({
    host: process.env.HOST_MAIL, // ex. gmails
    port: process.env.PORT_NUMBER,  // port number for send emails 
    secure: true,
    auth: {
        user: process.env.USER_MAIL, // ower mail id
        pass: process.env.APP_PASS, // sending mail have password 
    },
    tls: {
        rejectUnauthorized: false,
    },
    debug: true, logger: true,
})

export default MailModel;

