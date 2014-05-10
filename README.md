# Aquino API server

## Auteur de la partie

* [Romain QUILLIOT](http://twitter.com/Romainjeff)


## Pré-requis

* NodeJS 0.10.*


## Installation

1. ``` git clone git@github.com:Aquino-project/web-application.git ```
2. ``` cd path/to/the/api/server ```
3. Executez ``` npm install ``` pour installer les dépendances
4. Créez une nouvelle base de données et importez le fichier ``` Structure.sql ```
5. Renommez ``` config.dist.js ``` en ``` config.js ```
6. Configurez la connexion MySQL dans ``` config.js ```
7. Configurez la connexion SMTP dans ``` config.js ```
8. Executez ``` node app ```
9. Le mot de passe par defaut de l'application est ``` test ```
10. Enjoy !

## License

The MIT License (MIT)

Copyright (c) 2014 Aquino Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.