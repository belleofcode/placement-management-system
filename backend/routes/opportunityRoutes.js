const router = require("express").Router();
const c = require("../controllers/opportunityController");
const { auth, allow } = require("../middleware/auth");

router.get("/", auth, c.list);
router.post("/", auth, allow("company"), c.create);
router.put("/:id", auth, allow("company", "admin"), c.update);
router.delete("/:id", auth, allow("company", "admin"), c.remove);
router.post("/:id/apply", auth, allow("student"), c.apply);
router.get("/applications/mine", auth, allow("student"), c.myApplications);
router.get("/:id/applicants", auth, allow("company", "admin"), c.applicants);
router.patch("/applications/:applicationId/status", auth, allow("company", "admin"), c.updateApplication);
module.exports = router;
