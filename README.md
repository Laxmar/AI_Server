
How to run:
1. Using docker

    Just install docker and use 'docker-compose up' command to run server

2. Locally (not recommended)

    So try: install node > 8, typescipt, ts-node, npm install, npm start
    Should works, but require validation and time to create detail instruction


How to communicate with server:

All messages send to sever should have type. For detail information check communication folder.
In folder test can be found example massages.

1. Send ConnectMessage -> server responds ConnectResponse with playerId. 
Client should save this id, because it's used to create MoveMessage.
2. Respond for MoveRequest using MoveMessage.

In case of error server sends ErrorMessage defined in serverResponses.ts.
