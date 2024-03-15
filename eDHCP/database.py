import socket
import sqlite3

conn = sqlite3.connect("URI.db")
cursor = conn.cursor()

dst_ip = "10.0.0.3"

s = socket.socket()
print("Socket successfully created")

dport = 12346

s.bind((dst_ip, dport))
print("socket binded to %s" % (dport))

s.listen(5)
print("socket is listening")

while True:
    c, addr = s.accept()
    print('Got connection from', addr)

    recvmsg = c.recv(1024).decode()
    print('Server received ' + recvmsg)

    req = recvmsg.split('\r\n')
    val = ""
    status = "200 OK"
    method = req[0].split()[0]
    item = req[0].split()[1].split('?')
    key = item[1].split('=')[1]

    cursor.execute("SELECT value FROM uritable WHERE key=?", (key,))
    result = cursor.fetchone()

    if result:
        val = result[0]
    else:
        val = "Key not found"
        status = "404 Not Found"
    res = "HTTP/1.1 " + status + "\r\n\r\n" + val
    c.send(res.encode())
    c.close()
