const router = require('express').Router()
const Category = require('../models/Category')
const Finance = require('../models/Finance')
const {validateCategory} = require('../middlewares/category/validation')
const {preventDefaultDeletion} = require('../middlewares/category/preventDefaultDeletion')

//get all categories
router.get('/', async (req, res) => {
    try {
        const result = await Category.find({user: req.user._id}, {})
        res.send(result)
    } catch (err) {
        res.send(err)
    }
})

//add new category
router.post('/', validateCategory, async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            user: req.user._id
        })
        const result = await category.save()
        res.send(result)
    } catch (err) {
        res.send(err)
    }
})

//get category by id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id)
        res.send(category)
    } catch (err) {
        res.send(err)
    }

})

//update category
router.put('/:id', validateCategory, async (req, res) => {
    try {
        const id = req.params.id
        const update = {
            name: req.body.name,
            user: req.user._id,
            updated: Date.now()
        }
        const result = await Category.findByIdAndUpdate(id, update, {new: true})
        res.send(result)
    } catch (err) {
        res.send(err)
    }
})

//delete category
router.delete('/:id', preventDefaultDeletion, async (req, res) => {
    try {
        const id = req.params.id
        const catToDelete = await Category.findOne({_id: id,user: req.user._id},{})
        if(!catToDelete){
            return res.status(400).send('could not find category')
        }
        const defCategory = await Category.findOne({user: req.user._id, isDefault: true}, {})
        res.send(defCategory)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router