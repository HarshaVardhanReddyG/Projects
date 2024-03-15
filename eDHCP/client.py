import helper
import socket
uri = "4PXjk9qB"
private_key = """-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAOvQom0ToUACEzsc3aLJnVHZqO9oZs1HqQnTGrgWbIVCb4tKYDHS
XEwa9D8Fd54JpZhCbvH3IggHKb1UcJxmGc8CAwEAAQJANGlMkH26ayWK7Kp/wDyb
UKPV3lAP+TQiJ+LZn2ysdfle1Qo5jw9HEGM/2bzoZhExa/1G7iwWA0yiKGvkvNwy
MQIhAP4/XtzvHHVw2vwjc4hEi+IvXAqblW4uUtP0rNit0KUDAiEA7XC9LI6n3+cO
DS44uJF1MhPS5wk+cYhR7HRu+yXt4EUCIQDd4J2/vygd0Vw6GBIWBIPy4xO26ioR
GnoMIQXKnn1r0wIgceOQqa2ncis2vzW7eTQz/Zgqoiz56aUUfpF+pjKUPe0CIDLC
IoW0PuOgayjKwNK7pNhxOONJ/a+RO+oUVUr8OIQw
-----END RSA PRIVATE KEY-----"""
public_key = """-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOvQom0ToUACEzsc3aLJnVHZqO9oZs1H
qQnTGrgWbIVCb4tKYDHSXEwa9D8Fd54JpZhCbvH3IggHKb1UcJxmGc8CAwEAAQ==
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

