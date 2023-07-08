const express = require('express');
const router = express.Router();
const submitCamsQuery = require('../schema/schema').camsEnquiryModel;

//this route will create a cams query in the camsEnquiryModel collection
router.post('/', async (req, res) => {
    const { name, email, message, phoneNumber } = req.body;

    await submitCamsQuery.create({
        name, email, message, phoneNumber
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'failed' }));
})

module.exports = router;
