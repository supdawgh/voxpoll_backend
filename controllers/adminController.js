const Event = require("../model/Event");

const getAllUnverifiedEvents = async (req, res) => {
  try {
    const events = await Event.find({ eventStatus: "unverified" }).sort({
      createdAt: -1,
    });
    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllNewEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(5);
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
    const events = await Event.find().sort({ createdAt: -1 });
    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventCount = async (req, res) => {
  try {
    const sing = await Event.find({ eventType: "sing" });
    const art = await Event.find({ eventType: "art" });
    const pageant = await Event.find({ eventType: "pageant" });
    const dance = await Event.find({ eventType: "dance" });

    res.json({
      sing: sing.length || 0,
      art: art.length || 0,
      pageant: pageant.length || 0,
      dance: dance.length || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveEvent = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "Event ID required" });

    const event = await Event.findByIdAndUpdate(req.params.id, {
      eventStatus: "verified",
    }).exec();

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

const declineEvent = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "Event ID required" });

    const event = await Event.findByIdAndUpdate(req.params.id, {
      eventStatus: "rejected",
    }).exec();

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

const getEventById = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "Event ID required" });

    const event = await Event.findById(req.params.id)
      .populate("candidates")
      .populate("author")
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
module.exports = {
  getAllUnverifiedEvents,
  getEventCount,
  getAllNewEvents,
  getAllEvents,
  approveEvent,
  declineEvent,
  getEventById,
};
