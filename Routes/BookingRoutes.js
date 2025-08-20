const express = require("express");
const { createBooking } = require("../Controllers/BookingController");

const router = express.Router();

router.post("/book/:id", createBooking);

module.exports = router;
