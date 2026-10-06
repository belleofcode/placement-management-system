const router = require("express").Router();
const c = require("../controllers/adminController");
const { auth, allow } = require("../middleware/auth");
router.use(auth, allow("admin"));
router.get("/stats", c.stats);
router.get("/users", c.users);
router.delete("/users/:id", c.deleteUser);
module.exports = router;
