const express = require('express');
const router = express.Router();
const PodBooking = require('../models/PodBooking');
const authMiddleware = require('../middleware/authMiddleware'); // JWT auth


// Get current week's pod usage
router.get('/usage', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate start and end of current week (Mon to Sun)
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    const bookings = await PodBooking.find({
      userId,
      slot: { $gte: startOfWeek, $lte: endOfWeek }
    });

    return res.json({
      count: bookings.length,
      freeUsed: bookings.length >= 1
    });

  } catch (error) {
    console.error('Pod usage fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch pod usage' });
  }
});

module.exports = router;
