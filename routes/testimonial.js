const express = require('express');
const router = express.Router();
const testimonialModel = require('../schema/schema').testimonialModel;

//this route will query all data from testimonial collection and return it to the client
router.get('/', (req, res) => {
    testimonialModel.find({}, (err, result) => {
        if (err) return err;
        res.json({ status: 'success', data: result })
    })
})

module.exports = router;
