const express = require('express');
const router = express.Router();
const submitFeedback = require('../schema/schema').testimonialModel;

//this route will create a feedback in the submitFeedback collection
router.post('/', (req, res) => {
    const {name, email, comment, rating} = req.body;

    submitFeedback.create({
        name, email, comment, rating
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

module.exports = router;
