/**
 *
 * DEPENDANCES
 *
 */
var express         = require('express');
var bodyParser      = require('body-parser');
var methodOverride  = require('express-method-override');
var http            = require('http');
var Curl            = require('curlrequest');
var md5             = require('md5');
var mysql           = require('mysql');
var colors          = require('colors');
var querystring     = require('querystring');
var jsonFormat      = require('./lib/controllers/json.js');


/**
 *
 * VARIABLES APPLICATION
 *
 */
var app  = express();
var date = new Date();


/**
 *
 * LIBRAIRIES EXPRESS
 *
 */
app.use(bodyParser());
app.use(methodOverride());


/**
 *
 * CONFIGURARION MYSQL
 *
 */
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'aquino'
});


/**
 *
 * CONNEXION MYSQL
 *
 */
connection.connect(function (err) {
    // Si on ne peut pas ce connecter
    if (err) {
        console.log("Impossible de ce connecter a la base de données");
        return false;
    }

    // On lance l'application
    application.start();
    return true;
});


/**
 *
 * APPLICATION EXPRESS
 *
 */
var application = {

    /**
     *
     * Demarre l'application
     *
     */
    start: function ()
    {
        // On inclue les configurations
        var configs  = require('./lib/models/configs.js').init(connection);
        var aquariumIP = null;
        var cameraIP = null;
        var port = 8080;

        // On recupere les configs
        configs.get(function(err, rows) {
            aquariumIP = "http://"+ rows[0].camera +":"+ port;
            cameraIP = "http://"+ rows[0].camera;

            console.log("Serveur pret a recevoir des connexions".inverse.green);
            console.log("IP Aquino: %s".inverse.grey, aquariumIP);
            console.log("");
        });



        /*********************/
        /**      FEED       **/
        /*********************/
        /**   POUR ALOIS    **/
        /*********************/

        /**
         *
         * Don de la nourriture maintenant
         *
         */
        app.get('/feed/now', function (req, res)
        {
            application.output('Don de la nourriture en cours...');

            // On prepare la requete
            var request = Curl.request({
                url: aquariumIP +"/feed/now",
                timeout: 30
            });

            // On envoie la requete a l'aquarium
            request(function (error, response) {
                if (!error) {
                    application.successOutput('OK');

                    // On affiche le resultat
                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'La nourriture a correctement été donnée'
                        })
                    );
                } else {
                    application.errorOutput('ERREUR');

                    // On affiche le resultat
                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: 'La nourriture n\'a pas été donnée'
                        })
                    );
                }
            });
        });

        



        // On lance le serveur
        app.listen(1337);
    },

    /**
     *
     * Autorise les requetes AJAX
     * @param object res L'objet Response de Express
     *
     */
    initHeaders: function (res)
    {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Content-type", "application/json");
    },

    /**
     *
     * Recupere l'heure de facon formatee
     *
     */
    formatedDate: function ()
    {
        return date.getHours() +":"+ date.getMinutes();
    },

    /**
     *
     * Affiche un message dans la console de facon formatee
     * @param string message Le message a afficher
     *
     */
    output: function (message)
    {
        var date = this.formatedDate();

        console.log("[%s]".bold +" %s", date, message);
    },

    /**
     *
     * Affiche un message dans la console en erreur
     * @param string message Le message a afficher
     *
     */
    errorOutput: function (message)
    {
        console.log(" %s !".inverse.red, message);
        console.log('');
    },

    /**
     *
     * Affiche un message dans la console en succes
     * @param string message Le message a afficher
     *
     */
    successOutput: function (message)
    {
        console.log(" %s !".inverse.green, message);
        console.log('');
    }

};