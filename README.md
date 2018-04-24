
How to run:
1. Using docker
   Just install docker and use 'docker-compose up' command to run server

2. Locally (not recommended)
    So try: install node > 8, typescipt, ts-node, npm install, npm start
    Should works, but require validation and time to create detail instruction

Server listens on port 8000


How to communicate with server:

All messages send to sever should have type. For detail information check communication folder.
In folder test can be found example massages.

After correct massage server sends always ResponseOK defined in serverResponses.ts.
In case of error server sends ErrorMessage defined in serverResponses.ts.
