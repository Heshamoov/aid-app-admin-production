/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number2564548062",
    "max": null,
    "min": null,
    "name": "averageMonthlyIncome",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number3088222477",
    "max": null,
    "min": null,
    "name": "workingMembers",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "bool8670422",
    "name": "isDisplaced",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool4091747783",
    "name": "isFatherAlive",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "number835928144",
    "max": null,
    "min": null,
    "name": "vulnerabilityScore",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // remove field
  collection.fields.removeById("number2564548062")

  // remove field
  collection.fields.removeById("number3088222477")

  // remove field
  collection.fields.removeById("bool8670422")

  // remove field
  collection.fields.removeById("bool4091747783")

  // remove field
  collection.fields.removeById("number835928144")

  return app.save(collection)
})
