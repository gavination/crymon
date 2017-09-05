const request = require('request')

// twilio
const sid = "AC9f04edb7a7cd2353d8e043ea71b25209"
const token = "f93a0b7981840eb759b1db58546e9801"


module.exports = function (context, myTimer) {
    context.log('fetching data...')
    request('https://api.coinmarketcap.com/v1/ticker/?limit=100', function (error, response, body) {
        
        if (error || response.statusCode != 200) {
            context.log('error:', error)
            context.log('statusCode:', response && response.statusCode)
        } else {
            context.log('success')
        }

        var tickerData = JSON.parse(body)
        var coins = []

        context.log(tickerData[0]["symbol"], tickerData[0]["percent_change_24h"])
        context.log(tickerData[1]["symbol"], tickerData[1]["percent_change_24h"])

        for (var coin in tickerData) {
            coins.push(
                [tickerData[coin]["symbol"], 
                parseFloat(tickerData[coin]["percent_change_24h"])]
            )
        }
        
        coins.sort(function(a, b) {
            a = a[1];
            b = b[1];
        
            return a < b ? -1 : (a > b ? 1 : 0);
        })
        
        context.log(coins[0],coins[1],coins[2])
        context.log(coins[coins.length-1], coins[coins.length-2], coins[coins.length-3])

        context.done()
    })
}