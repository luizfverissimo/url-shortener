const express = require('express')
const shortid = require('shortid')
const db = require('./database/connections')
const moment = require('moment')

const routes = express.Router()

routes.post('/shortener', async (req, res) => {
  const { url_origin, date } = req.body

  const trx = await db.transaction()

  const urlShortCode = shortid.generate(url_origin)
  const url_short = `http://localhost:3333/${urlShortCode}`

  const expire_date = moment(date, 'YYYY-MM-DD')
    .add(1, 'days')
    .format('YYYY-MM-DD')

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

  const trx = await db.transaction()

  const urlMount = `http://localhost:3333/${url_short}`

  try {
    const urlInfosArray = await trx('urls')
      .select('*')
      .where('url_short', '=', urlMount)

    if (urlInfosArray.length === 0) {
      await trx.commit()

      return res.status(404).json({ error: 'Link não foi encurtado.' })
    }

    const { url_origin, url_short, expire_date } = urlInfosArray[0]

    const now = moment().format('YYYY-MM-DD')
    const dataDiference = moment(expire_date).diff(now, 'days')

    //está dentro da validade
    if (dataDiference >= 0) {
      await trx.commit()
      return res.redirect(`${url_origin}`)
    }

    //está fora da validade
    if (dataDiference < 0) {
      await trx('urls').where('url_short', '=', url_short).del()

      await trx.commit()

      return res.status(404).json({ error: 'Link não é mais válido.' })
    }
  } catch (err) {
    return res.status(400).json(err)
  }
})

module.exports = routes
