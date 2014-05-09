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
var connection = mysql.createConnection(
    require('./config.js')
);


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
            application.initHeaders(res);

            application.output('Don de la nourriture en cours...');

            application.sendSuccess(res, "Nourriture correctement donnée");
        });

        /**
         *
         * Ajout d'une heure pour la nourriture
         *
         */
        app.post('/feed', function (req, res)
        {
            application.initHeaders(res);

            application.output('Ajout d\'une heure de nourrissage en cours...');

            // On recupere l'heure et la minute postee
            var minute = req.body.minute;
            var hour = req.body.hour;

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            // On ajoute l'heure a la base de donnees
            feedModel.add({
                hour: hour,
                minute: minute
            },
                // Si tout ce passe bien
                function () {
                    application.successOutput('OK');

                    // On retourne le resultat a l'utilisateur
                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'Heure correctement enregistrés'
                        })
                    );

                    application.output('Envoie de l\'heure à Aquino');

                    application.sendSuccess(res, "Heures de nourrissage correctement ajoutée");

                    return false;
                },

                // Si il y a un probleme
                function (infos) {
                    application.errorOutput('ERREUR -- '+ infos.message);
                    
                    // On retourne l'erreur
                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: infos.message
                        })
                    );
                }
            );
        });

        
        /**
         *
         * Recuperes les heures deja existantes
         *
         */
        app.get('/feed/hours', function (req, res)
        {
            application.initHeaders(res);

            application.output('Recuperation des heures de nourrissage en cours...');

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            feedModel.getAll(
                // Si tout ce passe bien
                function (heures) {
                    application.successOutput('OK');

                    // On retourne le resultat a l'utilisateur
                    res.send(
                        jsonFormat.format({
                            error: false,
                            heures: heures
                        })
                    );
                },

                // Si une erreur survient
                function (infos) {
                    application.errorOutput('ERREUR -- '+ infos.message);
                    
                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: infos.message
                        })
                    );
                }
            );
        });


        /**
         *
         * Suppression d'une heure pour la nourriture
         *
         */
        app.delete('/feed/delete', function (req, res)
        {
            application.initHeaders(res);

            application.output('Suppression d\'une heure de nourrissage en cours...');

            // On recupere l'heure et la minute a supprimer
            var minute = req.query.minute;
            var hour = req.query.hour;

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            feedModel.delete({
                hour: hour,
                minute: minute
            },
                // Si tout ce passe bien
                function () {
                    application.successOutput('OK');

                    // On retourne le resultat a l'utilisateur
                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'Heure correctement supprimée'
                        })
                    );

                    application.output('Suppression de l\'heure sur Aquino');

                    application.sendSuccess(res, "Heures de nourrissage correctement supprimée");

                    return false;
                },

                // Si une erreur survient
                function (infos) {
                    application.errorOutput('ERREUR -- '+ infos.message);
                    
                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: infos.message
                        })
                    );
                }
            );
        });

        /*********************/
        /**    END FEED     **/
        /*********************/



        /*********************/
        /**      LIGHT      **/
        /*********************/
        /*********************/
        /**   POUR MORGAN   **/
        /*********************/

        /**
         *
         * Reglage de la luminosite des leds
         *
         */
        app.put('/light', function (req, res)
        {
            application.initHeaders(res);

            application.output('Envoie des heures d\'éclairage en cours...');

            var bas = req.body.bas;
            var haut = req.body.haut;

            application.sendSuccess(res, "Heures d'éclairage correctement modifiées");

        });

        /*********************/
        /**    END LIGHT    **/
        /*********************/



        /*********************/
        /**      ALERTS     **/
        /*********************/
        /*********************/
        /**   POUR NICOLAS  **/
        /*********************/

        /**
         *
         * Reglage de la luminosite des leds
         *
         */
        app.post('/alerts', function (req, res)
        {
            application.initHeaders(res);
            
            application.output('Reception de l\'alerte en cours...');

            var titre = req.body.titre;
            var message = req.body.message;
            var alertsModel = require('./lib/models/alerts.js').init(connection);

            // On ajoute l'alerte a la base de donnees
            alertsModel.add({
                title: titre,
                message: message
            },
                // En cas de succes
                function () {
                    application.successOutput('OK');

                    // On retourne le resultat a l'utilisateur
                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'Heure correctement enregistrés'
                        })
                    );
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR -- '+ infos.message);
                    
                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: infos.message
                        })
                    );
                }
            );
        });

        /*********************/
        /**    END ALERTS   **/
        /*********************/



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
    },

    /**
     *
     * Retourne un succes
     *
     */
    sendSuccess: function (res, message)
    {
        this.successOutput("OK");

        res.send(
            jsonFormat.format({
                error: false,
                message: message
            })
        );
    },

    /**
     *
     * Retourne une erreur
     *
     */
    sendError: function (res, message)
    {
        this.errorOutput("ERREUR");

        res.send(
            jsonFormat.format({
                error: true,
                message: message
            })
        );
    }

};