const express = require("express");
const router = express.Router();
const customSetController = require("../controllers/customSetController");

router.post("/", customSetController.createCustomSet);

router.put("/:id", customSetController.updateCustomSet);

router.delete("/:id", customSetController.deleteCustomSet);

router.get("/", customSetController.getAllCustomSets);

router.get("/:id", customSetController.getCustomSetById);

router.put("/:id/add-skill", customSetController.addSkillToCustomSet);

router.put("/:setId/update-votes/:skillId", customSetController.updateSkillVotes);

router.put(
    "/:setId/update-skill-tags/:skillId",
    customSetController.updateSkillTags
);

module.exports = router;
