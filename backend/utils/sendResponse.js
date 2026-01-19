import { encrypt } from "./ResponseEncryptandDecrypt.js";

export const sendResponse = (
  res,
  status,
  statusCode,
  message,
  data,
  defaultData = {},
  error = {}
) => {
  
  let encrypted = {
    status,
    statusCode,
    message,
    data,
    defaultData,
    error,
  };
  let encryptedData = encrypt(encrypted);
  return res.status(statusCode).json({ data: encryptedData });
};
