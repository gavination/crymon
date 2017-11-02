const request = require("request")

// currencies to watch
tracked = ['BTC', 'ETH', 'GNT', 'REP', 'OMG']

// twilio
const sid = "AC9f04edb7a7cd2353d8e043ea71b25209"
const token = "f93a0b7981840eb759b1db58546e9801"

module.exports = function (context) {
    context.log("fetching data...")
    request("https://api.coinmarketcap.com/v1/ticker/", function (error, response, body) {

        if (error || response.statusCode != 200) {
            context.log("error:", error)
            context.log("statusCode:", response && response.statusCode)
        } else {
            context.log('success.')
        }

        var tickerData = JSON.parse(body)
        var coinData = []
        var notif = []

        context.log("parsing JSON...")
        for (var coin in tickerData) {
            var symbol = tickerData[coin]["symbol"]
            var delta = tickerData[coin]["percent_change_1h"]

            if (tracked.indexOf(symbol) > -1) {
                context.log('\t', symbol, "=>", delta)
                coinData.push(tickerData[coin])

                notif.push({symbol: symbol, delta: delta})  // DEMO                
                                                            // DEMO
                // if (Math.abs(delta) > 10) {                      // DEMO
                //     notif.push({symbol: symbol, delta: delta})   // DEMO
                // }                                                // DEMO
            }
        }
        context.log("success.")

        context.log("sending texts...")
        ping(notif)
        context.log("done.")

        // if (notif.length > 0) {                  // DEMO
        //     context.log("sending texts...")      // DEMO
        //     ping(notif)                          // DEMO
        // } else {                                 // DEMO
        //     context.log("no texts to send.")     // DEMO
        // }

        /*  CosmosDB Storage Indexing   
        context.log("indexing data...")
        context.bindings.marketStatsDocument = "this_should_fail"
        context.log("success.")
        */
        
        /*  Azure Table Storage Indexing   */
        // context.log('indexing data...')              // DEMO
        // context.bindings.marketStatsTable = []       // DEMO
        // context.bindings.marketStatsTable.push({     // DEMO
        //     PartitionKey:"MarketData1",              // DEMO
        //     RowKey: new Date().getTime(),            // DEMO
        //     Data: coinData                           // DEMO
        // })
        // context.log('success.')                      // DEMO
        
        context.log("done.")
        context.done()

    })

    function ping(notif) {
        const client = require("twilio")(sid, token)
        
        var message = "Breaking news!\n"
        for (var coin in notif) {
            message += notif[coin].symbol
            message += " "
            message += notif[coin].delta + '\n'
        }

        client.messages.create({
            to: "+19094511716",
            from: "+15624185468",
            body: message
        }, function(err, msg) {
            context.log(msg.sid)
        })    
    }
}