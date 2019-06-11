const request = require('request')
const cors = require('cors')
const app = require('express')()

const port = process.env.PORT || 3000

const whitelist = [
  'http://localhost:3000',
  'https://supercarteira.com',
  'https://api.supercarteira.com',
  'https://lucasfontesgaspareto.github.io',
  'https://supercarteira.herokuapp.com/admin'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/:stock', cors(corsOptions), (req, res) => {
  if (req.params.stock.length > 10) {
    return res.status(500)
  }
  
  const stock = req.params.stock.toUpperCase()
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}.SA?includePrePost=false&interval=1d&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`

  request.post(url, (err, reqPost, body) => {
    if (err) {
      return res.status(500).send(err.message || err)
    }

    const chart = JSON.parse(body).chart
    const result = chart && chart.result
    const error = chart && chart.error

    if (error) {
      return res.status(404).send(error)
    }

    if (result && result.length) {
      return res.status(200).send({
        meta: result[0].meta,
        quote: result[0].quote
      })
    }

    res.status(200)
  })
})

app.listen(port)
