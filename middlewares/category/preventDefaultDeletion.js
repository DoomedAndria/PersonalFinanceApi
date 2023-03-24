const Category = require("../../models/Category");

module.exports.preventDefaultDeletion = async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    if (category.isDefault) {
        return res.status(403).send('not allowed to delete default category')
    }
    next()
}