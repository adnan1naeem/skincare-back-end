const router = require("express").Router();

router.use("/", require("./Users"));
router.use("/products", require("./Products"));
router.use("/skinnalysis", require("./SkinAnalysis"));
router.use("/dailyroutine", require("./DailyRoutine"));

module.exports = router;
