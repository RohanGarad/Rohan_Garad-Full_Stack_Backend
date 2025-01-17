const Score = require("./models/scoreModel");

let matchData = {}; // Store match data for multiple match IDs

// Get the latest score for a specific matchId
const getLatestScore = async (req, res) => {
  const { matchId } = req.params;

  try {
    const latestScore = await Score.findOne({ matchId }); // Query the database
    if (!latestScore) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(latestScore); // Return the score
  } catch (error) {
    console.error("Error fetching latest score:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update the score for a specific matchId
const updateScore = async (req, res) => {
  const { matchId, over, ball, score, isOut } = req.body;

  try {
    // Check if match already exists
    let scoreRecord = await Score.findOne({ matchId });

    // Create a new record if it doesn't exist
    if (!scoreRecord) {
      scoreRecord = new Score({
        matchId,
        scoreA: 0,
        wickets: 0,
        currentOver: 0,
        currentBall: 0,
        overs: [],
      });
    }

    // Update the record
    scoreRecord.scoreA += score;
    if (isOut) scoreRecord.wickets += 1;

    // Update overs and balls
    if (!scoreRecord.overs[over - 1]) {
      scoreRecord.overs[over - 1] = [];
    }
    scoreRecord.overs[over - 1][ball - 1] = isOut ? "W" : `${score}`;

    scoreRecord.currentOver = over;
    scoreRecord.currentBall = ball;

    // Save changes to the database
    await scoreRecord.save();

    res.json({ matchScore: scoreRecord });
  } catch (error) {
    console.error("Error updating score:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { getLatestScore, updateScore };
