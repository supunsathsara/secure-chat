import crypto from 'crypto';
import { send } from 'process';

export function encryptMessage(message: string): string {
    const secretKey = "123secret"
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function generateMessageDigest(message: string): string {
  return crypto.createHash('sha256').update(message).digest('hex');
}

export function decryptMessage(encryptedMessage: string): string {
    const secret= "123secret"
    const decipher = crypto.createDecipher('aes-256-cbc', secret);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }



  export function verifyMessage(message: string, digest: string): boolean {
    const messageDigest = generateMessageDigest(message);
    return messageDigest === digest;
  }

export function getReceiverId(senderId: string): string {
    // e4b26131-5541-403d-b688-fcae8cb18366
    // b43fb38c-7e0f-4aeb-8857-5dc13a286338
    //get the other one from the two
    const receiverId = senderId === "e4b26131-5541-403d-b688-fcae8cb18366" ? "b43fb38c-7e0f-4aeb-8857-5dc13a286338" : "e4b26131-5541-403d-b688-fcae8cb18366";
    return receiverId;
}