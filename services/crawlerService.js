/**
 * Created by Aharon.Amram on 5/23/2016.
 */
'use strict'

let http = require('http');
let jsdom = require("jsdom");
let q = require('q');

class adRecord{
    constructor(adDataString){
        this.adDataString = adDataString;
        this.catID = null;
        this.subCatID = null;
        this.file = null;
        this.recordID = null;
        this.adID = null;
    }

    constructAd() {
        //show_ad('2','1','/Nadlan/salesDetails.php','NadlanID','2e319f748a9cbe0686080e419909d841ec9','644');
        //CatID =2 , SubCatID = 1, File = Nadlan/salesDetails.php , RecordID = NadlanID, AdID = 2e319f748a9cbe0686080e419909d841ec9, height = 644, prefix
        this.adDataString = this.adDataString.replace(/'/g, '').replace('"',"");
        let start = this.adDataString.indexOf('(') + 1;
        let end = this.adDataString.indexOf(')') - 1;
        this.adDataString = this.adDataString.substring(start, end);
        let dataParts = this.adDataString.split(',');
        this.catID = parseInt(dataParts[0]);
        this.subCatID = parseInt(dataParts[1]);
        this.file = dataParts[2];
        this.recordID = dataParts[3];
        this.adID = dataParts[4];
    }


}

let crawlerService = ()=>{
    let baseUrl = '';
    let adsCollection = [];

    function _getPage(url){
        let deferred = q.defer();

        http.get({
            uro: url,
            method: "GET"
        }, (response) => {
            // Do stuff with response
            let str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                deferred.resolve(str);
            });
        }).on('error', (e) => {
            deferred.reject(`crawlerService.getPage - Error: ${e.message}`);
        });

        return deferred.promise;
    }

    function _constructAdData() {
        adsCollection.forEach(function (adValue) {
            adValue.constructAd();
        });
    }

    function _parseMainPage(url, pageNumber) {
        let deferred = q.defer();
        jsdom.env({
            url: url + '?Page=' + pageNumber,
            scripts: ["http://code.jquery.com/jquery.js"],
            done: function (err, window) {
                if(err){
                    deferred.reject('error: ' + err);
                }
                let $;
                try{
                    $ = window.$;
                }catch (err){
                    deferred.reject('error: ' + err);
                }
                let rows = $('tr[id^="tr_Ad"]');
                if (rows.length > 0) {
                    rows.find('td[onclick^="show_ad"]').each(function (index) {
                        adsCollection.push(new adRecord(this.outerHTML));
                    });
                }
                deferred.resolve('records collected: ' + rows.length);
            }
        });
        return deferred.promise;
    }

    function _parseAdsPage(){
        adsCollection.forEach(function (adValue) {
            jsdom.env({
                url: baseUrl + adValue.recordID,
                scripts: ["http://code.jquery.com/jquery.js"],
                done: function (err, window) {
                    //TO DO: parse  ad page
                }
            });
        });
    }

    function _start(url){
        baseUrl = url;
        let requests = [];

        for(var i=1;i<100;i++){
            requests.push(_parseMainPage(url, i));
        }

        q.all(requests).then(function (values) {
            _constructAdData();
            _parseAdsPage();
        })
    }

    return {
        start: _start
    }
};

module.exports = crawlerService();