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
var sha1            = require('sha1');
var mysql           = require('mysql');
var colors          = require('colors');
var querystring     = require('querystring');
var nodemailer      = require("nodemailer");
var jsonFormat      = require('./lib/controllers/json.js');
var globalConfigs   = require('./config.js');


/**
 *
 * VARIABLES APPLICATION
 *
 */
var app  = express();
var date = new Date();
var initHeaders = function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
    res.header("Content-type", "application/json");

    next();
}


/**
 *
 * LIBRAIRIES EXPRESS
 *
 */
app.use(bodyParser());
app.use(methodOverride());
app.use(initHeaders);


/**
 *
 * CONFIGURARION MYSQL
 * CONFIGURATION EMAIL
 *
 */
var connection = mysql.createConnection(
    globalConfigs.mysql
);

var smtpTransport = nodemailer.createTransport(
    'SMTP',
    globalConfigs.mail
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

        /**
         *
         * Ajout d'une heure pour la nourriture
         *
         */
        app.post('/feed', function (req, res)
        {
            application.output('Ajout d\'une heure de nourrissage en cours...');

            // On recupere l'heure et la minute postee
            var hour = req.body.hour;

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            // On ajoute l'heure a la base de donnees
            feedModel.add({
                hour: hour
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

                    // On prepare la requete
                    var request = Curl.request({
                        method: 'POST',
                        url: aquariumIP +"/feed/add",
                        data: {
                            heure: hour
                        },
                        timeout: 30
                    });

                    // On envoie l'heure a l'aquarium
                    request(function (error, data) {                        
                        if (!error) {
                            application.successOutput('OK');
                            return true;
                        }

                        application.errorOutput('ERREUR');
                        return false;
                    });

                    return false;
                },

                // Si il y a un probleme
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Recuperes la prochaine heure de nourrissage
         *
         */
        app.get('/feed/hour/next', function (req, res)
        {
            application.output('Recuperation de la prochaine heure de nourrissage en cours...');

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            feedModel.getNext(date.getHours(),
                // Si tout ce passe bien
                function (heure) {
                    application.successOutput('OK');

                    // On retourne le resultat a l'utilisateur
                    res.send(
                        jsonFormat.format({
                            error: false,
                            heure: heure
                        })
                    );
                },

                // Si une erreur survient
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
        app.delete('/feed/:hour', function (req, res)
        {
            application.output('Suppression d\'une heure de nourrissage en cours...');

            // On recupere l'heure et la minute a supprimer
            var hour = req.params.hour;

            // On inclue le model de base de donnees Feed
            var feedModel = require('./lib/models/feed.js').init(connection);
            
            feedModel.delete({
                hour: hour
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

                    // On prepare la requete
                    var request = Curl.request({
                        method: 'POST',
                        url: aquariumIP +"/feed/delete",
                        data: {
                            heure: hour
                        },
                        timeout: 30
                    });

                    // On envoie les infos a l'aquarium
                    request(function (error, response) {
                        if (!error) {
                            application.successOutput('OK');
                            return true;
                        }

                        application.errorOutput('ERREUR -- impossible de joindre le serveur');
                        return false;
                    });

                    return false;
                },

                // Si une erreur survient
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Reglage des heures d'éclairage
         *
         */
        app.put('/light', function (req, res)
        {
            application.output('Envoie des heures en cours...');

            var hour_end = req.body.hour_end;
            var hour_start = req.body.hour_start;

            var lightModel = require('./lib/models/light.js').init(connection);

            lightModel.update({
                hour_start: hour_start,
                hour_end: hour_end
            },
                // En cas de succes
                function () {
                    // On prepare la requete
                    var request = Curl.request({
                        method: 'POST',
                        url: aquariumIP +"/light",
                        data: {
                            "haut": hour_start,
                            "bas": hour_end
                        },
                        timeout: 30
                    });

                    request(function (error) {
                        if (!error) {
                            application.successOutput('OK');

                            // On affiche le resultat
                            res.send(
                                jsonFormat.format({
                                    error: false,
                                    message: 'Les heures ont bien été modifiées'
                                })
                            );
                        } else {
                            application.errorOutput('ERREUR');

                            // On affiche le resultat
                            res.send(
                                jsonFormat.format({
                                    error: true,
                                    message: 'Les heures n\'ont pas pu être modifiées'
                                })
                            );
                        }
                    });
                },
                // En cas d'erreur
                function (infos)
                {
                    application.errorOutput('ERREUR - '+ infos.message);

                    // On affiche le resultat
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
         * Recuperation des heures d'eclairages
         *
         */
        app.get('/light', function (req, res)
        {
            application.output('Envoie des heures en cours...');

            var lightModel = require('./lib/models/light.js').init(connection);

            lightModel.get(
                // En cas de succes
                function (rows) {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            hours: rows
                        })
                    );
                },

                // En cas d'echec
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);

                    // On affiche le resultat
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
         * Quand l'aquarium envoie des alertes
         *
         */
        app.post('/alerts', function (req, res)
        {
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
                            message: 'Alerte correctement ajoutée'
                        })
                    );

                    application.output("Recuperation de l'email...");

                    configs.getEmail(
                        function (email)
                        {
                            application.successOutput("OK");

                            // On configure les options mail
                            var mailOpts = {
                                to      : email,
                                subject : "[ERREUR Aquino] "+ titre,
                                text    : message
                            };

                            application.output("Envoie de l'email d'alerte...");

                            // On envoie le mail a l'utilisateur
                            smtpTransport.sendMail(mailOpts, function (error)
                            {
                                if (error) {
                                    application.errorOutput("ERREUR");
                                    return false;
                                }

                                application.successOutput("OK");
                                return true;
                            });
                        },

                        function () 
                        {
                            application.errorOutput("ERREUR");
                        }
                    );
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Recupere le nombre d'alertes
         *
         */
        app.get('/alerts/count', this.autorizationCheck, function(req, res)
        {
            application.output("Recuperation du nombre d'alertes...");
            var alertsModel = require('./lib/models/alerts.js').init(connection);

            alertsModel.getCount(
                // En cas de succes
                function (count) {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            count: count
                        })
                    );
                },

                // En cas d'echec
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);

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
         * Recupere les alertes
         *
         */
        app.get('/alerts', this.autorizationCheck, function(req, res)
        {
            application.output("Recuperation des alertes...");
            var alertsModel = require('./lib/models/alerts.js').init(connection);

            alertsModel.getAll(
                // En cas de succes
                function (alerts) {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            alerts: alerts
                        })
                    );
                },

                // En cas d'echec
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);

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
         * Supprime une alerte
         *
         */
        app.delete('/alerts/:id', this.autorizationCheck, function(req, res)
        {
            application.output("Recuperation des alertes...");
            var alertsModel = require('./lib/models/alerts.js').init(connection);

            var id = req.params.id;

            alertsModel.delete(id,
                // En cas de succes
                function () {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: "L'alerte a bien été supprimée"
                        })
                    );
                },

                // En cas d'echec
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);

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
         * Reglage du seuil d'eau
         *
         */
        app.post('/seuils', this.autorizationCheck, function (req, res)
        {
            application.output('Envoie du seuil en cours...');

            var seuil = req.body.seuil;
            var seuilsModel = require('./lib/models/seuils.js').init(connection);

            // On ajoute l'alerte a la base de donnees
            seuilsModel.update(seuil,
                
                // En cas de succes
                function () {
                    application.successOutput('OK');

                    // On prepare la requete
                    var request = Curl.request({
                        method: 'POST',
                        url: aquariumIP +"/seuils",
                        data: {
                            "seuil": seuil
                        },
                        timeout: 30
                    });

                    request(function (error) {
                        if (!error) {
                            application.successOutput('OK');

                            // On affiche le resultat
                            res.send(
                                jsonFormat.format({
                                    error: false,
                                    message: 'Le seuil de niveau d\'eau a bien été modifié'
                                })
                            );
                        } else {
                            application.errorOutput('ERREUR');

                            // On affiche le resultat
                            res.send(
                                jsonFormat.format({
                                    error: true,
                                    message: 'Le seuil de niveau d\'eau n\'a pas pu être modifiée'
                                })
                            );
                        }
                    });
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Reglage du mail
         *
         */
        app.put('/email', function (req, res)
        {
            application.output('Envoie de l\'email en cours...');

            var email = req.body.email;

            // On ajoute l'alerte a la base de donnees
            configs.updateEmail(email,

                // En cas de succes
                function () {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'Le mail a bien été modifié'
                        })
                    );
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Recuperation du seuil d'eau
         *
         */
        app.get('/seuils', function (req, res)
        {
            application.output('Envoie du seuil en cours...');

            var seuilsModel = require('./lib/models/seuils.js').init(connection);

            // On ajoute l'alerte a la base de donnees
            seuilsModel.get(
                // En cas de succes
                function (seuil) {
                    application.successOutput('OK');

                    // On affiche le resultat
                    res.send(
                        jsonFormat.format({
                            error: false,
                            seuil: seuil
                        })
                    );
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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
         * Recuperation du mail
         *
         */
        app.get('/email', function (req, res)
        {
            application.output('Recuperation de l\'email en cours...');

            // On ajoute l'alerte a la base de donnees
            configs.getEmail(
                // En cas de succes
                function (email) {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            email: email
                        })
                    );
                },
                
                // En cas d'erreur
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);
                    
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



        /*********************/
        /**   APPLI CONFIG  **/
        /*********************/

        /**
         *
         * Modification du mot de passe
         *
         */
        app.put('/password', function(req, res)
        {
            application.output("Modification du mot de passe...");

            var password = req.body.password;
            password = sha1(password);

            configs.updatePassword(password,
                // En cas de succes
                function () {
                    application.successOutput('OK');

                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: 'Mot de passe correment modifié'
                        })
                    );
                },

                // En cas d'echec
                function (infos) {
                    application.errorOutput('ERREUR - '+ infos.message);

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
         * Recuperation de l'IP de la camera
         *
         */
        app.get('/camera/address', function(req, res)
        {
            application.output("Envoie de l'ip de la camera...");
            application.successOutput("OK");

            res.send(
                jsonFormat.format({
                    error: false,
                    ip: cameraIP
                })
            );
        });

        /*********************/
        /**    END APPLI    **/
        /*********************/



        /*********************/
        /**    APPLI LOGIN  **/
        /*********************/

        app.post('/token/verify', function (req, res)
        {
            application.output("Verification du token...");

            var token = req.body.token;

            configs.isEqualToken(token,
                // Le token est valide
                function () {
                    application.successOutput("OK");

                    res.send(
                        jsonFormat.format({
                            error: false,
                            message: "Le token est valide"
                        })
                    );

                },
                // Le token est invalide
                function () {
                    application.errorOutput("ERREUR");

                    res.send(
                        jsonFormat.format({
                            error: true,
                            message: "Le token est invalide"
                        })
                    );

                }
            );
            
        });

        app.post('/token/request', function (req, res)
        {
            application.output("Verification du mot de passe...");

            var password = sha1(req.body.password);

            // On verifie le mot de passe
            configs.isEqualPassword(password,
                // Le mot de passe est valide
                function () {
                    application.successOutput("OK");

                    application.output("Generation du token...");

                    var rand = Math.floor(Math.random() * 10 + 1);
                    var token = sha1((date.getSeconds() * date.getMinutes() * rand));

                    // On modifie le token
                    configs.setToken(token,
                        // En cas de succes
                        function (token) {
                            application.successOutput("OK");

                            res.send(
                                jsonFormat.format({
                                    error: false,
                                    token: token
                                })
                            );
                        },
                        // En cas d'erreur
                        function (infos) {
                            application.errorOutput("ERREUR - "+ infos.message);

                            res.send(
                                jsonFormat.format({
                                    error: true,
                                    message: infos.message
                                })
                            );
                        }
                    );
                },
                // Le mot de passe est invalide
                function (infos) {
                    application.errorOutput("ERREUR - "+ infos.message);

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
        /**    END LOGIN    **/
        /*********************/




        // On lance le serveur
        app.listen(1337);
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
     * Verifie que le client courant est autorisee a effectuer la requete
     * @param Request req La requete
     * @param Response res La reponse
     * @param string next La suite du programme
     *
     */
    autorizationCheck: function (req, res, next)
    {
        application.output("Verification de l'autorisation client...");

        var token = req.query.token;

        if (!token) {
            application.errorOutput("NON AUTORISE");
            res.send(
                jsonFormat.format({
                    error: true,
                    message: "Vous n'êtes pas autorisé"
                })
            );
            return false;
        }

        var configs  = require('./lib/models/configs.js').init(connection);

        configs.isEqualToken(token,
            // Le token est valide
            function () {
                application.successOutput("AUTORISE");
                next();

                return true;
            },
            // Le token est invalide
            function () {
                application.errorOutput("NON AUTORISE");
                res.send(
                    jsonFormat.format({
                        error: true,
                        message: "Vous n'êtes pas autorisé"
                    })
                );
                return false;
            }
        );
    }

};