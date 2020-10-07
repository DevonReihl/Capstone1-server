const ItemService = {
  getAllItems(knex) {
    return knex.select('*').from('hunt_items')
  },
}

module.exports = ItemService