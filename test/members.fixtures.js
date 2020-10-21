function makeMembersArray() {
  return [
    {
      id: 1,
      gish_name: 'fuzzyBunny',
      full_name: 'David Michele',
      phone: '555-555-5555',
    },
    {
      id: 2,
      gish_name: 'fuzzyRabbit',
      full_name: 'John David',
      phone: '555-555-4444',
    },
  ]
}

function makeMaliciousMember() {
  const maliciousMember = {
    id: 911,
    gish_name: 'Lucifer <script>alert("xss");</script>',
    full_name: 'Lucifer <script>alert("xss");</script>',
    phone: '555-555-4444',
  }
}

function makeReceivedMembersArray() {
  return makeMembersArray().map(member =>
    ({
      id: member.id,
      gishName: member.gish_name,
      fullName: member.full_name,
      phone: member.phone
    }))
}

module.exports ={
  makeMaliciousMember,
  makeMembersArray,
  makeReceivedMembersArray
}