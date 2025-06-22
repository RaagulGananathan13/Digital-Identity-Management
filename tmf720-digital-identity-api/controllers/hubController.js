const Hub = require('../models/Hub');
const { v4: uuidv4 } = require('uuid');

exports.registerListener = async (req, res) => {
  try {
    const { callback, query } = req.body;
    if (!callback) {
      return res.status(400).json({ error: 'Callback URL is required' });
    }

    const existingHub = await Hub.findOne({ callback });
    if (existingHub) {
      return res.status(409).json({ error: 'Listener already registered' });
    }

    const hub = new Hub({
      id: uuidv4(),
      callback,
      query,
    });

    const savedHub = await hub.save();
    res.status(201).json({
      id: savedHub.id,
      callback: savedHub.callback,
      query: savedHub.query,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unregisterListener = async (req, res) => {
  try {
    const { id } = req.params;
    const hub = await Hub.findOneAndDelete({ id });

    if (!hub) {
      return res.status(404).json({ error: 'Listener not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};