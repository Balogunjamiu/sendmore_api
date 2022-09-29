const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (username, email)=>{
    sgMail.send({
        to: 'balogunjamiu49@gmail.com',
        from: email,
        subject: 'Hello Jamiu Someone wants to talk to you',
        text:`https://jamiu-chat.herokuapp.com/chat.html?username=Balogun&room=${username}`,
    })
}

const concellation = (email,name)=>{
    sgMail.send({
        to:email,
        from:'Balogunjamiu49@gmail.com',
        subject:'Sorry to see you go',
        text:`Goodbye ${name}, is there anything we could have done to keep you on track`
    })
}

module.exports = {
    sendWelcomeEmail,
    concellation
}