const Razorpay = require('razorpay');
const Order = require('../model/orders');



exports.purchasepremium = async (req, res, next) => {
    try {
      const rzp = new Razorpay({
        key_id: 'rzp_test_4B1RGDALm8hNno', 
        key_secret: '57gKyTQZHOxhU4y9NxahATj8', 
      });
  
      const amount = 2500;
  
      // Create the order with Razorpay
      const order = await new Promise((resolve, reject) => {
        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
          if (err) {
            console.error('Error creating order:', err);
            return reject(err);
          }
          console.log('Order created:', order);
          resolve(order);
        });
      });
  
      // Store the order in the database
      try {
        const createOrder = await req.user.createOrder({
          orderid: order.id,
          status: 'PENDING',
        });
  
        console.log('Order created in the database');
        console.log(createOrder);
  
        // Send a successful response with the created order data
        res.status(200).json({ order , key_id:rzp.key_id });
     
      } catch (error) {
        console.error('Error creating order in the database:', error);
        res.status(403).json({ message: 'Something went wrong', error: error.message });
      }
    } catch (error) {
      console.error('General error:', error);
      res.status(403).json({ message: 'Something went wrong', error: error.message });
    }
  };
  
  
  
  exports.updateTransactionStatus = async (req, res, next) =>{
    try {
      const { payment_id, order_id } = req.body;

      // Use async/await with try/catch
      const order = await Order.findOne({ where: { orderid: order_id } });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      await order.update({paymentid: payment_id, status: 'SUCCESSFULL'})
      await req.user.update({ ispremiumuser: true });
  
      res.status(202).json({ success: true, message: 'Transaction Successful' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Something went wrong', error: err.message });
    }
  }
  