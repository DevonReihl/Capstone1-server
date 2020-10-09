function makeItemsArray() {
  return [
    {
      id: 1,
      itemname: 'Sillyness',
      itemtext: 'Words of sillyness that better the world',
      itemtype: 'image',
      pointvalue: 100,
    },
    {
      id: 2,
      itemname: 'More sillyness',
      itemtext: 'Words of sillyness that better the world',
      itemtype: 'image',
      pointvalue: 100,
    },
    {
      id: 3,
      itemname: 'weirdness',
      itemtext: 'Nothing but sillyness sillyness that better the world',
      itemtype: 'image',
      pointvalue: 100,
    },
  ]
}

function makeMaliciousItem() {
  const maliciousItem = {
    id: 911,
    itemname: 'Lucifer <script>alert("xss");</script>',
    itemtext: 'Lucifer <script>alert("xss");</script>',
    itemtype: 'Lucifer <script>alert("xss");</script>',
    pointvalue: 10000000,
  }
}

module.exports = {
  makeItemsArray,
  makeMaliciousItem,
}