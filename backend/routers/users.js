const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Liệt kê tất cả người dùng
router.get('/', async (req, res)=>{
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: fasle})
    }
    res.send(userList);
})

// Tìm người dùng theo id
router.get('/:id', async (req, res)=> {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(404).json({message: 'Không thể tìm thấy người dùng!'})
    }
    res.status(200).send(user);
})


router.post('/', async (req, res) => {
    

    let user = await new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(await req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        city: req.body.city,
        zip: req.body.zip,
        apartment: req.body.apartment,
        country: req.body.country

    })

    user = await user.save()

    if(!user)
    return res.status(400).send('Không thể tạo tài khoản')

    res.send(user);
})

// Đăng ký
router.post('/register', async (req, res)=> {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    category = await user.save();

    if(!user)
    return res.status(404).send('Không thể tạo người dùng!');

    res.send(user);
})

// Cập nhật thông tin người dùng
router.put('/:id', async(req, res) => {
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.passwrod, 10);
    }
    else{
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            // lấy thông tin cần cập nhật từ body của request 
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        }, 
        {new: true}
    )

    if(!user)
    return res.status(400).send('Không thể cập nhật thông tin!')

    res.send(user)
})

// Đăng nhập
router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('Không tìm thấy người sử dụng!');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } else {
       res.status(400).send('Sai mật khẩu!');
    }    
})

// Đếm số lượng người dùng 
router.get(`/get/count`, async (req, res)=>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        return res.status(400).json({success: false})
    }
    res.send({
        userCount: userCount
    });
})

// Xóa 1 người dùng
router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true, message: 'Đã xóa người dùng'})
        }
        else {
            return res.status(404).json({success: false, message: 'Không tìm thấy người dùng!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err});
    })
})

module.exports = router;