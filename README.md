# User Notes mgmt service

user-notes mgmt Service

We will use some attibute of data from which we can rander on demand change without deployment by directly injecting the attribute in aaplication.

In memory Caching will be done from this service.

We have role based access control for this service, so there is some pre-defined steps we should follow to achive our things working.

first of all load user_notes mongo dump in your local mongodb.
mongorestore --db user-notes <path_of_your_dump>

We have RBAC(Role based access control) for authorisation of our APIs.

1. singup/login APIs should be out from this auth boundings.
2. CURD APIs for notes are been covered with authentication and authorization layer.

every API(auth bounded) should have following attributes to be there to full fill the RBAC.

1.RBAC url mapping :- {"url": "/api/user-notes/v1/add/note", "action": "add new note v1"} in collection rbac_url_mapping

2.RBAC rule details :- {"a": "APP_USER", "can": "add new note v1"} in collection rbac_rule_details

above combination of data present in both the collections makes user to do that particular action mapped
i.e for above example user with user role "APP_USER" to "add new note"

Here is the postmen documentation for the APIs,
https://documenter.getpostman.com/view/3985211/TVt17ixf


install nodemon in global for achive contineous restarting due to changes. 
## Instructions
1. Install packages: `npm install`
2. Change out the database configuration in lib/db.js
3. Launch command: `nodemon`
