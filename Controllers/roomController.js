const { uploadImages } = require("../Helpers/ImageUploader");
const { Rooms } = require("../Models/RoomModel");

// Capitalize each word in the room name
const capitalizeName = (str) => {
  return str
    .trim()
    .split(" ")
    .filter(Boolean) // remove extra spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const addRoom = async (req, res) => {
  try {
    let {
      name,
      guests,
      size,
      beds,
      features,
      description,
      amenities,
      price,
      availableRooms,
    } = req.body;

    // Validation for main fields
    if (
      !name ||
      !guests ||
      !size ||
      !beds ||
      !description ||
      !amenities ||
      !price
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Capitalize room name
    name = capitalizeName(name);

    // Duplicate check (case-insensitive, matches after capitalization)
    const existingRoom = await Rooms.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingRoom) {
      return res.status(409).json({ message: "Room already exists" });
    }

    // Validate images exist
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await uploadImages(req.files.image);

    // Create room
    const room = new Rooms({
      name,
      guests,
      size,
      beds,
      features: features || [],
      description,
      amenities: Array.isArray(amenities) ? amenities : [amenities],
      price,
      availableRooms: availableRooms ? Number(availableRooms) : 1,
      image: Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages],
    });

    const savedRoom = await room.save();

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: savedRoom,
    });
  } catch (error) {
    console.error("Error adding room:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Rooms.find();
    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Error adding room:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getOneRoom = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ message: `Room with ${id} not found` });
  try {
    const oneRoom = await Rooms.findById(id);
    res.status(200).json({
      success: true,
      oneRoom,
    });
  } catch (error) {
    console.error("Error adding room:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getRoomTypes = async (req, res) => {
  try {
    // Get unique room types based on 'name' field
    const roomTypes = await Rooms.distinct("name");

    res.status(200).json({
      success: true,
      data: roomTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      name,
      guests,
      size,
      beds,
      features,
      description,
      amenities,
      price,
      availableRooms,
    } = req.body;

    // Find the room first
    const room = await Rooms.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Update name if provided, check for duplicates
    if (name) {
      name = capitalizeName(name);
      const existingRoom = await Rooms.findOne({
        name: { $regex: `^${name}$`, $options: "i" },
        _id: { $ne: id },
      });
      if (existingRoom) {
        return res
          .status(409)
          .json({ message: "Room with this name already exists" });
      }
      room.name = name;
    }

    // Update other fields only if provided
    if (guests !== undefined) room.guests = guests;
    if (size) room.size = size;
    if (beds) room.beds = beds;
    if (features)
      room.features = Array.isArray(features) ? features : [features];
    if (description) room.description = description;
    if (amenities)
      room.amenities = Array.isArray(amenities) ? amenities : [amenities];
    if (price !== undefined) room.price = price;
    if (availableRooms !== undefined)
      room.availableRooms = Number(availableRooms);

    // Keep old images unless new ones are uploaded
    if (req.files && req.files.image) {
      const uploadedImages = await uploadImages(req.files.image);
      room.image = Array.isArray(uploadedImages)
        ? uploadedImages
        : [uploadedImages];
    }

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = { addRoom, getRoom, getOneRoom, updateRoom, getRoomTypes };
