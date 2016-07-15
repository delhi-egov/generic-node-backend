## Setup instructions

1. sudo apt-get install node
2. sudo apt-get install npm
3. npm install npm -g
4. sudo npm install -g pm2
5. sudo apt-get install node-vows
6. sudo npm install -g sequelize-cli
7. npm install
8. Create database 'dfs' in your MySQL instance
9. Update the password for 'root' user in the env.js file
10. sudo apt-get install mysql-client-5.5

## Running instructions

1. sequelize db:migrate
2. pm2 start app.js

## Tech Stack

1. Node.js based backend
2. Hapi.js as the web framework on top of Node.js
3. PM2 as the process manager to run, monitor, log
4. MySQL as the Database
5. Sequelize as the ORM and Migration framework
6. Vows.js as the testing framework
7. Travis CI for automated testing
8. Swagger for API documentation
9. Winston for logging
