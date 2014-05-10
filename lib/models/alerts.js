module.exports = {
    connection: null,

    /**
     *
     * Initialise le model
     * @param object connection Instance de la connexion a la base de donnees
     *
     * @return boolean
     */
    init: function (connection)
    {
        this.connection = connection;

        return this;
    },

    /**
     *
     * Ajoute une alerte
     * @param object datas Les donnees a ajouter
     * @param function success Le callback en cas de succes
     * @param function error Le callback en cas d'erreur
     *
     * @return boolean
     */
    add: function (datas, success, error) {
        var title = this.safe(datas.title);
        var message = this.safe(datas.message);

        // On insert la donnee
        this.connection.query("INSERT notifications SET title = '"+ title +"', message = '"+ message +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible d\'ajouter l\'alerte'
                });
                return false;
            }

            success();
            return true;
        });
    },

    remove: function (id)
    {

    },

    getAll: function(success, error)
    {
        // On recupert le nombre d'alertes
        this.connection.query("SELECT * FROM notifications", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer les alertes'
                });
                return false;
            }

            success(rows[0]);
            return true;
        });
    },

    getCount: function(success, error)
    {
        // On recupert le nombre d'alertes
        this.connection.query("SELECT COUNT(id) as count FROM notifications", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer le nombre d\'alerte'
                });
                return false;
            }

            success(rows[0].count);
            return true;
        });
    },

    safe: function (value)
    {
        return value.replace(/'/g, "\\'");
    }

};