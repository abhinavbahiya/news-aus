NEWS-AUS
- Please use the below command to diretly test via your terminal after starting node server

  - To start server 
    - node index.js
  - To run it from your command line/ terminal
    - curl --location --request POST 'localhost:3000/refs'
  - You may use POSTMAN tool to test the same
    - HOST: localhost:3000/refs
    - TYPE: POST

Note: Don't forget to install mysql and create script for the same. Populate .env file with the help of .env_template