function makeMembersArray() {
  return [
    {
      id: 1,
      gishname: 'fuzzyBunny',
      fullname: 'David Michele',
      phone: '555-555-5555',
    },
    {
      id: 2,
      gishname: 'fuzzyRabbit',
      fullname: 'John David',
      phone: '555-555-4444',
    },
  ]
}

function makeMaliciousMember() {
  const maliciousMember = {
    id: 911,
    gishname: 'Lucifer <script>alert("xss");</script>',
    fullname: 'Lucifer <script>alert("xss");</script>',
    phone: '555-555-4444',
  }
}

function makeReceivedMembersArray() {
  return makeMembersArray().map(member =>
    ({
      id: member.id,
      gishName: member.gishname,
      fullName: member.fullname,
      phone: member.phone
    }))
}

module.exports ={
  makeMaliciousMember,
  makeMembersArray,
  makeReceivedMembersArray
}