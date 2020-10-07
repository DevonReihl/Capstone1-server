const MembersService = {
  getAllMembers(knex) {
    return knex.select('*').from('team_members')
  },
  insertMembers(knex, newMember) {
    return knex
    .insert(newMember)
    .into('team_members')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },
  getById(knex, id) {
    return knex
    .from('team_members')
    .select('*')
    .where('id', id)
    .first()
  },
}

module.exports = MembersService