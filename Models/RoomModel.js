const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    beds: {
      type: String,
      required: true,
    },
    features: {
      type: [String], // array of strings
      default: [], // can be empty
    },
    description: {
      type: String,
      required: true,
    },
    amenities: {
      type: [String], // array of strings
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availableRooms: {
      type: Number, // number of rooms available for booking
      required: true,
      min: 0,
      default: 1,
    },
    image: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Rooms = mongoose.model("Rooms", RoomSchema);

module.exports = { Rooms };
