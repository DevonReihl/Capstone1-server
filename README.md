# Gish Literacy Bandits API server

https://vast-tor-87302.herokuapp.com/

This is a full API server for my GISH team. It is Restful designed

API Overview
/api
.
├── /members           
│   └── GET
│   └── GET /:id
│   └── POST
│       └── /
|   └── PATCH /:id
|   └── DELETE /:id
│   ![member view](https://i.imgur.com/R0f6NNt.png) 


├── /items
│   └── GET
│   └── GET /:id
│   └── POST
│       └── /
|   └── PATCH /:id
|   └── DELETE /:id
│   ![hunt view](https://i.imgur.com/q0rfGY6.png)    

Technology
  Back End
    Node and Express
    RESTful Api
Testing
  Supertest (integration)
  Mocha and Chai (unit)
Database
  Postgres
  Knex.js - SQL wrapper
Production
  Deployed via Heroku (link above)


It serves the client at:
https://vercel.com/devonreihl/gish-client/n7e4qfxev. 

please see the repo for the client for more information about what the app does. 
https://github.com/DevonReihl/Capstone1-client

