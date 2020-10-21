FROM ubuntu:latest

RUN apt-get update -y
RUN apt-get install -y apt-utils curl build-essential python3.6 python3.6-dev python3-pip python3.6-venv
RUN pip3 install flask flask-socketio eventlet

WORKDIR /app
COPY index.py /app

CMD ["python3", "index.py"]