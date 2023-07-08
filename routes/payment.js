const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

//this route submit a payment request
router.post('/', async (req, res) => {
    const {amount, id} = req.body;

    try {
        //submitting a payment request with the following properties
        await stripe.paymentIntents.create({
            amount,
            currency: "GBP",
            description: 'test',
            payment_method: id,
            confirm: true
        });

        res.json({
            message: 'Payment Successful',
            success: true
        })
    } catch (error) {
        //if the request failed then abort
        res.json({
            message: 'Payment Failed',
            success: false
        })
    }
})

module.exports = router;
