document.getElementById('encryptButton').addEventListener('click', async () => {
    const plainText = document.getElementById('plainText').value;
    const algorithm = document.getElementById('algorithm').value;
    const shift = parseInt(document.getElementById('shift').value) || 3;
    const passphrase = document.getElementById('passphrase').value;

    if (!plainText) {
        alert('Please enter plain text.');
        return;
    }

    if (!algorithm) {
        alert('Please select an encryption algorithm.');
        return;
    }

    if (algorithm === 'aes' && !passphrase) {
        alert('Please enter a passphrase for AES encryption.');
        return;
    }

    try {
        const body = { text: plainText, algorithm, mode: 'encrypt' };
        if (algorithm === 'caesar') body.shift = shift;
        if (algorithm === 'aes') body.passphrase = passphrase;

        const response = await fetch('http://localhost:3000/api/transform', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('cipherText').value = data.result;
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

document.getElementById('decryptButton').addEventListener('click', async () => {
    const cipherText = document.getElementById('cipherText').value;
    const algorithm = document.getElementById('algorithm').value;
    const shift = parseInt(document.getElementById('shift').value) || 3;
    const passphrase = document.getElementById('passphrase').value;

    if (!cipherText) {
        alert('Please enter ciphertext.');
        return;
    }

    if (!algorithm) {
        alert('Please select an encryption algorithm.');
        return;
    }

    if (algorithm === 'aes' && !passphrase) {
        alert('Please enter a passphrase for AES decryption.');
        return;
    }

    try {
        const body = { text: cipherText, algorithm, mode: 'decrypt' };
        if (algorithm === 'caesar') body.shift = shift;
        if (algorithm === 'aes') body.passphrase = passphrase;

        const response = await fetch('http://localhost:3000/api/transform', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('plainText').value = data.result;
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

document.getElementById('copyButton').addEventListener('click', () => {
    const cipherText = document.getElementById('cipherText').value;
    if (!cipherText) {
        alert('No ciphertext to copy.');
        return;
    }

    navigator.clipboard.writeText(cipherText).then(() => {
        alert('Ciphertext copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy ciphertext: ' + err);
    });
});