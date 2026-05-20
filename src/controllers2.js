
const pool = require('./db');
const qrCode = require('qrcode');

const chars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function encodeBase62(dbIndex) {
  num = BigInt(dbIndex);

  if (num === 0n) return chars[0];

  let result = "";

  while (num > 0n) {
    const remainder = num % 62n;

    shortCode = chars[Number(remainder)] + result;

    num = num / 62n;
  }

  return shortCode;
}
