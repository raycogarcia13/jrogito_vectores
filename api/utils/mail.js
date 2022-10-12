const nodemailer = require("nodemailer");

async function myCustomMethod(ctx) {
    let cmd = await ctx.sendCommand(
        'AUTH PLAIN ' +
        Buffer.from(
            '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
            'utf-8'
        ).toString('base64')
    );

    if (cmd.status < 200 || cmd.status >= 300) {
        throw new Error('Failed to authenticate user: ' + cmd.text);
    }
}

async function sendMail(to, messageT = '', messageH = '', subject = 'Hello ✔') {

     let mail = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
        // tls: true
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await mail.sendMail({
        from: `"AISCO Workspace" <${process.env.MAIL_USERNAME}>`,
        to: to, // list of receivers
        subject: subject, // Subject line
        text: messageT, // plain text body
        html: messageH, // html body
    });

    console.log("Message sent: %s", info.messageId);
}



module.exports = {
    sendMail
}