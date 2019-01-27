FROM python:3.6
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install --assume-yes postgresql postgresql-contrib
ADD . /opt/project/
WORKDIR /opt/project/

RUN pip install -r requirements.txt --no-cache