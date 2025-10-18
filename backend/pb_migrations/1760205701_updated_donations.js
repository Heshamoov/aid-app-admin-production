/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2198690118",
    "max": 0,
    "min": 0,
    "name": "donor_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number2392944706",
    "max": null,
    "min": null,
    "name": "amount",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select1767278655",
    "maxSelect": 1,
    "name": "currency",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "USD",
      "EUR",
      "AED",
      "SAR"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

  // remove field
  collection.fields.removeById("text2198690118")

  // remove field
  collection.fields.removeById("number2392944706")

  // remove field
  collection.fields.removeById("select1767278655")

  return app.save(collection)
})
