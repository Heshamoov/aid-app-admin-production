/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"admin\"",
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3095901163",
        "max": 0,
        "min": 0,
        "name": "purpose",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ],
    "id": "pbc_2848092154",
    "indexes": [],
    "listRule": "",
    "name": "donations",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = \"admin\"",
    "viewRule": ""
  });

  return app.save(collection);
})
