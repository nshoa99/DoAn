const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

// Liệt kê tất cả các danh mục sản phẩm
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

// Tìm danh mục sản phẩm theo id
router.get('/:id', async (req, res)=> {
    const category = await Category.findById(req.params.id);

    if(!category){
        res.status(404).json({message: 'Không thể tìm thấy danh mục sản phẩm.'})
    }
    res.status(200).send(category);
})


// Tạo danh mục sản phẩm
router.post('/', async (req, res)=> {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
    return res.status(404).send('không thể tạo danh mục sản phẩm!');

    res.send(category);
})

// Xóa 1 danh mục sản phẩm theo id (api/v1/categories/id)
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success:true, message: 'Đã xóa danh mục sản phẩm'})
        }
        else {
            return res.status(404).json({success: false, message: 'Không thể tìm thấy danh mục sản phẩm'})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error: err});
    })
})

// Cập nhật danh mục sản phẩm (put method)
router.put('/:id', async(req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            // lấy thông tin cần cập nhật từ body của request 
            name: req.body.name, 
            icon: req.body.icon, 
            color: req.body.color
        }, 
        {new: true}
    )

    if(!category)
    return res.status(400).send('Không thể cập nhật danh mục sản phẩm.')

    res.send(category)
})


module.exports = router; 
