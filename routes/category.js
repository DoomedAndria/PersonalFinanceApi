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
        //deleting
        const deleted = await Category.findOneAndDelete({_id: id, user: req.user._id}, {})
        if (!deleted) {
            return res.status(400).send('could not find category')
        }
        //adding finance ids to default category
        const defCategory = await Category.findOneAndUpdate({user: req.user._id, isDefault: true}, { $addToSet: { finances: { $each: deleted.finances } } })
        const defId = defCategory._id

        //updating finances (adding default category id and pulling old category id)
        await Finance.updateMany({categories: id,}, {$addToSet: {categories: defId}})
        await Finance.updateMany({categories: id,}, {$pull: {categories: id}})
        res.send(deleted)
    } catch (err) {
        res.send(err)
    }
})

module.exports = router