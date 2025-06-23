const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

/**
 * function sends email
 * @param {string} to - recievers email
 * @param {string} name - customer name
 * @param {string} password - password for login
 * @returns
 */
const sendCredentials = async (to, name, password) => {
    //verification api with jwt token
    const ejsTemplate = await ejs.renderFile('./utilities/templates/email.ejs', { name, to, password });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Welcome to QuarterTracker - Your Account Details',
        html: ejsTemplate,

        // Attachments for email
        attachments: [
            { filename: 'logo.png', path: './utilities/images/logo.png', cid: 'logo', contentDisposition: 'inline' },
        ],
    };
    return transporter.sendMail(mailOptions);
};

const forgotPasswordEmail = async (verificationToken, to, name) => {
    //verification api with jwt token
    const resetUrl = `http://localhost:3000/auth/reset-password?verificationToken=${verificationToken}`;
    const ejsTemplate = await ejs.renderFile('./utilities/templates/forgotPassword.ejs', { name, resetUrl });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Reset Password',
        html: ejsTemplate,

        // Attachments for email
        attachments: [
            { filename: 'logo.png', path: './utilities/images/logo.png', cid: 'logo', contentDisposition: 'inline' },
        ],
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendCredentials, forgotPasswordEmail };