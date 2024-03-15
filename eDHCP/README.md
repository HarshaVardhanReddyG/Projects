# CN-Project
Steps to run the project
1) Run create_db.py
2) Run sudo simple.py
3) In the mininet CLI run the following
   xterm h1
   xterm h2
   xterm h3
   xterm h4
4) Run the client.py in h1's terminal
5) Run the server.py in h2's terminal
6) Run the database.py in h3's terminal
  client.py = normal client
  client2.py = rogue client
  server.py = normal server
  server2.py = rogue server
  database.py = certificate database
  2.py = generates key pair
  helper.py = has helper routines used in client and server codes