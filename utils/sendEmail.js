const nodemailer= require('nodemailer')

module.exports= async options=>{
    const transporter= nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD  
        }
    })

    const mailOptions= {
        from: 'Deteer <deteer@origemsolutions.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    await transporter.sendMail(mailOptions)
}