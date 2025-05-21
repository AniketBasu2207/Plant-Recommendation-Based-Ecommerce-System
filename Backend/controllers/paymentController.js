const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const User=require('../models/User');

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const createOrder = async(req,res)=>{
    try {
        const user=await User.findOne({_id:req.session.user_id})
        const amount = (req.body.amount.toFixed(2))*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:'bla bla bla',
                        // description:req.body.description,
                        // contact:"8567345632",
                        name: user.name,
                        email: user.email
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!',err});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = createOrder

