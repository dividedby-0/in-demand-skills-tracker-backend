const CustomSet = require("../models/customSet");
const CustomError = require("../errors");

exports.createCustomSet = async (req, res, next) => {
    try {
        const {name} = req.body;
        const userId = req.userId;

        if (!name) {
            throw new CustomError("Name is required", 400);
        }

        const newCustomSet = new CustomSet({
            userId: userId, name: name
        });
        await newCustomSet.save();
        res.status(201).json(newCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.updateCustomSet = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const userId = req.userId;

        if (!name) {
            throw new CustomError("Name is required", 400);
        }

        const updatedCustomSet = await CustomSet.findOneAndUpdate(
            {_id: id, userId: userId},
            {name},
            {new: true}
        );

        if (!updatedCustomSet) {
            throw new CustomError("Custom set not found or unauthorized", 404);
        }

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.deleteCustomSet = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.userId;

        const deletedCustomSet = await CustomSet.findOneAndDelete({
            _id: id,
            userId: userId,
        });

        if (!deletedCustomSet) {
            throw new CustomError("Custom set not found or unauthorized", 404);
        }

        res.json({message: "Custom set deleted successfully"});
    } catch (error) {
        next(error);
    }
};

exports.getAllCustomSets = async (req, res, next) => {
    try {
        const userId = req.userId;
        const customSets = await CustomSet.find({userId: userId});
        res.json(customSets);
    } catch (error) {
        next(error);
    }
};

exports.getCustomSetById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const userId = req.userId;

        const customSet = await CustomSet.findOne({_id: id, userId: userId});

        if (!customSet) {
            throw new CustomError("Custom set not found or unauthorized", 404);
        }

        res.json(customSet);
    } catch (error) {
        next(error);
    }
};

exports.addSkillToCustomSet = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, votes} = req.body;
        const userId = req.userId;

        if (!name || !votes) {
            throw new CustomError("Name and votes are required", 400);
        }

        const updatedCustomSet = await CustomSet.findOneAndUpdate(
            {_id: id, userId: userId},
            {$push: {skills: {name, votes}}},
            {new: true}
        );

        if (!updatedCustomSet) {
            throw new CustomError("Custom set not found or unauthorized", 404);
        }

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.updateSkillVotes = async (req, res, next) => {
    try {
        const {setId, skillId} = req.params;
        const {votes} = req.body;
        const userId = req.userId;

        if (votes === undefined || votes < 0) {
            throw new CustomError("Votes must be 0 or greater", 400);
        }
        
        const updatedCustomSet = await CustomSet.findOneAndUpdate(
            {_id: setId, userId: userId, "skills._id": skillId},
            {$set: {"skills.$.votes": votes}},
            {new: true}
        );

        if (!updatedCustomSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.updateSkillTags = async (req, res, next) => {
    try {
        const {setId, skillId} = req.params;
        const {tags} = req.body;
        const userId = req.userId;

        if (!tags) {
            throw new CustomError("Tags are required", 400);
        }

        const updatedCustomSet = await CustomSet.findOneAndUpdate(
            {_id: setId, userId: userId, "skills._id": skillId},
            {$set: {"skills.$.tags": tags}},
            {new: true}
        );

        if (!updatedCustomSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};
