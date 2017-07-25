# Expenses

An application for tracking of user's expenses

* User is able to create an account and log in
* When logged in, user can see a list of his expenses: what money is spent for and how much, - also he is able to edit and delete them
* Each entry has a date, time, text, and cost
* Filter by text, dates from-to, time from-to


Groups:

* Native User (can CRUD their own records)
* Manager(can CRUD users, except their groups)
* Admin (can CRUD all records and users)

Users:

* admin/1Petrov1

Use admin to create other users.
To start the project you need to have docker-compose and python. You can start it via command :
```
  docker-compose up
```
Project starts on localhost:3000/
