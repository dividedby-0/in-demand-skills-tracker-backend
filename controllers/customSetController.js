const mongoose = require('mongoose');
const CustomSet = require("../models/customSet");
const CustomError = require("../errors");

exports.createCustomSet = async (req, res, next) => {
    try {
        const {name} = req.body;
        const sanitized_name = name.trim();
        const userId = req.userId;

        const existingCustomSet = await CustomSet.findOne({
            name: {$regex: `^${sanitized_name}$`, $options: 'i'},
            userId
        });

        if (existingCustomSet) {
            throw new CustomError(`Location or company with name '${name}' already exists`, 400);
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

        const updatedCustomSet = await CustomSet.findOneAndUpdate({_id: id, userId: userId}, {name}, {new: true});

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
            _id: id, userId: userId,
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
        const sanitized_name = name.trim();
        const userId = req.userId;

        if (!sanitized_name || !votes) {
            throw new CustomError("Name and votes are required", 400);
        }

        const existingSkill = await CustomSet.findOne({
            _id: id,
            userId: userId,
            "skills.name": {$regex: `^${sanitized_name}$`, $options: 'i'}
        });
        if (existingSkill) {
            throw new CustomError(`Skill with name '${sanitized_name}' already exists`, 400);
        }

        const updatedCustomSet = await CustomSet.findOneAndUpdate({_id: id, userId: userId}, {
            $push: {
                skills: {
                    name: sanitized_name,
                    votes
                }
            }
        }, {new: true});

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.removeSkillFromCustomSet = async (req, res, next) => {
    try {
        const {setId, skillId} = req.params;
        const userId = req.userId;

        const updatedCustomSet = await CustomSet.findOneAndUpdate({
            _id: setId,
            userId: userId
        }, {$pull: {skills: {_id: skillId}}}, {new: true});

        if (!updatedCustomSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
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

        const updatedCustomSet = await CustomSet.findOneAndUpdate({
            _id: setId,
            userId: userId,
            "skills._id": skillId
        }, {$set: {"skills.$.votes": votes}}, {new: true});

        if (!updatedCustomSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        res.json(updatedCustomSet);
    } catch (error) {
        next(error);
    }
};

exports.getAllTags = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const result = await CustomSet.aggregate([
            {$match: {userId: userId}},
            {$unwind: "$skills"},
            {$unwind: {path: "$skills.tags", preserveNullAndEmptyArrays: false}},
            {$group: {_id: null, tags: {$addToSet: "$skills.tags"}}},
            {$project: {_id: 0, tags: 1}}
        ]);

        res.json(result.length ? result[0].tags : []);

    } catch (error) {
        next(error);
    }
};

exports.addSkillTag = async (req, res, next) => {
    try {
        const {setId, skillId} = req.params;
        const {tag} = req.body;
        const userId = req.userId;

        if (!tag) {
            throw new CustomError("Tag is required", 400);
        }

        const customSet = await CustomSet.findOne({_id: setId, userId: userId});
        if (!customSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        const skillToUpdate = customSet.skills.find(skill => skill._id.toString() === skillId);
        if (!skillToUpdate) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        const normalizedTag = tag.toString().trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

        if (skillToUpdate.tags.includes(normalizedTag)) {
            throw new CustomError(`Tag '${normalizedTag}' already exists for this skill`, 400);
        } else {
            skillToUpdate.tags.push(normalizedTag);
        }

        await customSet.save();

        res.json(customSet);
    } catch (error) {
        next(error);
    }
};

exports.removeSkillTag = async (req, res, next) => {
    try {
        const {setId, skillId, tag} = req.params;
        const userId = req.userId;

        if (!tag) {
            throw new CustomError("Tag is required", 400);
        }

        const customSet = await CustomSet.findOne({_id: setId, userId: userId});
        if (!customSet) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        const skillToUpdate = customSet.skills.find(skill => skill._id.toString() === skillId);
        if (!skillToUpdate) {
            throw new CustomError("Custom set or skill not found or unauthorized", 404);
        }

        const tagIndex = skillToUpdate.tags.indexOf(tag.toLowerCase());

        if (tagIndex > -1) {
            skillToUpdate.tags.splice(tagIndex, 1);
        } else {
            throw new CustomError("Tag not found in this skill", 404);
        }

        await customSet.save();

        res.json(customSet);
    } catch (error) {
        next(error);
    }
};