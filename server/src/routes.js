const express = require('express')
const shortid = require('shortid')
const db = require('./database/connections')
const moment = require('moment')

const routes = express.Router()

const trx = await db.transaction()

routes.post('/shortener', async (req, res) => {
  const { url_origin, date } = req.body

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

  const urlMount = `http://localhost:3333/${url_short}`

  try {
    const [urlObj] = await db('urls')
      .select('*')
      .where('url_short', '=', urlMount)

      console.log(urlObj)
    if(!urlObj) {
      return res.status(404).json({ error: 'Link não existe' })
    }

    const now = moment().format('YYYY-MM-DD')
    const dayDifference = moment(urlObj.expire_date).diff(now, 'days')

    if(dayDifference > 0) {
      return res.redirect(301, `${urlObj.url_origin}`)
    } else {
      try {
        await trx('urls').where('url_short', '=', urlMount).del()

        trx.commit()

        res.status(404).json({ error: 'Link não é mais válido' })
      } catch (err) {
        console.log(err)
        res.status(400).json({ error: 'Erro no banco de dados' })
      }
    }
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

module.exports = routes
