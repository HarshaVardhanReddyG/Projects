import socket
import helper

uri="""vbiPYcd4"""
private_key="""-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAMAF+l33tFEtYup3xkAYcPl7QftMhPZwe2uueDKlSNjdO9iV7xfn
Pv/7zjAbczPSvwMW8fY0UDBLM3s0/tCrgVkCAwEAAQJAJEO8wexbAI26xZ8zML2s
8GDn2CbeYZBirrZ3etEeTd4+d8r2MxvbMgTHmrKGbhESYatUcpmK00crFSj/s+V+
lQIhAOW4QfGow1NCrT56g+uEOGh25Bjp8RyWx4dlP4DIfLdnAiEA1f23NYF2+sdr
8JTDtRhASx1xvniVFC9jJnahz0IiST8CIQCwgQHSH1xs9ddNIS+JX19EDM23wtBq
qgOHKalAV0tUUwIgFRpbOfSVhi+qbmRNVIuas42ozO7ZTM9LiNyEIotUFEMCIEKU
0M4529WnxOhmaFYzlcq3CB27EReL8VFQNChRxAgT
-----END RSA PRIVATE KEY-----"""
public_key="""-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMAF+l33tFEtYup3xkAYcPl7QftMhPZw
e2uueDKlSNjdO9iV7xfnPv/7zjAbczPSvwMW8fY0UDBLM3s0/tCrgVkCAwEAAQ==
-----END PUBLIC KEY-----"""

# Set the server address and port
server_address = ('', 67)

# Create a UDP socket
server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Set socket option to allow broadcast
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

server_socket.bind(server_address)

IP_addresses = {"10.0.0.6" : True,"10.0.0.15":True}



def DHCP_format(msg_type,ip_addr,ur):
    return (msg_type+'\n'+ip_addr+'\n'+ur+'\n')

def available_ip():
    for i in IP_addresses:
        if(IP_addresses[i]): return i
    return "0.0.0.0"

def parse_response(message):    
    print(f"Received message from {client_address}\n: {data.decode()}\n END OF THE MESSAGE")
    arr = str(message).split('\n')
    c_uri = arr[2]
    signature = arr[3]
    c_pub_key=""
    #fetch certificate

    c_pub_key = helper.get_pub(c_uri)
    if(c_pub_key==""):
        print("The client cannot be authenticated, ignoring requests.....") 
        return ""
    #authenticating client
    if not helper.verify_signature(c_pub_key,arr[0]+'\n'+arr[1]+'\n'+arr[2]+'\n',arr[3]+'\n'):
        print(f'The client {server_address} failed to authenticate, discarding it\'s request')
        return 
    # authenticate uri and signature and store result in cond (true or false)
    if(arr[0] == 'DHCP DISCOVER'):
        ip = available_ip()
        # server_signature = get_server_sign()
        message = DHCP_format("DHCP OFFER",ip,uri)
        signature = helper.sign_message(private_key,message)
        message = message+signature
        return message.encode()
    elif(arr[0] == 'DHCP REQUEST'):
        ip = arr[1]
        temp = IP_addresses[ip]
        if(temp):
            IP_addresses[ip]=False
            message =  DHCP_format("DHCP ACK",ip,uri)
            signature = helper.sign_message(private_key,message)
            message = message+signature
            return message.encode()
        else:
            message =  DHCP_format("DHCP ACK","",uri)
            signature = helper.sign_message(private_key,message)
            message = message+signature
            return message.encode()
    else:
        return ""

def send_response(message):
    if(message is None): return

    server_address = ('10.255.255.255', 67)
    server_broadcast = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_broadcast.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    server_broadcast.sendto(message, server_address)

try:
    # Receive messages from clients
    while True:
        data, client_address = server_socket.recvfrom(1024)
        if(client_address[0]== '10.0.0.2'): continue
        res = parse_response(data.decode())
        if(res==""): continue
        send_response(res)
        


finally:
    # Close the socket
    server_socket.close()
