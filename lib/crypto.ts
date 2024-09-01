import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = '123secret';
const key = crypto.createHash('sha256').update(secretKey).digest();
const iv = crypto.randomBytes(16);

// Encrypts a message using AES-256-CBC
export function encryptMessage(message: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypts a message using AES-256-CBC
export function decryptMessage(encryptedMessage: string): string {
  const parts = encryptedMessage.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted message format');
  }
  const [ivHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Generates a message digest using SHA-256
export function generateMessageDigest(message: string): string {
  return crypto.createHash('sha256').update(message).digest('hex');
}

// Verifies a message digest
export function verifyMessage(message: string, digest: string): boolean {
  const messageDigest = generateMessageDigest(message);
  return messageDigest === digest;
}

// export function getReceiverId(senderId: string): string {
//     // e4b26131-5541-403d-b688-fcae8cb18366
//     // b43fb38c-7e0f-4aeb-8857-5dc13a286338
//     //get the other one from the two
//     const receiverId = senderId === "e4b26131-5541-403d-b688-fcae8cb18366" ? "b43fb38c-7e0f-4aeb-8857-5dc13a286338" : "e4b26131-5541-403d-b688-fcae8cb18366";
//     return receiverId;
// }