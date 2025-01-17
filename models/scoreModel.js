const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  scoreA: { type: Number, required: true },
  scoreB: { type: Number, default: 0 }, // Added score for Team B
  wickets: { 
    type: Number, 
    required: true, 
    validate: {
      validator: (v) => v <= 10, // Ensure wickets do not exceed 10
      message: "Wickets cannot exceed 10.",
    },
  },
  currentOver: { type: Number, required: true },
  currentBall: { type: Number, required: true },
  overs: {
    type: [[String]],
    default: [],
    validate: {
      validator: (v) => Array.isArray(v),
      message: "Overs must be an array of arrays of strings",
    },
  },
});

// Pre-save hook to ensure wickets don't exceed 10
scoreSchema.pre("save", function (next) {
  if (this.wickets > 10) {
    this.wickets = 10; // Limit wickets to 10
  }
  next();
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
