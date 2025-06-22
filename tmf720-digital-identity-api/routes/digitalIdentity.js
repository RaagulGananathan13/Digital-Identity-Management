const express = require('express');
const router = express.Router();
const digitalIdentityController = require('../controllers/digitalIdentityController');
const { validateDigitalIdentity } = require('../middleware/validate');

router.get('/', digitalIdentityController.listDigitalIdentities);
router.get('/:id', digitalIdentityController.getDigitalIdentity);
router.post('/', validateDigitalIdentity, digitalIdentityController.createDigitalIdentity);
router.patch('/:id', validateDigitalIdentity, digitalIdentityController.patchDigitalIdentity);
router.delete('/:id', digitalIdentityController.deleteDigitalIdentity);

module.exports = router;