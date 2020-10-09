module.exports = async () => {

    const nacl = require('libsodium-wrappers')

    await nacl.ready;
    
    return Object.freeze({

        verify: (hashedpw, pw) => {
            return nacl.crypto_pwhash_str_verify(hashedpw, pw);
        }

    });

};