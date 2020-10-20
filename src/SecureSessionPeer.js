const nacl = require('libsodium-wrappers');
const Decryptor = require('./Decryptor.js')
const Encryptor = require('./Encryptor.js')

module.exports = async (peer) => {

await nacl.ready;

let otherPeer = peer;

let encryptor, decryptor, rx, tx;

let keyPair = nacl.crypto_kx_keypair()

let [pk, sk] = [keyPair.publicKey, keyPair.privateKey]

global.message;

let peerInstance = {

    publicKey: pk,

    encrypt: (message) => {
        return encryptor.encrypt(message)
    },

    decrypt: (ciphertext, nonce) => {
        return decryptor.decrypt(ciphertext, nonce)
    }, 

    send: (msg) => {
        
        message = encryptor.encrypt(msg);
        console.log(message)
    },

    receive: () => {
        console.log(message)
        return decryptor.decrypt(message.ciphertext, message.nonce)
        
    },

    generateSharedKeys: async (otherPeer) => {
        let clientKeyPair = nacl.crypto_kx_client_session_keys(pk, sk, otherPeer.publicKey)
        rx = clientKeyPair.sharedRx
        tx = clientKeyPair.sharedTx
        decryptor = await Decryptor(rx)
        encryptor = await Encryptor(tx)
    }
}

Object.freeze(peerInstance)

if(otherPeer !== undefined){
    let serverKeyPair = nacl.crypto_kx_server_session_keys(pk, sk, otherPeer.publicKey)
    rx = serverKeyPair.sharedRx;
    tx = serverKeyPair.sharedTx;

    otherPeer.generateSharedKeys(peerInstance);
    decryptor = await Decryptor(rx)
    encryptor = await Encryptor(tx)
}


return peerInstance;

}