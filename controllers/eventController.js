const Candidate = require("../model/Candidate");
const Event = require("../model/Event");
const User = require("../model/User");

const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      eventDescription,
      eventBanner,
      eventStartDate,
      eventEndDate,
      candidates,
    } = req.body;

    const user = await User.findOne({ email: req.user });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 1: Create the Event
    const newEvent = new Event({
      eventName,
      eventType,
      eventDescription,
      eventBanner,
      eventStartDate: new Date(eventStartDate),
      eventEndDate: new Date(eventEndDate),
      author: user._id, // Assuming you have user information in req.user
    });

    await newEvent.save();

    // Step 2: Create the Candidates
    const candidateIds = [];
    for (const candidateData of candidates) {
      const newCandidate = new Candidate({
        name: candidateData.name,
        bio: candidateData.bio,
        photo: candidateData.photo,
        eventId: newEvent._id,
      });

      await newCandidate.save();
      candidateIds.push(newCandidate._id);
    }

    // Step 3: Update the Event with Candidate IDs
    newEvent.candidates = candidateIds;
    await newEvent.save();

    // Step 4: Send a Response
    res.status(201).json({
      message: "Event and candidates created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event and candidates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllMyEvents = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const events = await Event.find({ author: user._id })
      .populate("candidates")
      .sort({ createdAt: -1 });
    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ eventStatus: "verified" })
      .populate("candidates")
      .sort({ createdAt: -1 });
    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "Event ID required" });

    const event = await Event.findById(req.params.id)
      .populate("candidates")
      .exec();

    if (!event) {
      return res
        .status(404)
        .json({ message: `Event ID ${req.params.id} not found` });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsByCategory = async (req, res) => {
  try {
    if (!req.params.category)
      return res.status(400).json({ message: "Category is required" });

    const events = await Event.find({
      eventType: req.params.category,
      eventStatus: "verified",
    })
      .populate("candidates")
      .sort({ createdAt: -1 })
      .exec();

    if (!events || events.length === 0) {
      return res.status(204).json({
        message: `No events found for category ${req.params.category}`,
      });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByCategory,
  getEventById,
  getAllMyEvents,
};
