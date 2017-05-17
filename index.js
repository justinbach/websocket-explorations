const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const state = {
    users: {},
};

io.on('connection', (socket) => {
    const user = {};
    state.users[socket.id] = user;

    socket.on('user login', (username) => {
        user.name = username;
        console.log(`${username} connected.`);
        listUsers();
    });

    socket.on('disconnect', () => {
        console.log(`${state.users[socket.id].name} disconnected.`);
        delete state.users[socket.id];
        listUsers();
    });
});

http.listen(4000, function () {
    console.log('listening on *:4000');
});

const listUsers = () => {
    console.log('Current active users:');
    Object.keys(state.users).forEach(id => console.log(`    ${state.users[id].name}`))
    console.log('--------');
};
