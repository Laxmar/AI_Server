
How to run:

1. Using Docker

    Just install docker and use `docker-compose up` command to run server

2. Without Docker

    **Backend**  
    1. NodeJS 8 or higher required  
    2. typescipt 2.8.X should be installed globally  `npm i -g typescript` 
    3. ts-node should be isntalled globally `npm i -g ts-node`
    4. `npm install` in backend folder

    Start:  `npm start`

     **Fronted**
     1. angular cli (1.7.4)  `npm i -g @angular/cli`
     2. `npm install` in frontend folder

    Start: `npm start`


Backend listens on ws://localhost:8000

Frontend runs on http://localhost:4200




**Communication**

All messages send to sever should have type. For detail information check backend/src/communication folder.
In folder backend/test can be found example massages.

1. Send ConnectMessage -> server responds ConnectResponse with playerId. 
Client should save this id, because it's used to create MoveMessage.
2. Respond for MoveRequest using MoveMessage.

In case of error server sends ErrorMessage defined in serverResponses.ts.
