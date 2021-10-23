const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}   

const generateLocationMessage = (lat, long) => {
    return {
        url: `https://google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime()
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}