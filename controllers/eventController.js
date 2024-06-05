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
      eventEndDate,
      candidates,
    } = req.body;

    // Create the event
    const newEvent = new Event({
      eventName,
      eventType,
      eventDescription,
      eventBanner,
      eventEndDate,
    });

    // Save the event to get the ID
    const savedEvent = await newEvent.save();

    // Create and save the candidates
    const candidateDocs = await Candidate.insertMany(
      candidates.map((candidate) => ({
        ...candidate,
        eventId: savedEvent._id,
      }))
    );

    // Update the event with candidate IDs
    savedEvent.candidates = candidateDocs.map((candidate) => candidate._id);
    await savedEvent.save();

    res.status(201).json({
      message: "Event and candidates created successfully",
      event: savedEvent,
      candidates: candidateDocs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating event and candidates",
      error: error.message,
    });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("candidates");
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

    const events = await Event.find({ eventType: req.params.category })
      .populate("candidates")
      .exec();

    if (!events || events.length === 0) {
      return res
        .status(404)
        .json({
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
};
