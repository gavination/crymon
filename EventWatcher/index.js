const request = require('request')

// currencies to watch
tracked = ['BTC', 'ETH', 'GNT', 'REP']

// twilio
const sid = "AC9f04edb7a7cd2353d8e043ea71b25209"
const token = "f93a0b7981840eb759b1db58546e9801"

module.exports = function (context) {

    request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
        
        context.log('fetching data...')
        if (error || response.statusCode != 200) {
            context.log('error:', error)
            context.log('statusCode:', response && response.statusCode)
        } else {
            context.log('success.')
        }
        
        var tickerData = JSON.parse(body)
        var coinData = []
        var notif = []

        context.log('parsing JSON...')
        for (var coin in tickerData) {
            var symbol = tickerData[coin]["symbol"]
            var delta = tickerData[coin]["percent_change_1h"]

            if (tracked.indexOf(symbol) > -1) {
                context.log('\t', symbol, "=>", delta)
                coinData.push(tickerData[coin])

                if (Math.abs(delta) > 2) {
                    notif.push({symbol: symbol, delta: delta})
                }
            }
        }
        context.log('success.')

        if (notif.length > 0) {
            context.log("sending texts...")
            ping(notif)
        } else {
            context.log("no texts to send.")
        }
        
        context.log('indexing data...')
        context.bindings.marketStatsTable = []
        context.bindings.marketStatsTable.push({
            PartitionKey:"MarketData1",
            RowKey: new Date().getTime(),
            Data: coinData
        })
        context.log('success.')

        context.log('done.')
        context.done()

    })

    function ping(notif) {
        const client = require('twilio')(sid, token)
        
        var message = "Breaking news!\n"
        for (var coin in notif) {
            message += notif[coin].symbol
            message += " "
            message += notif[coin].delta + "\n"
        }

        client.messages.create({
            to: "+19094511716",
            from: "+15624185468",
            body: message
        }, function(err, msg) {
            context.log(msg.sid)
        })
        context.log("done.")
    }
}