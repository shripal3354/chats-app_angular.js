# Chat

Flask 1.0. Angular 7.0 Socket.IO Docker

# Information about design decisions you made.
For client-server chat application was used Angular for client-side and Flask framework (Python) for server side. For real-time bidirectional communication was used Socket.IO which is based on events.


# Application features.
• Private and broadcast messages in the text form or as a sticker.
• Already used nickname usage prevention.
• Server messages – connected, kicked out, disconnect, nickname already in use.
• Automatically updated list of all connected users.
• Admin privileges for specific user. Possibility to kick out users from the chat.

# How to launch our system.

The application is ready to use in docker. In order to launch it, you should get the source code of both client and server side. Then simply build an images and run them in the containers.

	

	docker build -t angular-client .
	docker build -t server-python .

	docker run -i -t -p 4200:4200 angular-client
	docker run -i -t -p 5000:5000 server-python

