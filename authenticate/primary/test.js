module.exports = {

    authenticate : function (id) {

    },

    callback : function (req, res) {
        return req.query.user
    },

    getAvatar : function (id) {
        return 'https://quexten.com/avatar_1920.png'
    }

}