const request = require('request')
const cors = require('cors')
const app = require('express')()
const acoes = require('./acoes')

const port = process.env.PORT || 3000

const corsOptions = {
  origin: '*'
}

app.get('/:stock', cors(corsOptions), (req, res) => {
  if (!acoes.includes(req.params.stock)) {
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
