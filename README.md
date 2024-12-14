# Peer-to-Peer Chat Messaging

This application works on any modern browser that supports web sockets, and was developed specifically for in-house use.

Overview
Node express application
front end is built with Vue Js
back end uses WS library
Database is MySQL2
Current Functionality:

Sign up 
Search user
Person to person messaging

WS - featuring the fastest and most reliable real-time engine
node.js - evented I/O for the backend
Express - fast node.js network app framework @tjholowaychuk
Vue - JavaScript framework
MySQL - SQL database

Installation
WS requires Node.js v4+ to run.

Install the dependencies and devDependencies and start the server.

For the backend
$ cd backend
$ Add .env file with the following credentials
  - JWT_SECRET=m3nPg2Gh0mw7mpotnfg31TQ6CiiLITf8
  - JWT_LIFETIME=2d
  - JWT_EXPIRES_IN=2d
  - DB_HOST = localhost
  - DB_USER = root
  - DB_PASSWORD = "yourpassword"
  - DB_NAME =chattest
  - $ npm install
  - $ npm run dev

For the UI
$ cd uix
$ npm install
$ npm run dev

Troubleshooting
Database not setting up successfully
- Comment out the database property in the dal.ts mysql.createPool method then run npm run dev. After which the database creates. Then uncomment the database property

Contact: Oscar Valdes oscar94valdes@gmail.com
