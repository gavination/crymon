const request = require('request');

module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if(myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   

    request('https://api.coinmarketcap.com/v1/ticker/bitcoin/', function (error, response, body) {
        context.log('error:', error);
        context.log('statusCode:', response && response.statusCode);
        context.log('body:', body);
    });

    context.done();
};

