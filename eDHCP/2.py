from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
import random
import string

def sign_message(private_key_pem: str, message: str) -> str:
    # Deserialize private key from PEM string
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

# Example usage:
# Assuming you have private_key_pem and public_key_pem as PEM strings
def generate_keys() -> (str, str):
    # Generate private and public keys
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=512
    )
    public_key = private_key.public_key()

    # Serialize keys to PEM format
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Return private and public keys as strings
    return private_pem.decode(), public_pem.decode()

def main():
    # Generate private and public keys
    private_key_pem, public_key_pem = generate_keys()
    print('public key:\n',public_key_pem)
    print('private key:\n',private_key_pem)
    # Example message
    message = "This is a secret message."

    # Sign the message and get the signature as a string
    signature = sign_message(private_key_pem, message)
    print("Signature:", signature)

    # Verify the signature
    verification_result = verify_signature(public_key_pem, message, signature)
    print("Signature Verification Result:", verification_result)

if __name__ == "__main__":
    main()
    length = 8
# Generate a random string
    random_string = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length))
    print('URI:',random_string)