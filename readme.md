# Expenses

###An application for tracking of user's expenses

* User is able to create an account and log in
* When logged in, user can see a list of his expenses: what money is spent for and how much, - also he is able to edit and delete them
* Each entry has a date, time, text, and cost
* Filter by text, dates from-to, time from-to


####Groups:

* Native User (can CRUD their own records)
* Manager(can CRUD users, except their groups)
* Admin (can CRUD all records and users)

####Users:

* admin/1Petrov1

Use admin to create other users. 

####Installation && Launch
- Docker and docker-compose is required to be installed.
- Ports `5432, 9000` has to be available!
- Pull the image `docker build -t idobrodushniy/expenses-image:stable` or build it by yourself(build step below).
- Build the Docker image via command `docker build -t idobrodushniy/expenses-image:stable`
- Start the project via command `docker-compose up`. Project starts on 0.0.0.0:9000/
- Stop the project via command `docker-compose down`

####Migrations and db dump
Please, pay attention to file `./tasks.py`. Each time when you start docker-compose commands for cleaning db and 
uploading a dump are executed. If you don't want to clean db data during the each starting process, just delete next lines
from `./tasks.py` file:
- `ctx.run('python manage.py dbshell < clear.sql')`
- `ctx.run('python manage.py dbshell < dump.sql')`