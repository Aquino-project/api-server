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
    },

    updateNumber: function (number, success, error)
    {
        this.connection.query("UPDATE configs SET phone = '"+ number +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de modifier le numero de telephone'
                });
                return false;
            }

            success();
            return true;
        });
    }
};