const req = require('request')
const app = require('express')()

const port = process.env.PORT || 3000

app.get('/:stock', (req, res) => {
  if (req.params.stock.length > 10) {
    return res.status(500)
  }
  
  const stock = req.params.stock.toUpperCase()
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}.SA?includePrePost=false&interval=1d&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance`
  
  req.post(url, (err, req, body) => {
    if (err) {
      return res.status(500).send(err.message || err)
    }

    const chart = JSON.parse(body)
    const result = chart && chart.result && chart.result.length && chart.result[0] || false

    if (result) {
      return res.status(200).send({
        meta: result.meta,
        quote: result.quote
      })
    }

    res.status(200)
  })
})

app.listen(port)
