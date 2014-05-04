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
     * Ajoute une heure
     * @param object datas Donnees a ajouter
     * @param function success Callback succes
     * @param function error Callback erreur
     *
     * @return boolean
     */
    add: function (datas, success, error)
    {
        var current = this;

        // On verifie si l'heure existe deja
        this.exists(
            datas,

            // Si l'heure existe pas
            function () {
                // On insert la donnee
                current.connection.query("INSERT hours_feed SET hour = "+ datas.hour +", minute = "+ datas.minute, function (err) {
                    // Si une erreur survient
                    if (err) {
                        error({
                            message: 'Impossible d\'ajouter l\'heure'
                        });
                        return false;
                    }

                    success();
                    return true;
                });
            },

            // Si l'heure existe
            function () {
                error({
                    message: 'L\'heure existe déjà'
                });
                return false;
            }
        );
    },

    /**
     *
     * Supprimer une heure
     * @param object datas Donnees a ajouter
     * @param function success Callback succes
     * @param function error Callback erreur
     *
     * @return boolean
     */
    delete: function (datas, success, error)
    {
        var current = this;

        // On verifie si l'heure existe deja
        this.exists(
            datas,

            // Si l'heure existe pas
            function () {
                error({
                    message: 'L\'heure n\'existe pas'
                });
                return false;
            },

            // Si l'heure existe
            function () {
                // On insert la donnee
                current.connection.query("DELETE FROM hours_feed WHERE hour = "+ datas.hour +" AND minute = "+ datas.minute, function (err) {
                    // Si une erreur survient
                    if (err) {
                        error({
                            message: 'Impossible de supprimer l\'heure'
                        });
                        return false;
                    }

                    success();
                    return true;
                });
            }
        );
    },

    /**
     *
     * Recupere toutes les heures
     * @param function success Callback de succes
     * @param function error Callback d'erreur
     *
     * @return boolean
     */
    getAll: function (success)
    {
        // On insert la donnee
        this.connection.query("SELECT * FROM hours_feed ORDER BY hour ASC, minute ASC", function (err, rows) {
            // Si une erreur survient
            if (err) {
                error({
                    message: 'Impossible de recuperer les heures'
                });
                return false;
            }

            success(rows);
            return true;
        });
    },

    /**
     *
     * Verifie l'existance d'une heure
     * @param object datas Donnees a ajouter
     * @param function callbackNot Callback si l'heure n'existe pas
     * @param function callbackIs Callback si l'heure existe
     *
     * @return boolean
     */
    exists: function (datas, callbackNot, callbackIs)
    {
        this.connection.query("SELECT COUNT(*) as number FROM hours_feed WHERE hour = "+ datas.hour +" AND minute = "+ datas.minute, function (err, rows) {
            
            // Si il existe deja
            if (rows[0].number > 0) {
                callbackIs();
                return true;
            }

            callbackNot();
            return false;
        });
    }
};