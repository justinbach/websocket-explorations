const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuidV1 = require('uuid/v1');

const state = {
    users: {},
    chats: {}
};

const createUserName = () => 'User' + Math.floor(Math.random() * 100000);

io.on('connection', (socket) => {
    const username = createUserName();
    console.log(`${username} connected with ID ${socket.id}.`);
    logState();

    state.users[socket.id] = username;
    io.emit('state', state);

    socket.on('send chat', chat => {
        if (typeof state.chats[chat.storyId] === 'undefined') {
            state.chats[chat.storyId] = [];
        }
        chat.userId = socket.id;
        chat.uuid = uuidV1();
        state.chats[chat.storyId].push(chat);
        io.emit('state', state);
        logState();
    });

    socket.on('select username', username => {
        state.users[socket.id] = username;
        io.emit('state', state);
    });

    socket.on('disconnect', () => {
    });
});

http.listen(4000, function () {
    console.log('listening on *:4000');
});

const logState = () => {
    return;
    console.dir(state);
};
