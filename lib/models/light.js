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
    update: function (datas, success, error) {
        var hour_start = this.safe(datas.hour_start);
        var hour_end = this.safe(datas.hour_end);

        // On insert la donnee
        this.connection.query("UPDATE lights SET hour_on = '"+ hour_start +"', hour_off = '"+ hour_end +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de modifier les heures d\'éclairage'
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

    get: function(success, error)
    {
        // On insert la donnee
        this.connection.query("SELECT * FROM lights LIMIT 1", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer les heures d\'éclairage'
                });
                return false;
            }

            success(rows[0]);
            return true;
        });
    },

    safe: function (value)
    {
        return value.replace(/'/g, "\\'");
    }

};