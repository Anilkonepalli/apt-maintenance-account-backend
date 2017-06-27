# apt-maintenance-account (server side / backend - REST API)
Apartment Maintenance Account is a web application:  
1. To track the amount collected and expended towards maintenance of flats in the apartment complex  
2. To ensure any time access to transaction details  
3. To enable transparency  
4. To simplify data entries  

## Tools/Frameworks used:  
NodeJS framework  		- for server side coding (a.k.a. Back End Coding),  
MySQL	database  		  - for data storage,  
KnexJS tool     	    - for query building,  
BookshelfJS tool	    - for Object Relation Mapping (shortly ORM)  
Json Web Token        - for Authentication - Log into Application with JWT token  

## Dependencies
Ensure that following items are already installed:  
1. MySQL database  
2. NodeJS
3. Knex with global access

## Demo
For a demo of this application, please visit [demo](http://eastgate.in/apt-maint-acct-demo).  
(A guest user id and password are preset; just click on Submit button; it has read-only permissions)  

## Installations (for frontend refer [here](https://github.com/mohankumaranna/apt-maintenance-account))
_Step 1:_  Clone or Download this back-end application into a folder
_Step 2:_  `npm install`  
_Step 3:_  Make a copy of sample.env into .env file and make necessary updates, such as database, user, and its password, email hosting details.  
_Step 4:_  Make necessary updates in config/constants.json file, such as Max Records in resources.
_Step 5:_  `knex migrate:latest`, this adds required tables in the MySQL database, check it before proceeding with next step.
_Step 6:_  `knex seed:run`, this adds sample data into the tables
_Step 7:_  If front end application is already installed, then go to host url, say http://www.myhost.com/my-apt.  It show the home page of this application.  Now, try to login with user id as guest@eastgate.in and password as password123.  It should show application with menu items such as 'Accounts' and 'Settings'.

## License
MIT
