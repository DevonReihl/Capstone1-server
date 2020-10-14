DROP TABLE IF EXISTS hunt_items;

CREATE TABLE hunt_items (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  itemName TEXT NOT NULL,
  itemText TEXT NOT NULL,
  itemType TEXT NOT NULL,
  points INTEGER NOT NULL
);

