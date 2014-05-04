module.exports = {
    
    /**
     *
     * Formate un objet en JSON
     * @param object object L'objet a formatter
     * @return string L'objet formate en JSON
     *
     */
    format: function (object)
    {
        return JSON.stringify(object);
    }

};