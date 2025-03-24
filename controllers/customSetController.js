const CustomSet = require("../models/customSet");
const CustomError = require("../errors");

exports.createCustomSet = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new CustomError("Name is required", 400);
    }

    const newCustomSet = new CustomSet({ name });
    await newCustomSet.save();
    res.status(201).json(newCustomSet);
  } catch (error) {
    next(error);
  }
};

exports.updateCustomSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      throw new CustomError("Name is required", 400);
    }

    const updatedCustomSet = await CustomSet.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedCustomSet) {
      throw new CustomError("Custom set not found", 404);
    }

    res.json(updatedCustomSet);
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCustomSet = await CustomSet.findByIdAndDelete(id);

    if (!deletedCustomSet) {
      throw new CustomError("Custom set not found", 404);
    }

    res.json({ message: "Custom set deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomSets = async (req, res, next) => {
  try {
    const customSets = await CustomSet.find();
    res.json(customSets);
  } catch (error) {
    next(error);
  }
};

exports.getCustomSetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customSet = await CustomSet.findById(id);

    if (!customSet) {
      throw new CustomError("Custom set not found", 404);
    }

    res.json(customSet);
  } catch (error) {
    next(error);
  }
};

exports.addSkillToCustomSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, votes } = req.body;

    if (!name || !votes) {
      throw new CustomError("Name and votes are required", 400);
    }

    const updatedCustomSet = await CustomSet.findByIdAndUpdate(id, { $push: { skills: { name, votes } } }, { new: true });

    if (!updatedCustomSet) {
      throw new CustomError("Custom set not found", 404);
    }

    res.json(updatedCustomSet);
  } catch (error) {
    next(error);
  }
};

exports.updateSkillVotes = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const { votes, skillId } = req.body;

    if (!votes) {
      throw new CustomError("Votes are required", 400);
    }

    const updatedCustomSet = await CustomSet.findOneAndUpdate({ _id: setId, "skills._id": skillId }, { $set: { "skills.$.votes": votes } }, { new: true });

    if (!updatedCustomSet) {
      throw new CustomError("Custom set or skill not found", 404);
    }

    res.json(updatedCustomSet);
  } catch (error) {
    next(error);
  }
};

exports.updateSkillTags = async (req, res, next) => {
  try {
    const { setId, skillId } = req.params;
    const { tags } = req.body;

    if (!tags) {
      throw new CustomError("Tags are required", 400);
    }

    const updatedCustomSet = await CustomSet.findOneAndUpdate({ _id: setId, "skills._id": skillId }, { $set: { "skills.$.tags": tags } }, { new: true });

    if (!updatedCustomSet) {
      throw new CustomError("Custom set or skill not found", 404);
    }

    res.json(updatedCustomSet);
  } catch (error) {
    next(error);
  }
};