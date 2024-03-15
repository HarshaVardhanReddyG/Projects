import socket

serverIP = "10.0.0.3"

dst_ip = serverIP
s = socket.socket()

print(dst_ip)

port = 12346

s.connect((dst_ip, port))
print("connected to ",dst_ip)

#enter URI here
uri = "4PXjk9qB"
key = uri
req = "GET /database?request="+key+" HTTP/1.1\r\n\r\n"
s.send(req.encode())
res = s.recv(1024).decode()

if res.startswith("HTTP/1.1"):
    _, status, val = res.split(' ', 2)

    #checking status
    if status == "200":
        #getting public_key, signature
        cert = val.split('\n',1)[1]
        public_key, signature = cert.split('\n\n')
        print("Public Key:", public_key)
        print("Signature:", signature)
    else:
        print("Error: Server returned status", status)
else:
    print("Error: Invalid server response")


s.close()