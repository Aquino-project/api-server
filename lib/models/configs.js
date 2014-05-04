module.exports = {
    connection: null,

    init: function (connection)
    {
        this.connection = connection;

        return this;
    },

    get: function (callback)
    {
        this.connection.query("SELECT * FROM configs", callback);
    }
};