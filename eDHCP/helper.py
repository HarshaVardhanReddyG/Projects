import socket
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

def sign_message(private_key_pem: str, message: str) -> str:
    # Deserialize private key from PEM string
   try:
        private_key = serialization.load_pem_private_key(
            private_key_pem.encode(),
            password=None  # No password for encryption
        )

        # Sign the message with the private key
        signature = private_key.sign(
            message.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        
        # Return the signature as a string
        return signature.hex()
   except Exception as e:
        print("Signing Failed:", e)
        return False  # Signature is invalid

def verify_signature(public_key_pem: str, message: str, signature: str) -> bool:
    # Deserialize public key from PEM string
    public_key = serialization.load_pem_public_key(public_key_pem.encode())

    # Verify the signature with the public key
    try:
        public_key.verify(
            bytes.fromhex(signature),
            message.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True  # Signature is valid
    except Exception as e:
        print("Signature verification failed:", e)
        return False  # Signature is invalid


def get_pub (s_uri):
    serverIP = "10.0.0.3"
    dst_ip = serverIP
    s = socket.socket()
    # print(dst_ip)
    port = 12346
    s.connect((dst_ip, port))
    print("connected to ",dst_ip)
    #enter URI here
    key = s_uri
    req = "GET /database?request="+key+" HTTP/1.1\r\n\r\n"
    s.send(req.encode())
    arr = s.recv(1024).decode().split('\r\n')
    res = arr[0]
    val = arr[2]
    if res.startswith("HTTP/1.1"):
        status = res.split(' ')[1]
        #checking status
        if status == "200":
        #getting public_key, signature
            cert = val
            public_key, signature = cert.split('\n\n')
            # print("Public Key:", public_key)
            # print("Signature:", signature)
        else:
            print("Error: Database Server couldn't find the certificate",)
            return ""
    else:
        print("Error: Invalid server response\nExiting....")
        exit(1)
    s.close()

    if verify_signature(public_key,public_key,signature):
        return public_key
    else :
        print("Invalid certificate")
        exit(1)