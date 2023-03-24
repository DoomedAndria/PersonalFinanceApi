const mongoose = require('mongoose')

const financeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        required: true,
    },
    status: {
        type: String,
        enum: ['processing', 'completed'],
        required: () => {
            return this.type === 'expense';
        },
    },
    date: {
        type: Date,
        default: Date.now()
    },
    categories: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Category',
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Finance', financeSchema)