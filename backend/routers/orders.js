const {Order} = require('../models/order');
const {OrderItem} = require('../models/order-item');
const express = require('express');
const router = express.Router();

// Liệt kê tất cả đơn hàng
router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

// Tìm đơn hàng theo Id
router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

// Tạo 1 đơn hàng
router.post('/', async (req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b , 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('Không thể tạo đơn hàng!')

    res.send(order);
})

// Cập nhật đơn hàng
router.put('/:id', async(req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            // lấy thông tin cần cập nhật từ body của request 
            status: req.body.status
        }, 
        {new: true}
    )

    if(!order)
    return res.status(400).send('Không thể cập nhật đơn hàng!')

    res.send(order)
})

// Xóa đơn hàng và order-items
router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if(order){
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success:true, message: 'Đã xóa đơn hàng.'})
        }
        else {
            return res.status(404).json({success: false, message: 'Không tìm thấy đơn hàng!'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error: err});
    })
})

// Tính tổng doanh thu của tất cả đơn hàng
router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: { _id: null, totalsales: {$sum: '$totalPrice'}}}
    ])

    if(!totalSales){
        res.status(400).send('Không thể tính tổng doanh thu!')
    }

    res.send({totalSales: totalSales.pop().totalsales})
})

// Tính tổng đơn hàng
router.get(`/get/count`, async (req, res)=>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        return res.status(400).json({success: false})
    }
    res.send({
        orderCount: orderCount
    });
})

// Lịch sử
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        })
        .sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})

module.exports = router;