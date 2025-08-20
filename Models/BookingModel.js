const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    roomType: {
      type: String,
      trim: true,
      enum: ["Single Bed", "Single Double Bed", "Double Bed"],
    },
    numberOfGuests: {
      type: Number,
      default: 1,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    // Reference to Room
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },

    numberOfRooms: {
      type: Number,
      default: 1,
      min: 1, // prevent booking zero or negative rooms
    },

    // Snapshot of room details at booking time
    roomSnapshot: {
      name: String,
      size: String,
      beds: String,
      price: Number,
      image: [
        {
          public_id: String,
          url: String,
        },
      ],
    },

    // ID verification images uploaded by user
    idVerificationImages: [
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

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Booking };
