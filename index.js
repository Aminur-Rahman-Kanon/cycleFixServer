const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json());
app.use(cors());
require('dotenv').config();
const path = require('path');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const stripe = require('stripe')(process.env.STRIPE_KEY);
const jwt = require('jsonwebtoken');
app.set('views', './public/views');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const nodeMailer = require('nodemailer');

//mongoDB initialization
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log('database connected')).catch(err => log(err));

const testimonialSchema = require('./schema/schema').testimonialSchema;
const camsEnquirySchema = require('./schema/schema').camsEnquirySchema;
const registrationSchema = require('./schema/schema').registrationSchema;
const contactQuerySchema = require('./schema/schema').contactQuerySchema;
const bookingSchema = require('./schema/schema').bookingSchema;
const xiaomiQuery = require('./schema/schema').xiaomiQuery;

const testimonialModel = mongoose.model('testimonial', testimonialSchema);
const camsEnquiryModel = mongoose.model('cams-enquiry', camsEnquirySchema);
const registrationModel = mongoose.model('registered-user', registrationSchema);
const contactQueryModel = mongoose.model('contact-query', contactQuerySchema);
const bookingModel = mongoose.model('Customer-Booking', bookingSchema);
const xiaomiModel = mongoose.model('xiaomi-query', xiaomiQuery);


app.post('/testimonial', (req, res) => {
    testimonialModel.find({}, (err, result) => {
        if (err) return err;
        res.json({ status: 'success', data: result })
    })
})

app.post('/submit-feedback', (req, res) => {
    const {name, email, comment, rating} = req.body;

    testimonialModel.create({
        name, email, comment, rating
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    
})

app.post('/submit-query', async (req, res) => {
    const { name, email, message, phoneNumber } = req.body;

    await camsEnquiryModel.create({
        name, email, message, phoneNumber
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'failed' }))
})

app.post('/sign-up', async (req, res) => {
    const {firstName, lastName, email, user, password} = req.body;

    const existUser = await registrationModel.findOne({ email });
    if (existUser) return res.json({ status: 'user exist' });

    const encryptPass = await bcrypt.hash(password, salt);

    await registrationModel.create({
        firstName, lastName, email, user, password: encryptPass
    }).then(result => res.json({ status: 'user created' })).catch(err => res.json({ status: 'failed' }))
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const checkForUser = await registrationModel.findOne({ email });

    if (checkForUser !== null) {
        const passwordCheck = await bcrypt.compare(password, checkForUser.password);
        
        if (passwordCheck) {
            return res.json({ status: 'success', data: checkForUser });
        }
        else {
            return res.json({ status: 'bad password' });
        }
    }
    else {
        return res.json({ status: 'user not found' })
    }
})

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    const userCheck = await registrationModel.findOne({ email });
    if (!userCheck) return res.json({ status: 'user not found' })

    const token = jwt.sign({ id: userCheck._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    const link = `https://cyclefixserver.onrender.com/reset-password/${userCheck._id}/${token}`;

    try {
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cyclefixservice@gmail.com',
              pass: 'kvqsfyoliecygdaj'
            }
        });
        
        const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Reseting the password',
        text: `Here is the link to reset your password. Please note that this link is valid for 5 minutes. After 5 minutes it will not work, then you have to try again. Also Please dont forget to check your spam folder
        \n${link}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });

        return res.json({ status: 'success' })
        
    } catch (error) {
        return res.json({ status: 'failed' })
    }


    
})

app.get('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    
    const userCheck = await registrationModel.findOne({ _id: id });
    if (!userCheck) return res.json({ status: 'not found' });

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        res.render('index', {email: userCheck.email})
    } catch (error) {
        res.send("Link expired. Please try again")
    }
})

app.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;

    const {password, confirmPassword} = req.body;
    
    const userCheck = await registrationModel.findOne({ _id: id });

    if (!userCheck) return res.json({ status: 'not found' });

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verify);
        const encryptedPassword = await bcrypt.hash(password, salt);
        await registrationModel.updateOne({
            _id: id
        },
        {
            $set: {
                password: encryptedPassword
            }
        })
        res.render("success");
        
    } catch (error) {
        res.json({ status: 'something went wrong' })
    }
})


app.post('/contact-query', async (req, res) => {
    const { name, phone, email, message } = req.body;

    await contactQueryModel.create({
        name, phone, email, message
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

app.post('/payment', async (req, res) => {
    const {amount, id} = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "GBP",
            description: 'test',
            payment_method: id,
            confirm: true
        })

        res.json({
            message: 'Payment Successful',
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Payment Failed',
            success: false
        })
    }
})

app.post('/payment-success', async (req, res) => {
    const { userData } = req.body;

    console.log(userData)

    const totalPrice = await userData.totalPrice / 100;

    userData.totalPrice = totalPrice;

    await bookingModel.create({
        ...userData
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    
})

app.use(express.static(path.join(__dirname, 'public')))

// console.log(__dirname+'/public');

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('/'))

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

app.post('/query-available-date', async (req, res) => {
    await bookingModel.find({}, {date: 1, _id: 0}).then(response => {
        const allMonth = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        response.forEach(dates => {
            months.map(month => {
                if (dates.date.includes(month)) {
                    if (allMonth[months.indexOf(month)] === undefined){
                        allMonth[months.indexOf(month)] = [];
                        allMonth[months.indexOf(month)].push(parseInt(dates.date.split(' ')[2]))
                    }
                    else {
                        allMonth[months.indexOf(month)].push(parseInt(dates.date.split(' ')[2]))
                    }
                }
            })
        })
        res.json({ status: 'success', data: allMonth })
    }).catch(err => res.json({ status: 'failed' }));
    
})

app.post('/book-xiaomi-service', async (req, res) => {
    const { service, price, date, name, email, phone } = req.body;

    try {
        await xiaomiModel.create({
            service, price, date, name, email, phone
        }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    } catch (error) {
        res.json({ status: 'error' })
    }
})



const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})
