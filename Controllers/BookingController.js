const { uploadImages } = require("../Helpers/ImageUploader");
const { Booking } = require("../Models/BookingModel");
const { Rooms } = require("../Models/RoomModel");
const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "baroonshrestha02@gmail.com", // Admin/System email for sending
    pass: "bgnwktovravqrxpz", // Replace with valid App Password
  },
});

// Function to send booking confirmation email
const sendBookingConfirmationEmail = async (booking, room) => {
  const adminEmail = "";
  const hotelContact = "baroonshrestha02@gmail.com";
  const hotelName = "Hotel Sherpa Soul";
  const logoUrl =
    "https://res.cloudinary.com/dbwu2fxcs/image/upload/v1754897503/debuudw3pdlpiiwlfypt.png"; // Replace with actual hotel logo URL
  const recipients = [booking.email, adminEmail];
  const { name, size, beds, price } = booking.roomSnapshot;
  const roomImageUrl = booking.roomSnapshot.image[0]?.url || "";
  const idVerificationImageUrls = booking.idVerificationImages.map(
    (img) => img.url
  );

  // Calculate number of nights for total price
  const days = calculateDays(booking.checkIn, booking.checkOut);

  // Prepare attachments for admin email (ID verification images)
  const attachments = idVerificationImageUrls.map((imgUrl, index) => ({
    filename: `id-verification-${index + 1}.jpg`, // Adjust based on URL if needed
    path: imgUrl,
    cid: `id-verification-${index + 1}`,
  }));

  recipients.forEach(async (recipient) => {
    const isAdmin = recipient === adminEmail;
    const mailOptions = {
      from: `${hotelName} <${adminEmail}>`,
      to: recipient,
      subject: `${hotelName} - Booking Confirmation - ${booking.name}`,
      attachments: isAdmin ? attachments : [],
      html: isAdmin
        ? `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            /* Reset */
            body, html {
              margin: 0; padding: 0; width: 100%; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
            }
            .container {
              max-width: 600px; margin: 30px auto; background: #fff;
              border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background-color: #004aad;
              color: #ffffff; text-align: center; padding: 25px 20px;
            }
            .header img {
              max-width: 140px; margin-bottom: 12px;
              filter: brightness(0) invert(1); /* for white logo effect if needed */
            }
            .header h1 {
              margin: 0; font-weight: 700; font-size: 24px; letter-spacing: 1px;
            }
            .content {
              padding: 30px 25px;
              color: #333333; font-size: 16px; line-height: 1.5;
            }
            .content p {
              margin-bottom: 18px;
            }
            table.details {
              width: 100%; border-collapse: collapse; margin: 25px 0;
              box-shadow: 0 0 10px rgba(0,0,0,0.05);
              border-radius: 6px;
              overflow: hidden;
            }
            table.details tr {
              background: #fafafa;
              border-bottom: 1px solid #e1e1e1;
            }
            table.details tr:nth-child(even) {
              background: #f0f4f9;
            }
            table.details td {
              padding: 14px 18px;
              font-size: 15px;
              color: #555555;
            }
            table.details td:first-child {
              font-weight: 600;
              color: #222222;
              width: 45%;
              background: #f7faff;
            }
            .id-images {
              margin: 20px 0;
            }
            .id-images img {
              max-width: 100%; margin-bottom: 15px; border-radius: 6px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .footer {
              background: #f0f2f7; color: #888888; text-align: center;
              padding: 18px 20px; font-size: 13px; letter-spacing: 0.5px;
              border-top: 1px solid #e2e6ea;
            }
            @media only screen and (max-width: 620px) {
              .container {
                margin: 10px 10px;
                width: auto !important;
              }
              .content {
                padding: 20px 15px;
              }
              table.details td {
                padding: 12px 10px;
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container" role="document">
            <div class="header" role="banner">
              <img src="${logoUrl}" alt="${hotelName} Logo" />
              <h1>New Booking Confirmation</h1>
            </div>
            <div class="content" role="main">
              <p>Dear Admin,</p>
              <p>A new booking has been confirmed for <strong>${hotelName}</strong>. Please review the details below and take necessary action.</p>
              <table class="details" role="table" aria-label="Booking details">
                <tr><td>Guest Name:</td><td>${booking.name}</td></tr>
                <tr><td>Room Name:</td><td>${name}</td></tr>
                <tr><td>Room Size:</td><td>${size}</td></tr>
                <tr><td>Beds:</td><td>${beds}</td></tr>
                <tr><td>Room Type:</td><td>${booking.roomType}</td></tr>
                <tr><td>Number of Rooms:</td><td>${
                  booking.numberOfRooms
                }</td></tr>
                <tr><td>Number of Guests:</td><td>${
                  booking.numberOfGuests
                }</td></tr>
                <tr><td>Check-In:</td><td>${new Date(
                  booking.checkIn
                ).toLocaleDateString()}</td></tr>
                <tr><td>Check-Out:</td><td>${new Date(
                  booking.checkOut
                ).toLocaleDateString()}</td></tr>
         <tr><td>Total Price:</td><td>Rs. ${(
           price *
           booking.numberOfRooms *
           days
         ).toFixed(2)}</td></tr>

              </table>
              <p><strong>Guest Contact Information:</strong> ${
                booking.email
              } (Phone: ${booking.number})</p>
              <p><strong>ID Verification Images:</strong></p>
              <div class="id-images">
                ${attachments
                  .map(
                    (_, index) =>
                      `<img src="cid:id-verification-${
                        index + 1
                      }" alt="ID Verification Image ${index + 1}" />`
                  )
                  .join("")}
              </div>
              <p><strong>Action Required:</strong> Please verify the ID images and follow up with the guest if needed.</p>
            </div>
            <div class="footer" role="contentinfo">
              <p>${hotelName} | ${hotelContact} | Kathmandu, Nepal</p>
            </div>
          </div>
        </body>
        </html>
      `
        : `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body, html {
              margin: 0; padding: 0; width: 100%; background-color: #f4f6f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
            }
            .container {
              max-width: 600px; margin: 30px auto; background: #fff;
              border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background-color: #004aad;
              color: #fff; text-align: center; padding: 25px 20px;
            }
            .header img {
              max-width: 140px; margin-bottom: 12px;
              filter: brightness(0) invert(1);
            }
            .header h1 {
              margin: 0; font-weight: 700; font-size: 24px; letter-spacing: 1px;
            }
            .content {
              padding: 30px 25px;
              color: #333; font-size: 16px; line-height: 1.5;
            }
            .content p {
              margin-bottom: 18px;
            }
            table.details {
              width: 100%; border-collapse: collapse; margin: 25px 0;
              box-shadow: 0 0 10px rgba(0,0,0,0.05);
              border-radius: 6px;
              overflow: hidden;
            }
            table.details tr {
              background: #fafafa;
              border-bottom: 1px solid #e1e1e1;
            }
            table.details tr:nth-child(even) {
              background: #f0f4f9;
            }
            table.details td {
              padding: 14px 18px;
              font-size: 15px;
              color: #555;
            }
            table.details td:first-child {
              font-weight: 600;
              color: #222;
              width: 45%;
              background: #f7faff;
            }
            .room-image {
              margin: 20px 0;
              text-align: center;
            }
            .room-image img {
              max-width: 100%; border-radius: 6px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            .footer {
              background: #f0f2f7; color: #888; text-align: center;
              padding: 18px 20px; font-size: 13px; letter-spacing: 0.5px;
              border-top: 1px solid #e2e6ea;
            }
            a {
              color: #004aad; text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            @media only screen and (max-width: 620px) {
              .container {
                margin: 10px 10px;
                width: auto !important;
              }
              .content {
                padding: 20px 15px;
              }
              table.details td {
                padding: 12px 10px;
                font-size: 14px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container" role="document">
            <div class="header" role="banner">
              <img src="${logoUrl}" alt="${hotelName} Logo" />
              <h1>Booking Confirmation</h1>
            </div>
            <div class="content" role="main">
              <p>Dear ${booking.name},</p>
              <p>Welcome to <strong>${hotelName}</strong>! We’re thrilled to confirm your booking. Here are the details:</p>
              <table class="details" role="table" aria-label="Booking details">
                <tr><td>Room Name:</td><td>${name}</td></tr>
                <tr><td>Room Size:</td><td>${size}</td></tr>
                <tr><td>Beds:</td><td>${beds}</td></tr>
                <tr><td>Room Type:</td><td>${booking.roomType}</td></tr>
                <tr><td>Number of Rooms:</td><td>${
                  booking.numberOfRooms
                }</td></tr>
                <tr><td>Number of Guests:</td><td>${
                  booking.numberOfGuests
                }</td></tr>
                <tr><td>Check-In:</td><td>${new Date(
                  booking.checkIn
                ).toLocaleDateString()}</td></tr>
                <tr><td>Check-Out:</td><td>${new Date(
                  booking.checkOut
                ).toLocaleDateString()}</td></tr>
                <tr><td>Total Price:</td><td>Rs. ${(
                  price *
                  booking.numberOfRooms *
                  days
                ).toFixed(2)}</td></tr>
              </table>
              ${
                roomImageUrl
                  ? `<div class="room-image"><img src="${roomImageUrl}" alt="Room Image" /></div>`
                  : ""
              }
              <p>If you have any questions, feel free to <a href="mailto:${hotelContact}">contact us</a>.</p>
              <p>We can’t wait to welcome you to ${hotelName}!</p>
            </div>
            <div class="footer" role="contentinfo">
              <p>${hotelName} | ${hotelContact} | Kathmandu, Nepal</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(
        `Booking confirmation email sent successfully to ${recipient}`
      );
    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error.message);
      // Note: We won't throw an error here to avoid disrupting the booking process
    }
  });
};

