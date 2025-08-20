const express = require("express");
const {
  addRoom,
  getRoom,
  getOneRoom,
  updateRoom,
  getRoomTypes,
} = require("../Controllers/roomController");

const router = express.Router();

router.post("/add", addRoom);
router.get("/get-rooms", getRoom);
router.get("/get-room/:id", getOneRoom);
router.get("/room-type", getRoomTypes);
router.put("/update-room/:id", updateRoom);

module.exports = router;
