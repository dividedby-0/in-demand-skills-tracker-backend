const mongoose = require("mongoose");

const customSetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    }, name: {
        type: String, required: true,
    }, skills: [{
        name: {
            type: String, required: true,
        }, votes: {
            type: Number, default: 0,
        }, tags: {
            type: [String], default: [],
        },
    },],
}, {
    collection: "customSets",
});

const CustomSet = mongoose.model("CustomSet", customSetSchema);

module.exports = CustomSet;
