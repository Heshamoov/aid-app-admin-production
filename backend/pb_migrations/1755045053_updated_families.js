/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "\t\n@request.auth.role = \"admin\"",
    "listRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\"",
    "updateRule": "\t\n@request.auth.role = \"admin\"",
    "viewRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3641796565")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
