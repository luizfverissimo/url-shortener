const knex = require('knex')

exports.up = async function(knex) {
  return knex.schema.createTable('urls', table => {
    table.increments('id').primary()
    table.string('url_origin').notNullable()
    table.string('url_short').notNullable()
    table.string('expire_date').notNullable()
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('urls')
}