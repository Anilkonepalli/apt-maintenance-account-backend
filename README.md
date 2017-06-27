# apt-maintenance-account (server-side/backend)  
A server side application is developed with a target on Apartment Maintenance Account App and with a real intension on exploring:  
1. NodeJS server  
2. Knex, query builder for MySQL  
3. BookshelfJS, object-relational mapping (ORM) tool  
4. Server side JWT, RBAC  
5. Knex migrate, seed feature (inspired from PHP Laravel framework)  
6. REST API  


## Dependencies  
Ensure that following items are already installed:  
1. MySQL database  
2. NodeJS  
3. Knex with global access  

## Demo  
For a demo of this application, please click [here](http://eastgate.in/apt-maint-acct-demo).  
(Note: For login, a guest user-id and password are pre-filled.  The guest has read-only permissions. On the login screen just click on Submit button)  

## Installations (for frontend installations refer [here](https://github.com/mohankumaranna/apt-maintenance-account))  
_Step 1:_  Clone or Download this back-end application into a folder  
_Step 2:_  `npm install`  
_Step 3:_  Make a copy of sample.env into .env file and make necessary updates, such as database, user, and its password, email hosting details.  
_Step 4:_  Make necessary updates in config/constants.json file, such as Max Records in resources.  
_Step 5:_  `knex migrate:latest`, this adds required tables in the MySQL database, check it before proceeding with next step.  
_Step 6:_  `knex seed:run`, this adds sample data into the tables  
_Step 7:_  If front end application is already installed, then go to host url, say http://www.myhost.com/my-apt.  It show the home page of this application.  Now, try to login with user id as guest@eastgate.in and password as password123.  It should show application with menu items such as 'Accounts' and 'Settings'.  

## License  
MIT  
