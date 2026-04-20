# Web-Based Text Encryption Tool

## Description
This is a simple web-based application that allows users to encrypt and decrypt text using various algorithms. The tool is designed to be user-friendly and easy to understand, making it ideal for educational purposes.

## Features
- **Encryption Algorithms**:
  - Caesar Cipher
  - Base64
  - AES (Advanced Encryption Standard)
- **Decryption Support** for all implemented algorithms.
- **Copy to Clipboard** feature for ciphertext.

## How to Run

### Frontend
1. Open the `index.html` file in any modern web browser.
2. Enter the plain text, select an encryption algorithm, and click "Encrypt".
3. To decrypt, paste the ciphertext, select the algorithm, and click "Decrypt".

### Backend
1. Navigate to the `assing2/backend` directory.
2. Run `npm install` to install the required dependencies.
3. Start the server by running `node server.js`.
4. The backend will be available at `http://localhost:3000`.

## API Endpoints
- **POST /encrypt**
  - Request Body:
    ```json
    {
      "text": "Your text here",
      "algorithm": "caesar|base64|aes",
      "key": "Your key (only for AES)"
    }
    ```
  - Response:
    ```json
    {
      "ciphertext": "Encrypted text here"
    }
    ```
- **POST /decrypt**
  - Request Body:
    ```json
    {
      "text": "Your ciphertext here",
      "algorithm": "caesar|base64|aes",
      "key": "Your key (only for AES)"
    }
    ```
  - Response:
    ```json
    {
      "plaintext": "Decrypted text here"
    }
    ```

### API Endpoint
The backend provides a single API endpoint:

#### POST `/api/transform`

**Request Body**:
```json
{
  "algorithm": "<algorithm>",
  "mode": "<encrypt|decrypt>",
  "text": "<text>",
  "shift": <number>,
  "passphrase": "<passphrase>"
}
```

- `algorithm`: The encryption algorithm to use (`caesar`, `base64`, `aes').
- `mode`: Either `encrypt` or `decrypt`.
- `text`: The input text to encrypt or decrypt.
- `shift`: (Optional) Shift value for Caesar Cipher (1-25).
- `passphrase`: (Optional) Passphrase for AES encryption.

**Response**:
```json
{
  "result": "<encrypted_or_decrypted_text>"
}
```

## Example Usage

### Caesar Cipher
**Request**:
```json
{
  "algorithm": "caesar",
  "mode": "encrypt",
  "text": "hello",
  "shift": 3
}
```
**Response**:
```json
{
  "result": "khoor"
}
```

### AES
**Request**:
```json
{
  "algorithm": "aes",
  "mode": "encrypt",
  "text": "hello",
  "passphrase": "mysecretkey"
}
```
**Response**:
```json
{
  "result": "U2FsdGVkX1+..."
}
```

### Base64
**Request**:
```json
{
  "algorithm": "base64",
  "mode": "encrypt",
  "text": "hello"
}
```
**Response**:
```json
{
  "result": "aGVsbG8="
}
```

## Notes
- Ensure the backend server is running before using the frontend.
- Use a modern web browser for the best experience.

## Dependencies
- **Frontend**: None (pure HTML, CSS, and JavaScript).
- **Backend**:
  - `express`
  - `body-parser`
  - `crypto`

## Author
Sabeeh

---

Feel free to modify the code and experiment with different encryption techniques!