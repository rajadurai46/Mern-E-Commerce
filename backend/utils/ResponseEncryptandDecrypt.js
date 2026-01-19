import CryptoJS from "crypto-js";
import { sendResponse } from "./sendResponse.js";

/**
 * Encrypt text
 * @param {string} text - Plain text to encrypt
 * @param {string} secretKey - Secret key
 * @returns {string} encrypted text
 */
export const encrypt = (text) => {
  if (!text) return null;
  let data = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.ENCRYPT_DECRYPT_SECRET_KEY
  ).toString();

  return data;
};

/**
 * Decrypt encrypted text
 * @param {string} cipherText - Encrypted text
 * @param {string} secretKey - Secret key
 * @returns {string|null} decrypted text
 */
export const decrypt = (req, res, next) => {
  try {
    const { data } = req.body;
   

    if (!data) {
      sendResponse(res, false, 400, "Encrypted data missing", [], {}, error);
    }

    const bytes = CryptoJS.AES.decrypt(
      data,
      process.env.ENCRYPT_DECRYPT_SECRET_KEY
    );

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      sendResponse(res, false, 400, "Decryption failed", [], {}, error);
    }

    // Replace req.body with decrypted object
    req.body = JSON.parse(decryptedText);
   

    next();
  } catch (error) {
    console.error("Decrypt error:", error);
    sendResponse(res, false, 400, "Decryption failed", [], {}, error);
  }
};
