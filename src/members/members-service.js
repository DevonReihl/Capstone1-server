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
  deleteMember(knex, id) {
    return knex('team_members').where({ id }).delete()
  },
  updateMember(knex, id, newMembersFields) {
    return knex('team_members').where({ id }).update(newMembersFields)
  }
}

module.exports = MembersService