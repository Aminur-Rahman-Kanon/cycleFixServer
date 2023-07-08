const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json(), express.urlencoded({ extended: false }));
app.use(cors());
require('dotenv').config();
app.set('views', './public/views');
app.set("view engine", "ejs");
app.use(express.static('public'));

//mongoDB initialization
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log('database connected')).catch(err => log(err));

//import routes
const testimonial = require('./routes/testimonial');
const submitFeedback = require('./routes/submitFeedback');
const submitCamsQuery = require('./routes/submitCamsQuery');
const signup = require('./routes/registration');
const login = require('./routes/login');
const forgotPassword = require('./routes/forgotPassword');
const resetPassword = require('./routes/resetPassword');
const confirmResetPassword = require('./routes/conformResetPassword');
const contact = require('./routes/contact');
const makePayment = require('./routes/payment');
const paymentSuccess = require('./routes/paymentSuccess');
const queryAvailableDate = require('./routes/queryAvailableDate');
const bookXiaomi = require('./routes/bookXiaomi');

app.use('/testimonial', testimonial);
app.use('/submit-feedback', submitFeedback);
app.use('/submit-cams-query', submitCamsQuery);
app.use('/sign-up', signup);
app.use('/login', login)
app.use('/forgot-password', forgotPassword)
app.use('/reset-password/:id/:token', resetPassword);
app.use('/reset-password/:id/:token', confirmResetPassword);
app.use('/contact-query', contact);
app.use('/payment', makePayment);
app.use('/payment-success', paymentSuccess);
app.use('/query-available-date', queryAvailableDate)
app.use('/book-xiaomi-service', bookXiaomi)

const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})
