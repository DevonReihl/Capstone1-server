function makeItemsArray() {
  return [
    {
      id: 1,
      item_name: 'Sillyness',
      item_text: 'Words of sillyness that better the world',
      item_type: 'image',
      points: 10,
      member_id: null
    },
    {
      id: 2,
      item_name: 'More sillyness',
      item_text: 'Words of sillyness that better the world',
      item_type: 'image',
      points: 100,
      member_id: null
    },
    {
      id: 3,
      item_name: 'weirdness',
      item_text: 'Nothing but sillyness sillyness that better the world',
      item_type: 'image',
      points: 110,
      member_id: null
    },
  ]
}

function makeMaliciousItem() {
  const maliciousItem = {
    id: 911,
    item_name: 'Lucifer <script>alert("xss");</script>',
    item_text: 'Lucifer <script>alert("xss");</script>',
    item_type: 'Lucifer <script>alert("xss");</script>',
    points: 1020204830,
    member_id: null
  }
}

// function makeReceivedItemsArray() {
//   return makeItemsArray().map( item => 
//    ({
//      id: item.id,
//      item_name: item.item_name,
//      item_text: item.item_text,
//      item_type: item.item_type,
//      points: item.points,
//      member_id: null
//    })
//     )
// }

module.exports = {
  makeItemsArray,
  makeMaliciousItem,
  // makeReceivedItemsArray
}