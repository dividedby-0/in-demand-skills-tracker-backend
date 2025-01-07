const CustomSet = require("../models/customSet");

// Create a new set
exports.createCustomSet = async (req, res) => {
  try {
    const { name } = req.body;

    const newCustomSet = new CustomSet({
      name,
    });

    await newCustomSet.save();
    res.status(201).json(newCustomSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a set
exports.updateCustomSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCustomSet = await CustomSet.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCustomSet) {
      return res.status(404).json({ message: "Custom set not found" });
    }

    res.json(updatedCustomSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a set
exports.deleteCustomSet = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomSet = await CustomSet.findByIdAndDelete(id);
    if (!deletedCustomSet) {
      return res.status(404).json({ message: "Custom set not found" });
    }
    res.json({ message: "Custom set deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all sets
exports.getAllCustomSets = async (req, res) => {
  try {
    const customSets = await CustomSet.find();
    res.json(customSets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single set by ID
exports.getCustomSetById = async (req, res) => {
  try {
    const { id } = req.params;

    const customSet = await CustomSet.findById(id);

    if (!customSet) {
      return res.status(404).json({ message: "Custom set not found" });
    }

    res.json(customSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a skill to a set
exports.addSkillToCustomSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, votes } = req.body;

    const updatedCustomSet = await CustomSet.findByIdAndUpdate(
      id,
      { $push: { skills: { name, votes } } },
      { new: true }
    );

    if (!updatedCustomSet) {
      return res.status(404).json({ message: "Custom set not found" });
    }

    res.json(updatedCustomSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update skill votes
exports.updateSkillVotes = async (req, res) => {
  try {
    const { setId } = req.params;
    const { votes, skillId } = req.body;

    const updatedCustomSet = await CustomSet.findOneAndUpdate(
      { _id: setId, "skills._id": skillId },
      { $set: { "skills.$.votes": votes } },
      { new: true }
    );

    if (!updatedCustomSet) {
      return res.status(404).json({ message: "Custom set or skill not found" });
    }

    res.json(updatedCustomSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update/delete skill tags
exports.updateSkillTags = async (req, res) => {
  try {
    const { setId, skillId } = req.params;
    const { tags } = req.body;

    const updatedCustomSet = await CustomSet.findOneAndUpdate(
      { _id: setId, "skills._id": skillId },
      { $set: { "skills.$.tags": tags } },
      { new: true }
    );

    if (!updatedCustomSet) {
      return res.status(404).json({ message: "Custom set or skill not found" });
    }

    res.json(updatedCustomSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
