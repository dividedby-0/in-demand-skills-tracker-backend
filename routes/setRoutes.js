const express = require("express");
const router = express.Router();
const customSetController = require("../controllers/customSetController");

router.post("/", customSetController.createCustomSet);

router.put("/:id", customSetController.updateCustomSet);

router.delete("/:id", customSetController.deleteCustomSet);

router.get("/", customSetController.getAllCustomSets);

router.get("/:id", customSetController.getCustomSetById);

router.get("/:userId/skills", customSetController.getAllSkills);

router.post("/:customSetId/add-skill", customSetController.addSkillToCustomSet);

router.delete("/:setId/remove-skill/:skillId", customSetController.removeSkillFromCustomSet);

router.put("/:setId/update-votes/:skillId", customSetController.updateSkillVotes);

router.get('/:userId/tags', customSetController.getAllTags);

router.post("/:setId/add-tag/:skillId", customSetController.addSkillTag);

router.delete("/:setId/remove-tag/:skillId/:tag", customSetController.removeSkillTag);

module.exports = router;
