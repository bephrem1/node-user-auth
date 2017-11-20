# node-user-auth
**Node User Authentication and Authorization Example using MongoDB** </br>

**Dates Course Taken:** 11/19/17 - 11/20/17 </br>
**Instructor/Code:** Dave McFarland </br>

**Skills Learned** </br>
- Managing user sessions on log in and log out</br>
- Mongoose for fetching documents</br>
- Migrating session data to be stored in Mongo and not server RAM</br>
- Dynamic templating</br>
- Defining and injecting custom middleware into routes for access control</br>
- Hashing and salting passwords</br>

**Comments:**</br>
I find user authentication to be easier to understand with node since you handle the request and response variables directly while in Spring it is a little different where annotations are used for access control in Spring Expression Language (SpEL) and you implement the UserDetails interface in a class that manages auth. I like they way Node handles things better since it is so explicit versus Spring where more things are abstracted away and it's harder to see the flow of things.
