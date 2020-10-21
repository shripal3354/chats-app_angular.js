from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
users={}
stickers=['1.png','2.png','4.png','5.png','6.png','7.png',
'8.png','9.png','10.png','11.png','12.png','13.png','14.png','15.png']

@app.route('/')
def index():
    # return render_template('index.html', users=users, stickers=stickers)
    print(users)


@socketio.on('username', namespace='/private')
def receive_username(username):
    if username == 'c3VwZXJzdGFy':
        emit('my_users',
            {'data': list(users.keys()), 'status': 'OK'})
    elif username in users.copy():
        #for k in users.copy():
        #    if users[k] == username:
        emit('my_users',
        {'data': list(users.keys()), 'status1': 'already_exists'})
    else:
        users[username] = request.sid
        print('Username added!')
        print(users)
        emit('my_users',
            {'data': list(users.keys())}, broadcast=True)


@socketio.on('private_message', namespace='/private')
def private_message(payload):
    recipient_session_id = users[payload['username']]
    print(payload)
    emit('new_private_message', {'data': payload['message'],'sender': payload['from'] , 'private': 'true'}, room=recipient_session_id)

@socketio.on('broadcast_message', namespace='/private')
def broadcast_message(payload):
    # recipient_session_id = users[payload['username']]
    print(payload)
    emit('new_private_message', {'data': payload['message'],'sender': payload['from'], 'broadcast': 'true'}, broadcast=True)

@socketio.on('private_sticker', namespace='/private')
def private_sticker(payload):
    if (payload['username'] == 'all'):
        print(payload)
        emit('new_private_sticker', {'sticker': payload['message'],'sender': payload['from'], 'broadcast': 'true'}, broadcast=True)
    else:
        recipient_session_id = users[payload['username']]
        print(payload)
        emit('new_private_sticker', {'sticker': payload['message'], 'sender': payload['from'],'private': 'true'}, room=recipient_session_id)

@socketio.on('connect', namespace='/private')
def test_connect():
    emit('new_private_message', {'data': 'server message: connected', 'count': 0})
    print('Client connected', request.sid)

@socketio.on('disconnect', namespace='/private')
def test_disconnect():
    emit('new_private_message', {'data': 'server message: disconnected', 'count': 0})
    for k in users.copy():
        if users[k] == request.sid:
            del users[k]
    emit('my_users',
            {'data': list(users.keys())}, broadcast=True)
    print('Client disconnected', request.sid)
    print(users)

@socketio.on('kick_out', namespace='/private')
def kick_out(payload):
    recipient_session_id = users[payload['username']]
    emit('new_private_message', {'data': 'You were kicked', 'count': 0},room=recipient_session_id)
    print('Client disconnected', request.sid)
    del users[payload['username']]
    emit('my_users',
            {'data': list(users.keys())}, broadcast=True)
    print(users)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='10.1.1.230')   
