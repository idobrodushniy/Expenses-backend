To start the project you must have python3 and  postgres on your computer:

1.Install important packages via command :
```
pip3 install requirements.txt
```
2.Create database and user in postgres, which is described in database.txt file\

3.Make migrations :
```
python manage.py makemigrations
```
4.Migration:
```
python manage.py migrate 
```
5.To initialize database IMPORTANT data:
```
python manage.py loaddata groups.json
```
6.Create superuser:
```
python manage.py createsuperuser
```
7.Start the project via command:
```
python manage.py runserver
```
