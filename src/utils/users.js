const users = [];

const addUser = ({id, username, room}) => {
    // Clean the data
    const newUser = {
        id,
        username: username.trim().toLowerCase(),
        room: room.trim().toLowerCase()
    }
    // Validate data
    if(!newUser.username || !newUser.room) {
        return {
            error: "Username and room are required"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === newUser.room && user.username === newUser.username
    });

    // Validate username
    if(existingUser) {
        return {
            error: "Username is in use"
        }
    }

    // Store users
    users.push(newUser);
    return {user: newUser};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    });

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (roomName) => {
    const usersInRoom = users.filter(user => {
        return user.room === roomName.trim().toLowerCase();
    });
    return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}