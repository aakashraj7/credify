const crypto = require('crypto');

/**
 * Generates a unique Credify Credential ID (e.g., CFY-8A2X7M91)
 */
function generateCredentialId() {
  const randomChars = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CFY-${randomChars}`;
}

module.exports = {
  generateCredentialId
};
