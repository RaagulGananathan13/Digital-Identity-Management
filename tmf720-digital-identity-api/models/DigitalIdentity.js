const mongoose = require('mongoose');

const QuantitySchema = new mongoose.Schema({
  amount: { type: Number },
  units: { type: String },
});

const TimePeriodSchema = new mongoose.Schema({
  startDateTime: { type: Date },
  endDateTime: { type: Date },
});

const AttachmentRefOrValueSchema = new mongoose.Schema({
  attachmentType: { type: String },
  description: { type: String },
  mimeType: { type: String },
  name: { type: String },
  url: { type: String },
  size: { type: QuantitySchema },
  validFor: { type: TimePeriodSchema },
  '@referredType': { type: String },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String },
});

const DigitalIdentityContactMediumSchema = new mongoose.Schema({
  id: { type: String, required: true },
  contactType: { type: String },
  preferred: { type: Boolean },
  validFor: { type: TimePeriodSchema },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String, required: true },
  emailAddress: { type: String }, // For EmailMedium
  phoneNumber: { type: String }, // For PhoneMedium
});

const CredentialSchema = new mongoose.Schema({
  id: { type: String, required: true },
  state: { type: String, enum: ['active', 'inactive', 'expired'] },
  trustLevel: { type: String },
  validFor: { type: TimePeriodSchema },
  contactMedium: [DigitalIdentityContactMediumSchema],
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String, required: true },
  login: { type: String }, // For LoginPasswordCredential
  password: { type: String }, // For LoginPasswordCredential
  tokenCredential: { type: String }, // For TokenCredential
  tokenType: { type: String }, // For TokenCredential
});

const RelatedPartySchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String },
  name: { type: String },
  role: { type: String },
  '@referredType': { type: String, required: true },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String },
});

const PartyRefSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String },
  name: { type: String },
  '@referredType': { type: String, required: true },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String },
});

const ResourceRefSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String },
  name: { type: String },
  '@referredType': { type: String },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String },
});

const DigitalIdentitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  creationDate: { type: Date },
  lastUpdate: { type: Date },
  nickname: { type: String },
  status: { type: String, enum: ['unknown', 'active', 'suspended', 'archived', 'pending'] },
  attachment: [AttachmentRefOrValueSchema],
  contactMedium: [DigitalIdentityContactMediumSchema],
  credential: { type: [CredentialSchema], required: true },
  individualIdentified: { type: PartyRefSchema },
  partyRoleIdentified: [RelatedPartySchema],
  relatedParty: [RelatedPartySchema],
  resourceIdentified: { type: ResourceRefSchema },
  validFor: { type: TimePeriodSchema },
  '@baseType': { type: String },
  '@schemaLocation': { type: String },
  '@type': { type: String },
}, { timestamps: false });

module.exports = mongoose.model('DigitalIdentity', DigitalIdentitySchema);