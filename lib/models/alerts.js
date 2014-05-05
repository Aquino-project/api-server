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
        // On insert la donnee
        this.connection.query("INSERT notifications SET title = '"+ datas.title +"', message = '"+ datas.message +"'", function (err) {
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

    getAll: function()
    {

    }

};