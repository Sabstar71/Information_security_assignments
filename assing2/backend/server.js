import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

function caesarShift(str, shift) {
  const a = 'a'.charCodeAt(0), z = 'z'.charCodeAt(0);
  const A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);
  const n = 26;
  const s = ((shift % n) + n) % n;
  return Array.from(str).map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= a && code <= z) {
      return String.fromCharCode(((code - a + s) % n) + a);
    } else if (code >= A && code <= Z) {
      return String.fromCharCode(((code - A + s) % n) + A);
    }
    return ch;
  }).join('');
}

function base64EncodeUtf8(str) {
  const wordArray = CryptoJS.enc.Utf8.parse(str);
  return CryptoJS.enc.Base64.stringify(wordArray);
}
function base64DecodeUtf8(b64) {
  const wordArray = CryptoJS.enc.Base64.parse(b64);
  return CryptoJS.enc.Utf8.stringify(wordArray);
}

app.post('/api/transform', (req, res) => {
  try {
    const { algorithm, mode, text, shift, passphrase } = req.body || {};
    if (!algorithm) return res.status(400).json({ error: 'algorithm is required' });
    if (!text) return res.status(400).json({ error: 'text is required' });

    let result = '';

    if (algorithm === 'sha256') {
      const hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
      result = hash;
    } else if (algorithm === 'caesar') {
      const s = parseInt(shift ?? 0, 10);
      if (Number.isNaN(s) || s < -25 || s > 25) {
        return res.status(400).json({ error: 'shift must be between -25 and 25' });
      }
      result = mode === 'decrypt' ? caesarShift(text, -s) : caesarShift(text, s);
    } else if (algorithm === 'base64') {
      result = mode === 'decrypt' ? base64DecodeUtf8(text) : base64EncodeUtf8(text);
    } else if (algorithm === 'aes') {
      if (!passphrase) return res.status(400).json({ error: 'passphrase required for AES' });
      if (mode === 'decrypt') {
        const bytes = CryptoJS.AES.decrypt(text, passphrase);
        const plaintext = CryptoJS.enc.Utf8.stringify(bytes);
        if (!plaintext) throw new Error('Wrong passphrase or corrupted ciphertext.');
        result = plaintext;
      } else {
        result = CryptoJS.AES.encrypt(text, passphrase).toString();
      }
    } else {
      return res.status(400).json({ error: 'Unsupported algorithm' });
    }

    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Transform error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Encryption backend running on http://localhost:${PORT}`);
});