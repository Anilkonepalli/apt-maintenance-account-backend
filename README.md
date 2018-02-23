# apt-maintenance-account (server-side/backend)  
A server side application is developed with a target on Apartment Maintenance Account App and with a real intension on exploring:  
1. NodeJS server,  
2. Knex, query builder for MySQL,  
3. BookshelfJS, object-relational mapping (ORM) tool,  
4. Server side JWT, RBAC, etc.,  
5. Knex migrate, seed feature (inspired from PHP Laravel framework),  
6. REST API,  
7. Base or Foundation code for future projects.  

## Dependencies  
Ensure that following items are already installed:  
1. MySQL database,  
2. NodeJS,  
3. Knex with global access,  
4. PM2.  

## Demo  
A read-only demo is [here](http://eastgate.in/apt-maint-acct-demo).  


## Installation   
_Step 1:_  Clone or Download this back-end application into a folder.  
_Step 2:_  `npm install`.  
_Step 3:_  Make a copy of sample.env into .env file and make necessary updates, such as database, user, and its password, email hosting details.  
_Step 4:_  Make necessary updates in config/constants.json file, such as Max Records in resources.  
_Step 5:_  `knex migrate:latest`, this adds required tables in the database, check it before proceeding with next step.  
_Step 6:_  `knex seed:run`, this adds sample data into the tables.  
_Step 7:_  In the hosting environment, NodeJS server cannot be accessed directly.  A proxy setup is needed.  In the apache2 conf file, following changes are to be made.  
  _a:_  Edit `/etc/apache2/sites_available/<my-domain>.conf` and include lines found inside of VirtualHost tags below:  
```
              <VirtualHost>  
                ...  
                #Proxy setup for nodejs server  
                <Location "/my-apt/api/">  
                  ProxyPass "http://localhost:3002/api"  # assuming nodejs server is running on port 3002   in  the hosting environment  
                </Location>  
              </VirtualHost>
```
  _b:_   Restart the apache2 server.  
  _c:_   The above proxy setup will redirect now on, say a login request http://www.mydomain.com/my-apt/api/login to http://locahost:3002/api/login on the nodejs server.  
_Step 8:_  `pm2 start app.server` will add app.server as a service on the hosting environment.  
_Step 9:_  If front end application is already installed, then go to host url, say http://www.mydomain.com/my-apt.  The home page of this application can be seen.  Now, try to login with user id as guest@eastgate.in and password as password123.  It should now show application with menu items such as 'Accounts' and 'Settings'.  

## Front-end / Client-side  
A front-end code, written using ReactJS-ReduxJS framework, is available.  Pleae refer  [here](https://github.com/mohankumaranna/apt-maint-react).    

Also, another front-end code, written using Angular framework is available.  Pleae refer  [here](https://github.com/mohankumaranna/apt-maintenance-account).    


## License  
MIT  
