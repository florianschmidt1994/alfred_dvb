#! /usr/local/bin/node

var dvb = require('dvbjs')
var moment = require('moment')
moment.locale('de')

var args = process.argv.slice(2)

var timeOffset
args[1] ? timeOffset = args[1] : timeOffset = 0

var numResults = 6
dvb.monitor(args[0], timeOffset, numResults)
    .then(function(data) {
        var items = {'items': []}

        if (data.length === 0) {
            items.items.push({
                'title': 'No such stop found 🤔'
            })
            console.log(JSON.stringify(items))
            return
        }

        data.forEach(function(con) {
            items.items.push({
                'title': con.line + ' ' + con.direction + ' in ' + con.arrivalTimeRelative + ' minutes',
                'subtitle': moment(con.arrivalTime).format('dddd, HH:mm [Uhr]'),
                'icon': {
                    'path': 'transport_icons/' + con.mode.name + '.png'
                }
            })
        })

        console.log(JSON.stringify(items))
    })
    .catch(function (err) {
        var items = {'items': [{
            'title': 'Ran into an error 😭',
            'subtitle': err,
        }]}
        console.log(items)
        throw err
    })
