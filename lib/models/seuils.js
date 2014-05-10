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
     * Modifie le seuil de niveaud d'eau
     * @param int min Le seuil
     * @param function success Le callback en cas de succes
     * @param function error Le callback en cas d'erreur
     *
     * @return boolean
     */
    update: function (min, success, error) {
        // On insert la donnee
        this.connection.query("UPDATE water_level SET min = '"+ min +"'", function (err) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de modifier le niveau d\'eau'
                });
                return false;
            }

            success();
            return true;
        });
    },

    get: function(success, error)
    {
        // On insert la donnee
        this.connection.query("SELECT min FROM water_level LIMIT 1", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer le niveau d\'eau'
                });
                return false;
            }

            success(rows[0].min);
            return true;
        });
    }

};