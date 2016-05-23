/**
 * Created by Aharon.Amram on 5/23/2016.
 */
var http = require('http');

var crawlerService = ()=>{
    function _getPage(url){
        http.get({
            uro: url,
            method: "GET"
        }, (response) => {
            // Do stuff with response
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                console.debug('crawlerService');
            });
        }).on('error', (e) => {
            console.debug(`crawlerService.getPage - Error: ${e.message}`);
        });
    }

    return {
        getPage: _getPage
    }
};

module.exports = crawlerService();