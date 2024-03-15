import helper
import socket
uri = "QYtencKW"
private_key = """-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBANYdAkxfUqab6i257E7JRhz6SF5g+mmDmHKC5ocJEPx2S87bQh9b
Loo6jyp4T6/HbRD0o9fnDfZXvNL3JFhIO5sCAwEAAQJBAI/AKircVMFHLJJGoUDE
IS6TWsMCmRz+HPvEpsFCdQUJrLv92y3LGXYsV3AzvwfO0mQgbWDtXoeC2zsCTjuh
CQECIQDq7c6QY+DGbCgRWBlcmqjM61vziUyfHWxMnw2QF1SdvwIhAOlRQW9iQrI1
3qdcRDymcnDuv98H4n0P1dNDkOcd3FElAiB1hvZ5wZ2nZmA9HQfDDhQ4P95GXX+Z
ckzFoCRW23UXXQIgWwrG8tSv2+RjZoD9a4EzpNe07S2hdlWIhXCXCWhAgTUCIFpi
O0N/XDzzq2pgPenT9CwMCbwVLrJxavjr3D2sX8Cw
-----END RSA PRIVATE KEY-----"""
public_key = """-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANYdAkxfUqab6i257E7JRhz6SF5g+mmD
mHKC5ocJEPx2S87bQh9bLoo6jyp4T6/HbRD0o9fnDfZXvNL3JFhIO5sCAwEAAQ==
-----END PUBLIC KEY-----"""

global ip_assign


def DHCP_format(msg_type,ip_addr,ur):
    return (msg_type+'\n'+ip_addr+'\n'+ur+'\n')



def DHCP_Discover():
    server_address = ('10.255.255.255', 67)
    client_broadcast = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_broadcast.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    # certificate_uri
    # signature
    
    message = DHCP_format("DHCP DISCOVER","",uri)
    signature = helper.sign_message(private_key,message)
    message = (message+signature).encode()
    client_broadcast.sendto(message, server_address)


def DHCP_Request(request_ip):
    server_address = ('10.255.255.255', 67)
    client_broadcast = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_broadcast.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    # certificate_uri
    # signature
    message = DHCP_format("DHCP REQUEST",request_ip,uri)
    signature = helper.sign_message(private_key,message)
    message = (message+signature).encode()
    client_broadcast.sendto(message, server_address)

def parse_response(message,server_address):
    arr = str(message).split('\n')
    s_uri = arr[2]
    signature = arr[3]
    s_pub_key = ""
    # fetch certificate from database
    s_pub_key = helper.get_pub(s_uri)
    if(s_pub_key==""): 
        print("The server cannot be authenticated, ignoring responses.....")
        return ""
    if not helper.verify_signature(s_pub_key,arr[0]+'\n'+arr[1]+'\n'+arr[2]+'\n',arr[3]+'\n'):
        print(f'The server {server_address} failed to authenticate, discarding it\'s response')
        return
    global ip_assign
    # authenticate uri and signature and store result in cond (true or false)
    if(arr[0] == 'DHCP OFFER'):
        ip = arr[1]
        # server_signature = get_server_sign()
        
        if (ip !='0.0.0.0'):
           print('Recieved OFFER, Requesting for IP : ',ip)
           return DHCP_Request(ip)
        else:
            print('No available IP addresses currently. Exiting....')
            exit(1)

    elif(arr[0] == 'DHCP ACK'):
        ip = arr[1]
        ip_assign=ip
        if(ip):
            print('Request for the IP successful :)\n IP assigned : ',ip)
            print('Thank You DHCP, Plug and Play!')
            exit(1)
        else:
            print('Request for the IP unsuccessful :(  ')
            exit(1)
    else:
        return None



ip_assign =""
DHCP_Discover()
listen_address = ('', 67)
listen_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
listen_socket.bind(listen_address)

while not ip_assign:
    print("DHCP DISCOVER sent, now listening for OFFER..")
    data, server_address = listen_socket.recvfrom(1024)
    print(f"Received message from {server_address}: {data.decode()}")
    parse_response(data.decode(),server_address)
    data, server_address = listen_socket.recvfrom(1024)
    print(f"Received message from {server_address}: {data.decode()}")
    parse_response(data.decode(),server_address)

