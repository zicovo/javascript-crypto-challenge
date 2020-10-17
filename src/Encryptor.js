const nacl = require('libsodium-wrappers');

module.exports = async (key) => {
    
    await nacl.ready;

    return Object.freeze({
        key: key,
        encrypt: (message) => {
        const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        const ciphertext = nacl.crypto_secretbox_easy(message, nonce, key)
            return {
                nonce: nonce,
                ciphertext: ciphertext
            }
        }
    });

};