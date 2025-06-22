const DigitalIdentity = require('../models/DigitalIdentity');
const Hub = require('../models/Hub');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Helper to notify listeners
const notifyListeners = async (eventType, digitalIdentity) => {
  const hubs = await Hub.find();
  const event = {
    eventId: uuidv4(),
    eventTime: new Date().toISOString(),
    eventType,
    event: { digitalIdentity },
  };

  for (const hub of hubs) {
    try {
      await axios.post(hub.callback, event);
    } catch (error) {
      console.error(`Failed to notify listener ${hub.callback}:`, error.message);
    }
  }
};

exports.listDigitalIdentities = async (req, res) => {
  try {
    const { fields, status, trustLevel } = req.query;
    const query = {};
    if (status) query.status = status;
    if (trustLevel) query['credential.trustLevel'] = trustLevel;

    const selectFields = fields ? fields.split(',').join(' ') : '';
    const digitalIdentities = await DigitalIdentity.find(query).select(selectFields);
    res.status(200).json(digitalIdentities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDigitalIdentity = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;
    const selectFields = fields ? fields.split(',').join(' ') : '';
    const digitalIdentity = await DigitalIdentity.findOne({ id }).select(selectFields);
    if (!digitalIdentity) {
      return res.status(404).json({ error: 'DigitalIdentity not found' });
    }
    res.status(200).json(digitalIdentity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDigitalIdentity = async (req, res) => {
  try {
    const digitalIdentity = req.body;
    digitalIdentity.id = uuidv4();
    digitalIdentity.href = `https://host:port/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${digitalIdentity.id}`;
    digitalIdentity.creationDate = new Date();
    digitalIdentity.lastUpdate = new Date();
    if (!digitalIdentity.status) digitalIdentity.status = 'pending';

    const newDigitalIdentity = new DigitalIdentity(digitalIdentity);
    const savedDigitalIdentity = await newDigitalIdentity.save();

    // Notify listeners
    await notifyListeners('DigitalIdentityCreateEvent', savedDigitalIdentity);

    res.status(201).json(savedDigitalIdentity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.patchDigitalIdentity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent updating id and href
    if (updates.id || updates.href) {
      return res.status(400).json({ error: 'Cannot update id or href' });
    }

    updates.lastUpdate = new Date();
    const digitalIdentity = await DigitalIdentity.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!digitalIdentity) {
      return res.status(404).json({ error: 'DigitalIdentity not found' });
    }

    // Notify listeners
    await notifyListeners('DigitalIdentityAttributeValueChangeEvent', digitalIdentity);

    res.status(200).json(digitalIdentity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDigitalIdentity = async (req, res) => {
  try {
    const { id } = req.params;
    const digitalIdentity = await DigitalIdentity.findOneAndDelete({ id });

    if (!digitalIdentity) {
      return res.status(404).json({ error: 'DigitalIdentity not found' });
    }

    // Notify listeners
    await notifyListeners('DigitalIdentityDeleteEvent', digitalIdentity);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};