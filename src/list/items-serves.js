const ItemsService = {
  getAllItems(knex) {
    return knex.select('*').from('hunt_items')
  },
  insertItem(knex,newItem) {
    return knex
    .insert(newItem)
    .into('hunt_items')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },
  getById(knex, id) {
    return knex
    .from('hunt_items')
    .select('*')
    .where('id', id)
    .first()
  },
  deleteItem(knex, id) {
    return knex('hunt_items').where({ id }).delete()
  },
  updateItem(knex, id, newItemsFields) {
    return knex('hunt_items').where({ id }).update(newItemsFields)
  }
}

module.exports = ItemsService