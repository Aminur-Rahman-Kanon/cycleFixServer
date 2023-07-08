const express = require('express');
const router = express.Router();
const registrationModel = require('../schema/schema').registrationModel;
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { email } = req.body;

    //verifying the user email. If not verified then abort
    const userCheck = await registrationModel.findOne({ email });
    if (!userCheck) return res.json({ status: 'user not found' })

    //verifying the jwt token
    const token = jwt.sign({ id: userCheck._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    //generating a link for the user to send to their email address
    //so they can be redirected to the password reset page
    const link = `https://cyclefixserver.onrender.com/reset-password/${userCheck._id}/${token}`;

    try {
        //send the info along to gmail to transmit the email using NodeMailer
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cyclefixservice@gmail.com',
              pass: 'kvqsfyoliecygdaj'
            }
        });
        
        //generating a message header options
        const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Reseting the password',
        text: `Here is the link to reset your password. Please note that this link is valid for 5 minutes. After 5 minutes it will not work, then you have to try again. Also Please dont forget to check your spam folder
        \n${link}`
        };
        
        //send the email to the desired email address and return a success message to the client
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.json({ status: 'success' })
        
    } catch (error) {
        //abort if anyting goes wrong
        return res.json({ status: 'failed' })
    }
})

module.exports = router;
