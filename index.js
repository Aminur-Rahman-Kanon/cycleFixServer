const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(express.json());
app.use(cors());
require('dotenv').config();
const path = require('path');

//mongoDB initialization
const MONGO_URI = 'mongodb+srv://cycleFixKennington:fIemfcTQ2dWAqb2w@cyclefix.cjk9cwh.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log('database connected')).catch(err => log(err));

const testimonialSchema = require('./schema/schema').testimonialSchema;
const camsEnquirySchema = require('./schema/schema').camsEnquirySchema;

const testimonialModel = mongoose.model('testimonial', testimonialSchema);
const camsEnquiryModel = mongoose.model('cams-enquiry', camsEnquirySchema);


app.post('/testimonial', (req, res) => {
    testimonialModel.find({}, (err, result) => {
        if (err) return err;
        res.json({ status: 'success', data: result })
    })
})

app.post('/submit-query', async (req, res) => {
    const { name, email, message, phoneNumber} = req.body;

    try {
        await camsEnquiryModel.create({
            name, email, message, phoneNumber
        }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'failed' }))
    } catch (error) {
        res.json({ status: 'error' })
    }
    
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})
