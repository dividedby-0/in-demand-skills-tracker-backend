const express = require("express");
const router = express.Router();
const customSetController = require("../controllers/customSetController");

// Create a new set
router.post("/", customSetController.createCustomSet);

// Update a set
router.put("/:id", customSetController.updateCustomSet);

// Delete a set
router.delete("/:id", customSetController.deleteCustomSet);

// Get all sets
router.get("/", customSetController.getAllCustomSets);

// Get a single set by ID
router.get("/:id", customSetController.getCustomSetById);

// Add a skill to a set
router.put("/:id/add-skill", customSetController.addSkillToCustomSet);

// Update skill votes
router.put("/:setId/update-votes", customSetController.updateSkillVotes);

// Update/delete skill tags
router.put(
  "/:setId/update-skill-tags/:skillId",
  customSetController.updateSkillTags
);

module.exports = router;
