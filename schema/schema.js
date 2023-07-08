const mongoose = require('mongoose');

const testimonialSchema = {
    comment: {type: String, required: true},
    name: {type: String, required: true},
    rating: {type: 'Number', required: true},
    email: {type: String, required: true}
}

const camsEnquirySchema = {
    name : {type: String, required: true},
    email : {type: String, required: true},
    message: {type: String, required: true},
    phoneNumber : {type: String, required: true}
}

const registrationSchema = {
    firstName: String,
    lastName: String,
    email: String,
    user: String,
    password: String
}

const contactQuerySchema = {
    name: String,
    phone: String,
    email: String,
    message: String
}

const bookingSchema = {
    service: String,
    date: String,
    packagePrice: String,
    totalPrice: Number,
    due: Number,
    deposit: Number,
    paymentStatus: String,
    authCode: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    bikeDetails: Object
}

const xiaomiQuery = {
    service: String,
    price: String,
    date: String,
    name: String,
    email: String,
    phone: String,
}

const testimonialModel = mongoose.model('testimonial', testimonialSchema);
const camsEnquiryModel = mongoose.model('cams-enquiry', camsEnquirySchema);
const registrationModel = mongoose.model('registered-user', registrationSchema);
const contactQueryModel = mongoose.model('contact-query', contactQuerySchema);
const bookingModel = mongoose.model('Customer-Booking', bookingSchema);
const xiaomiModel = mongoose.model('xiaomi-query', xiaomiQuery);

module.exports = {
    testimonialModel,
    camsEnquiryModel,
    registrationModel,
    contactQueryModel,
    bookingModel,
    xiaomiModel
}