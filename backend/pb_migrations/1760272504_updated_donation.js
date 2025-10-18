/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1907087801")

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

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2930407725",
    "max": 0,
    "min": 0,
    "name": "donor_organization",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text449483286",
    "max": 0,
    "min": 0,
    "name": "porpose",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2964174668",
    "max": 0,
    "min": 0,
    "name": "receipt_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text988533903",
    "max": 0,
    "min": 0,
    "name": "donor_contact",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text18589324",
    "max": 0,
    "min": 0,
    "name": "notes",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select2069996022",
    "maxSelect": 1,
    "name": "payment_method",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Cash"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1907087801")

  // remove field
  collection.fields.removeById("text2198690118")

  // remove field
  collection.fields.removeById("number2392944706")

  // remove field
  collection.fields.removeById("select1767278655")

  // remove field
  collection.fields.removeById("text2930407725")

  // remove field
  collection.fields.removeById("text449483286")

  // remove field
  collection.fields.removeById("text2964174668")

  // remove field
  collection.fields.removeById("text988533903")

  // remove field
  collection.fields.removeById("text18589324")

  // remove field
  collection.fields.removeById("select2069996022")

  return app.save(collection)
})
