const validateDigitalIdentity = (req, res, next) => {
  const { credential, individualIdentified, partyRoleIdentified, resourceIdentified } = req.body;

  // Mandatory credential for POST
  if (req.method === 'POST' && (!credential || !Array.isArray(credential) || credential.length === 0)) {
    return res.status(400).json({ error: 'Credential is mandatory' });
  }

  // Validate at least one of individualIdentified, partyRoleIdentified, or resourceIdentified
  if (
    req.method === 'POST' &&
    (!individualIdentified && (!partyRoleIdentified || partyRoleIdentified.length === 0) && !resourceIdentified)
  ) {
    return res.status(400).json({ error: 'At least one of individualIdentified, partyRoleIdentified, or resourceIdentified must be provided' });
  }

  // Validate sub-resource mandatory fields
  if (credential) {
    for (const cred of credential) {
      if (!cred.id || !cred['@type']) {
        return res.status(400).json({ error: 'Credential must have id and @type' });
      }
    }
  }

  if (individualIdentified && !individualIdentified.id) {
    return res.status(400).json({ error: 'individualIdentified must have id' });
  }

  if (partyRoleIdentified) {
    for (const role of partyRoleIdentified) {
      if (!role.id || !role['@referredType']) {
        return res.status(400).json({ error: 'partyRoleIdentified must have id and @referredType' });
      }
    }
  }

  if (resourceIdentified && !resourceIdentified.id) {
    return res.status(400).json({ error: 'resourceIdentified must have id' });
  }

  next();
};

module.exports = { validateDigitalIdentity };