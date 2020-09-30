const express = require('express')
const shortid = require('shortid')
const db = require('./database/connections')
const moment = require('moment')

const routes = express.Router()

routes.post('/shortener', async (req, res) => {
  const { url_origin, date } = req.body

  const urlShortCode = shortid.generate(url_origin)
  const url_short = `http://localhost:3333/${urlShortCode}`

  const expire_date = moment(date, 'YYYY-MM-DD')
    .add(1, 'days')
    .format('YYYY-MM-DD')

  const trx = await db.transaction()
  try {
    await trx('urls').insert({
      url_origin,
      expire_date,
      url_short
    })

    await trx.commit()

    return res.status(200).json(url_short)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err })
  }
})

routes.get('/:url_short', async (req, res) => {
  const { url_short } = await req.params

  const urlShortCode = url_short.split('/', 3)
  console.log(urlShortCode)

  return res.send(200)
})

module.exports = routes
