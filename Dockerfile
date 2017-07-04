FROM python:3
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /Expenses-backend
 WORKDIR /Expenses-backend
 ADD requirements.txt /Expenses-backend/
 ADD groups.json /Expenses-backend/
 RUN pip install -r requirements.txt
 ADD . /Expenses-backend/