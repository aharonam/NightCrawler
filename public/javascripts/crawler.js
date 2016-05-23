/**
 * Created by Aharon.Amram on 5/23/2016.
 */
var crawler = crawler || (function crawler(){
    var hostname = 'http://' + window.location.host,
        crawlingUrl = hostname + "/crawler/start";

    function _startCrawling(){
        $.get(crawlingUrl, function(data, status){
            console.debug('data: ' + data);
            console.debug('status: ' + status);
        })
    }

    return{
        startCrawling: _startCrawling
    }
})();