import sqlite3
from helper import sign_message

#connecting to sqlite3
conn = sqlite3.connect("URI.db")
cursor = conn.cursor()

#creating uritable
cursor.execute('''CREATE TABLE IF NOT EXISTS uritable (key TEXT, value TEXT)''')
conn.commit()

client_pub = """-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOvQom0ToUACEzsc3aLJnVHZqO9oZs1H
qQnTGrgWbIVCb4tKYDHSXEwa9D8Fd54JpZhCbvH3IggHKb1UcJxmGc8CAwEAAQ==
-----END PUBLIC KEY-----"""

client_priv = """-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAOvQom0ToUACEzsc3aLJnVHZqO9oZs1HqQnTGrgWbIVCb4tKYDHS
XEwa9D8Fd54JpZhCbvH3IggHKb1UcJxmGc8CAwEAAQJANGlMkH26ayWK7Kp/wDyb
UKPV3lAP+TQiJ+LZn2ysdfle1Qo5jw9HEGM/2bzoZhExa/1G7iwWA0yiKGvkvNwy
MQIhAP4/XtzvHHVw2vwjc4hEi+IvXAqblW4uUtP0rNit0KUDAiEA7XC9LI6n3+cO
DS44uJF1MhPS5wk+cYhR7HRu+yXt4EUCIQDd4J2/vygd0Vw6GBIWBIPy4xO26ioR
GnoMIQXKnn1r0wIgceOQqa2ncis2vzW7eTQz/Zgqoiz56aUUfpF+pjKUPe0CIDLC
IoW0PuOgayjKwNK7pNhxOONJ/a+RO+oUVUr8OIQw
-----END RSA PRIVATE KEY-----"""

server_pub = """-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMAF+l33tFEtYup3xkAYcPl7QftMhPZw
e2uueDKlSNjdO9iV7xfnPv/7zjAbczPSvwMW8fY0UDBLM3s0/tCrgVkCAwEAAQ==
-----END PUBLIC KEY-----"""

server_priv = """-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAMAF+l33tFEtYup3xkAYcPl7QftMhPZwe2uueDKlSNjdO9iV7xfn
Pv/7zjAbczPSvwMW8fY0UDBLM3s0/tCrgVkCAwEAAQJAJEO8wexbAI26xZ8zML2s
8GDn2CbeYZBirrZ3etEeTd4+d8r2MxvbMgTHmrKGbhESYatUcpmK00crFSj/s+V+
lQIhAOW4QfGow1NCrT56g+uEOGh25Bjp8RyWx4dlP4DIfLdnAiEA1f23NYF2+sdr
8JTDtRhASx1xvniVFC9jJnahz0IiST8CIQCwgQHSH1xs9ddNIS+JX19EDM23wtBq
qgOHKalAV0tUUwIgFRpbOfSVhi+qbmRNVIuas42ozO7ZTM9LiNyEIotUFEMCIEKU
0M4529WnxOhmaFYzlcq3CB27EReL8VFQNChRxAgT
-----END RSA PRIVATE KEY-----"""

client_sign = sign_message(client_priv, client_pub)
server_sign = sign_message(server_priv, server_pub)

client_uri = "4PXjk9qB"
server_uri = """vbiPYcd4"""

client_cert = client_pub+"\n\n"+client_sign
server_cert = server_pub+"\n\n"+server_sign
print(client_cert,"\n\n")
print(server_cert)

#data for checking. Replace with real data
sample_data = [(client_uri, client_cert), (server_uri, server_cert)]
cursor.executemany("INSERT INTO uritable VALUES (?, ?)", sample_data)
conn.commit()