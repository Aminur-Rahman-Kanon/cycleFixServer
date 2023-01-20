const testimonialSchema = {
    comment: {type: String, required: true},
    name: {type: String, required: true},
    rating: {type: 'Number', required: true}
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

module.exports = {
    testimonialSchema,
    camsEnquirySchema,
    registrationSchema
}