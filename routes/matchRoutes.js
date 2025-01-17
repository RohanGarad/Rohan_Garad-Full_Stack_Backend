const express = require("express");
const router = express.Router();
const { getLatestScore, updateScore } = require("../matchController");

router.get("/scores/:matchId/latest", getLatestScore);
router.post("/scores/ball", updateScore);


module.exports = router;
