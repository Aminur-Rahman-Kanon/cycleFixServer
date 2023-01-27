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

const testimonialModel = mongoose.model('testimonial', testimonialSchema);
const camsEnquiryModel = mongoose.model('cams-enquiry', camsEnquirySchema);
const registrationModel = mongoose.model('registered-user', registrationSchema);
const contactQueryModel = mongoose.model('contact-query', contactQuerySchema);
const bookingModel = mongoose.model('Customer-Booking', bookingSchema);


app.post('/testimonial', (req, res) => {
    testimonialModel.find({}, (err, result) => {
        if (err) return err;
        res.json({ status: 'success', data: result })
    })
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

app.post('/contact-query', async (req, res) => {
    const { name, phone, email, message } = req.body;

    await contactQueryModel.create({
        name, phone, email, message
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

app.post('/payment', async (req, res) => {
    const {amount, id} = req.body;

    console.log(amount, id); 
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

    const totalPrice = await userData.totalPrice / 100;

    userData.totalPrice = totalPrice;

    await bookingModel.create({
        ...userData
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.post('/query-available-date', async (req, res) => {
    const queryForDates = await bookingModel.find({}, {date: 1, _id: 0}).then(response => {
        const allMonth = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        response.forEach(dates => {
            months.map(month => {
                if (dates.date.includes(month)) {
                    if (allMonth[months.indexOf(month)] === undefined){
                        // console.log('yes');
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



const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})
