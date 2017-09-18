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
        var message = ""

        var btc = tickerData[0]["symbol"] + " " + tickerData[0]["percent_change_24h"]
        var eth = tickerData[1]["symbol"] + " " + tickerData[1]["percent_change_24h"]

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
        
        topUp = coins.slice(0,3)
        topDown = coins.slice(coins.length - 3).reverse()

        context.log(getMessage(btc, eth, topUp, topDown))
        context.done()
    })
}

function getMessage(btc, eth, topUp, topDown) {
    return "Good morning!\n"
        + btc + "\n"
        + eth + "\n"
        + "\n"
        + "Biggest Gains:\n"
        + topUp[0][0] + " " + topUp[0][1] + "\n"
        + topUp[1][0] + " " + topUp[1][1] + "\n"
        + topUp[2][0] + " " + topUp[2][1] + "\n"
        + "\n"
        + "Biggest Losses:\n"
        + topDown[0][0] + " " + topDown[0][1] + "\n"
        + topDown[1][0] + " " + topDown[1][1] + "\n"
        + topDown[2][0] + " " + topDown[2][1] + "\n"
}