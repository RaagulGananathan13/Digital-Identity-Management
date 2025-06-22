const mongoose = require('mongoose');

const HubSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  callback: { type: String, required: true },
  query: { type: String },
});

module.exports = mongoose.model('Hub', HubSchema);