const router = require('express').Router()
const Finance = require('../models/Finance')
const Category = require('../models/Category')

router.get('/', async (req, res) => {
    try {
        const {sortBy} = req.query
        const result = await Finance.find({user: req.user._id}, {})
            .sort(sortBy)

        res.send(result)
    } catch (err) {
        res.send(err)
    }
})

router.post('/', async (req, res) => {
    try {
        let catIds;
        //check if category ids are passed
        if (req.body.categories) {
            catIds = req.body.categories
            //check ids
            //todo

        } else {
            //default category
            const defCat = await Category.findOne({isDefault: true, user: req.user._id},{})
            catIds = defCat._id
        }

        const finance = new Finance({
            description: req.body.description,
            amount: req.body.amount,
            type: req.body.type,
            status: req.body.status,
            categories: catIds,
            user: req.user._id

        })

        //save finance
        const result = await finance.save()

        //update categories whose ids were passed
        await Category.updateMany({ _id: { $in: catIds } },{$addToSet:{finances:result._id}})


        res.send(result)
    } catch (err) {
        res.send(err)
    }
})

router.get('/:id', async (req, res) => {
    try{
        const result = await Finance.findById(req.params.id)
        res.send(result)
    }catch(err){
        res.send(err)
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const deleted = await Finance.findByIdAndDelete(req.params.id)
        res.send(deleted)
    }catch(err){
        res.send(err)
    }
})

module.exports = router