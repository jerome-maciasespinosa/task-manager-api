sgMail = require('@sendgrid/mail');
const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);

const from = 'jerome2103@live.fr';

const sendWelcomeEmail = (email, name) => {
    const subject = 'Thanks for joining task manager';
    const text = `${name}, Welcome to task manager. We are happy to see you. we hope you\'ll enjoy!`;
    sgMail.send({
        to: email,
        from,
        subject,
        text,
    })
}

const sendCancellationEmail = (email, name) => {
    const subject = `Goodbye ${name}`;
    const text = `Thanks for being a member of task-manager. We hope to see you again.`;
    sgMail.send({
        to: email,
        from,
        subject,
        text,
    })
}

module.exports=  {
    sendWelcomeEmail,
    sendCancellationEmail,
}