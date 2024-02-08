
class user {
    index(data) {
        console.log(data)
        return {
            name: "Mehrdad"
        }
    }

    sayHi() {
        console.log('helllllo');
        return 'this is sayHi function message'
    }
}

module.exports = user;