/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "\t\n@request.auth.role = \"admin\"",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1963619905",
        "max": 0,
        "min": 0,
        "name": "familyName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "geoPoint1587448267",
        "name": "location",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "geoPoint"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "hidden": false,
        "id": "bool8670422",
        "name": "isDisplaced",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "bool4091747783",
        "name": "isFatherAlive",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
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
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3641796565",
    "indexes": [],
    "listRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\"",
    "name": "families",
    "system": false,
    "type": "base",
    "updateRule": "\t\n@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\""
  });

  return app.save(collection);
})