const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

const createBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      number,
      roomType,
      numberOfGuests,
      checkIn,
      checkOut,
      numberOfRooms = 1, // default to 1
    } = req.body;

    // 1. Validate required fields
    if (
      !name ||
      !email ||
      !number ||
      !roomType ||
      !numberOfGuests ||
      !checkIn ||
      !checkOut
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // 2. Validate number of rooms
    if (Number(numberOfRooms) < 1) {
      return res
        .status(400)
        .json({ message: "Number of rooms must be at least 1" });
    }

    // 3. Check if room exists
    const room = await Rooms.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 4. Check overlapping bookings
    const overlappingBookings = await Booking.find({
      room: room._id,
      // find bookings that overlap with requested dates
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    });

    // Count how many rooms are already booked for those dates
    const alreadyBooked = overlappingBookings.reduce(
      (total, b) => total + b.numberOfRooms,
      0
    );

    const availableNow = room.totalRooms - alreadyBooked;

    if (numberOfRooms > availableNow) {
      return res.status(400).json({
        message: `Only ${availableNow} room(s) are available for the selected dates`,
      });
    }

    // 5. Validate guest capacity
    const maxGuestsAllowed = (Number(room.guests) || 0) * Number(numberOfRooms);
    if (Number(numberOfGuests) > maxGuestsAllowed) {
      return res.status(400).json({
        message: `Maximum ${maxGuestsAllowed} guests allowed for ${numberOfRooms} room(s)`,
      });
    }

    // 6. Validate ID verification images
    if (!req.files || !req.files.idVerificationImages) {
      return res
        .status(400)
        .json({ message: "ID verification images are required" });
    }

    // 7. Upload ID images to Cloudinary
    const idVerificationImages = await uploadImages(
      req.files.idVerificationImages
    );

    const idImagesArray = Array.isArray(idVerificationImages)
      ? idVerificationImages
      : [idVerificationImages];

    // 8. Create booking document
    const booking = new Booking({
      name,
      email,
      number,
      roomType,
      numberOfGuests,
      numberOfRooms: Number(numberOfRooms),
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      room: room._id,
      roomSnapshot: {
        name: room.name,
        size: room.size,
        beds: room.beds,
        price: room.price,
        image: [
          {
            public_id: room.image.public_id,
            url: room.image.url,
            _id: room.image._id,
          },
        ],
      },
      idVerificationImages: idImagesArray,
      status: "confirmed", // optional: pending, confirmed, completed, cancelled
    });

    // 9. Save booking
    const savedBooking = await booking.save();

    // ❌ IMPORTANT: Do not decrement availableRooms permanently
    // Availability will always be recalculated dynamically using overlappingBookings

    // 10. Send confirmation email
    await sendBookingConfirmationEmail(savedBooking, room);

    res.status(201).json({
      success: true,
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = { createBooking };
