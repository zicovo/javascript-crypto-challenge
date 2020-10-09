const nacl = require('libsodium-wrappers');

module.exports = async (peer) => {

await nacl.ready;


class SecureSession {


constructor(peer){

    let keyPair = nacl.crypto_kx_keypair()
    let [pk, sk] = [keyPair.publicKey, keyPair.privateKey]
    this.publicKey = pk
    this.secretKey = sk
    if(peer){
        this.type = "SERVER";
        let sharedKeys = nacl.crypto_kx_server_session_keys(this.publicKey, this.secretKey, peer.publicKey)
        
        let [rx, tx] = [sharedKeys.sharedRx, sharedKeys.sharedTx];

        this.serverRx = rx;
        this.serverTx = tx;

      }
    
    else{
        this.type = "CLIENT";
    }
}


encrypt(msg){

    let Nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);

    let Ciphertext = nacl.crypto_box_easy(msg, Nonce, this.publicKey, this.secretKey);

    return {
        nonce: Nonce,
        ciphertext: Ciphertext
    }

        
}

decrypt(peerCiphertext, peerNonce){

    return nacl.crypto_box_open_easy(peerCiphertext, peerNonce, peer.publicKey, peer.secretKey);
 
}

send(peerMsg){

      if(this.type == "CLIENT"){

        let nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);

        //create shared keypair for the client

        let sharedKeys = nacl.crypto_kx_client_session_keys(this.publicKey, this.secretKey, server.publicKey)
        
        let [rx, tx] = [sharedKeys.sharedRx, sharedKeys.sharedTx];

        let ciphertext = nacl.crypto_secretbox_easy(peerMsg, nonce, tx);

        global.clientMessage = {
            nonce: nonce,
            ciphertext: ciphertext, 
            rx: rx,
            tx: tx
        }


      }

      else {
        let nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);

        let ciphertext = nacl.crypto_secretbox_easy(peerMsg, nonce, this.serverTx);

        global.serverMessage = {
            nonce: nonce,
            ciphertext: ciphertext, 
        }
      }

}

receive(){


    if(this.type == "CLIENT"){
        return nacl.crypto_secretbox_open_easy(serverMessage.ciphertext, serverMessage.nonce, clientMessage.rx)
    }
    else{
        return nacl.crypto_secretbox_open_easy(clientMessage.ciphertext, clientMessage.nonce, this.serverRx)
    }


}


}


if(!peer){

    global.client = new SecureSession();
    return Object.freeze(client);
}
    
else{
 
    global.server = new SecureSession(peer);
    return Object.freeze(server);
}

}