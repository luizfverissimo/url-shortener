const express = require('express')
const path = require('path')
const shortid = require('shortid')
const db = require('./database/connections')
const moment = require('moment')

const routes = express.Router()

routes.post('/shortener', async (req, res) => {
  const { url_origin, date } = req.body

  const trx = await db.transaction()

  shortid.characters(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
  ) //o shortId precisa de 64 caracteres únicos, por isso adicionei $ e @

  const urlShortCode = shortid.generate(url_origin)
  const url_short = `http://localhost:3333/${urlShortCode}`

  //adiciona um dia para a data de validade
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

      return res
        .status(404)
        .sendFile(path.resolve(__dirname, 'pages', '404-error.html'))
    }

    const { url_origin, url_short, expire_date } = urlInfosArray[0]

    //pega a data de hoje
    const now = moment().format('YYYY-MM-DD')
    //compara com a data de validade, se for maior que 0, ainda está na validade, se for menor que 0, não está mais na validade
    const dataDiference = moment(expire_date).diff(now, 'days')

    //está dentro da validade
    if (dataDiference >= 0) {
      await trx.commit()
      return res.redirect(`${url_origin}`)
    }

    //está fora da validade
    if (dataDiference < 0) {
      //deleta do banco de dados se não estiver mais na validade
      await trx('urls').where('url_short', '=', url_short).del()

      await trx.commit()

      return res
        .status(404)
        .sendFile(path.resolve(__dirname, 'pages', '404-error.html'))
    }
  } catch (err) {
    return res.status(400).json(err)
  }
})

module.exports = routes
