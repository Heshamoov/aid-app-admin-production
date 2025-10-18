/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "\t\n@request.auth.id != \"\"",
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
        "cascadeDelete": false,
        "collectionId": "pbc_3641796565",
        "hidden": false,
        "id": "relation2783322459",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "family",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3573984430",
        "hidden": false,
        "id": "relation521872670",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "item",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "number2683508278",
        "max": null,
        "min": null,
        "name": "quantity",
        "onlyInt": false,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "number"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation510846563",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "distributedBy",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
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
    "id": "pbc_1746995707",
    "indexes": [],
    "listRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\"",
    "name": "distributions",
    "system": false,
    "type": "base",
    "updateRule": "\t\n@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1746995707");

  return app.delete(collection);
})
