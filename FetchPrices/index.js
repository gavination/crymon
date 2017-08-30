const request = require('request')
tracked = ['BTC', 'ETH', 'GNT', 'REP']

module.exports = function (context) {

    request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
        
        if (error || response.statusCode != 200) {
            context.log('error:', error)
            context.log('statusCOde:', response && response.statusCode)
        }
        
        var tickerData = JSON.parse(body)
        var coinData = []

        for (var coin in tickerData) {
            if (tracked.indexOf(tickerData[coin]["symbol"]) > -1) {
                context.log(tickerData[coin]["symbol"], "=>", tickerData[coin]["percent_change_1h"])
                coinData.push(tickerData[coin])
            }
        }

        var coinInfo = {
            "timestamp": new Date().toISOString(),
            "data": coinData
        }

        context.bindings.marketStatsTable = []
        context.bindings.marketStatsTable.push({
            PartitionKey:"MarketData1",
            RowKey: new Date().toISOString(),
            Data: coinData
        })

        context.log(coinInfo)
        context.done()
    
    })

}