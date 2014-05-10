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

    updateEmail: function (email, success, error)
    {
        this.connection.query("UPDATE configs SET email = '"+ email +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de modifier le mail'
                });
                return false;
            }

            success();
            return true;
        });
    },

    getEmail: function(success, error)
    {
        this.connection.query("SELECT email FROM configs LIMIT 1", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer le mail'
                });
                return false;
            }

            success(rows[0].email);
            return true;
        })
    },

    updatePassword: function (password, success, error)
    {
        this.connection.query("UPDATE configs SET password = '"+ password +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de modifier le mot de passe'
                });
                return false;
            }

            success();
            return true;
        });
    },
};