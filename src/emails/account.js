const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SGMAIL_API_KEY);

const sendWelcomeEmail = async (name, email) => {
    sgMail.send({
        to: email,
        from: 'donotreply@taskapp.com',
        subject: 'Welcome To Task Manager',
        text: `Hi ${name},
        Welcome to the app.
        
        Thanks for using our services.`
    });

}

const sendCancelEmail = async (name, email) => { 
    sgMail.send({
        to:email,
        from:'donotreply@taskapp.com',
        subject: 'Sorry to see you go',
        text:`Hi ${name},
        I hope to see you soon again.
        
        Thanks.`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
