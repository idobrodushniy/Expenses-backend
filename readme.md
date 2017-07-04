To start the project you must have python3 and  docker-compose on your computer:

1. Move to the project directory and migrate all the project migrations with the help of commands -
```
docker-compose run web python manage.py makemigrations
```
```
docker-compose run web python manage.py migrate
```
2. Than you have to initialize your database an important data:
```
docker-compose run web python manage.py loaddata groups.json
```
3. Please, create a superuser for administration:
```
docker-compose run web python manage.py createsuperuser
```
4. Run the project via the command :
```
docker-compose up
```