/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text223244161",
    "max": 0,
    "min": 0,
    "name": "address",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "geoPoint1587448267",
    "name": "location",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation415171671",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "registeredBy",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3122551797",
    "max": null,
    "min": null,
    "name": "familyMembers",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number347781374",
    "max": null,
    "min": null,
    "name": "childrenUnder5",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1268339103",
    "max": null,
    "min": null,
    "name": "childrenInSchool",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3568488596",
    "max": null,
    "min": null,
    "name": "childrenNotInSchool",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number1930935333",
    "max": null,
    "min": null,
    "name": "adults18to59",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number271798834",
    "max": null,
    "min": null,
    "name": "eldersOver60",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number2592847435",
    "max": null,
    "min": null,
    "name": "membersWithDisabilities",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // remove field
  collection.fields.removeById("text223244161")

  // remove field
  collection.fields.removeById("geoPoint1587448267")

  // remove field
  collection.fields.removeById("relation415171671")

  // remove field
  collection.fields.removeById("number3122551797")

  // remove field
  collection.fields.removeById("number347781374")

  // remove field
  collection.fields.removeById("number1268339103")

  // remove field
  collection.fields.removeById("number3568488596")

  // remove field
  collection.fields.removeById("number1930935333")

  // remove field
  collection.fields.removeById("number271798834")

  // remove field
  collection.fields.removeById("number2592847435")

  return app.save(collection)
})
