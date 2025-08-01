// routes/pods.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // user schema with credits & bookings
const moment = require('moment');


const podRoutes = require('./routes/podRoutes'); // ✅ use the correct file
app.use('/api/pods', podRoutes);

// POST /api/pods/book
router.post('/book', async (req, res) => {
  const userId = req.userId; // set via auth middleware
  const { slot } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const thisWeekBookings = user.podBookings.filter(booking =>
      moment(booking).isSame(new Date(), 'week')
    );

    let isFree = thisWeekBookings.length === 0;

    if (!isFree && user.credits < 50) {
      return res.status(400).json({ message: 'Not enough credits' });
    }

    user.podBookings.push(slot);
    if (!isFree) user.credits -= 50;

    await user.save();

    res.status(200).json({
      message: `Pod booked successfully for ${slot}`,
      deductedCredits: isFree ? 0 : 50
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed' });
  }
});

module.exports = router;
