const {Product} = require('../models/product');
const {Category} = require('../models/category');
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Ảnh không hợp lệ!');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },

    filename: function (req, file, cb) {

        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Tìm sản phẩm theo danh mục sản phẩm
router.get(`/`, async (req, res)=>{
    let filter = {};
    if(req.query.categories){
       filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category')

    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})

// Tìm một sản phẩm theo Id
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');
    // populate lấy thông tin category 
    if(!product) {
        return res.status(400).send('Không thể tìm thấy sản phẩm!')
    }
    res.send(product);
})

// Tạo mới 1 sản phẩm
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Danh mục sản phẩm không hợp lệ!');

    const file = req.file;
    if (!file) return res.status(400).send('Không có ảnh!');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    product = await product.save();

    if (!product) return res.status(500).send('Không thể tạo sản phẩm');

    res.send(product);
});

// Đăng nhiều ảnh
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Sản phẩm không hợp lệ!');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths
        },
        { new: true }
    );

    if (!product) return res.status(500).send('Không thể tạo nhiều ảnh!');

    res.send(product);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category');

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid Product!');

    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    );

    if (!updatedProduct) return res.status(500).send('the product cannot be updated!');

    res.send(updatedProduct);
});


// // Cập nhật 1 sản phẩm
// router.put('/:id',  uploadOptions.single('image'), async(req, res) => {
//     if(mongoose.isValidObjectId(req.body.id)) {
//         return res.status(400).send('Sản phẩm không hợp lệ 1!');
//     }

//     const category = await Category.findById(req.body.category);
//     if(!category) return res.status(400).send('Danh mục sản phẩm không hợp lệ!');

//     const product = await Product.findById(req.body.id);
//     if(!product) return res.status(400).send('Sản phẩm không hợp lệ 2!');

//     const file = req.file;
//     let imagepath;
//     if(!file){
//         const fileName = file.filename;
//         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//         imagepath = `${basePath}${fileName}`;
//     }
//     else{
//         imagepath = product.image;
//     }

//     let updatedProduct = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//             // lấy thông tin cần cập nhật từ body của request 
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image: imagepath,
//             brand: req.body.brand, 
//             price: req.body.price, 
//             category: req.body.category, 
//             countInStock: req.body.countInStock, 
//             rating: req.body.rating, 
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured
//         }, 
//         {new: true}
//     )

//     if(!updatedProduct)
//     return res.status(400).send('Không thể cập nhật sản phẩm.');

//     res.send(updatedProduct);
// })

// Xóa 1 sản phẩm
router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true, message: 'Đã xóa sản phẩm'})
        }
        else {
            return res.status(404).json({success: false, message: 'Không thể tìm thấy sản phẩm'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error: err});
    })
})

// Đếm số lượng sản phẩm
router.get(`/get/count`, async (req, res)=>{
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        return res.status(400).json({success: false})
    }
    res.send({
        productCount: productCount
    });
})

// Tìm sản phẩm nổi bật
router.get(`/get/featured/:count`, async (req, res)=>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count)

    if(!products) {
        return res.status(400).json({success: false})
    }
    res.send(products);
})


module.exports = router;
