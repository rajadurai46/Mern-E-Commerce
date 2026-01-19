import { CryptoJS } from "crypto-js";


const SECRET_KEY = import.meta.env.VITE_ENCRYPT_DECRYPT_SECRET_KEY;

/* Encrypt */
export const encrypt = (text) => {
  if (!text) return null;

  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    SECRET_KEY
  ).toString();
};

/* Decrypt */
export const decrypt = (cipherText) => {
   // console.log('cipherText------', SECRET_KEY)
  if (!cipherText || typeof cipherText !== "string") return null;

  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return decrypted ? JSON.parse(decrypted) : null;
};
