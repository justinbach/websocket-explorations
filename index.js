const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const state = {};

const createUserName = () => 'User' + Math.floor(Math.random() * 100000);

io.on('connection', (socket) => {
    const username = createUserName();
    console.log(`${username} connected.`);
    logState();

    socket.emit('assign username', username);
    io.emit('state', state);

    socket.on('send chat', chat => {
        if (typeof state[chat.storyId] === 'undefined') {
            state[chat.storyId] = [];
        }
        state[chat.storyId].push(chat);
        io.emit('state', state);
        logState();
    });

    socket.on('disconnect', () => {
    });
});

http.listen(4000, function () {
    console.log('listening on *:4000');
});

const logState = () => {
    console.dir(state);
};
