const nacl = require('libsodium-wrappers');

module.exports = async (key) => {
    
    await nacl.ready;

    //checken of een decryption key is meegegeven
    if(!key){
        throw 'no key'
    }

    return Object.freeze({
        Key: key,
        decrypt: (ciphertext, nonce) => {
            
           return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key);
        }
    });

};