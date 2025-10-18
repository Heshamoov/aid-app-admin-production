/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

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
      "Cash",
      "Other"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

  // remove field
  collection.fields.removeById("select2069996022")

  return app.save(collection)
})
