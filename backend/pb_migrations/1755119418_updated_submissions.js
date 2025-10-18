/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482339971")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\"",
    "viewRule": "@request.auth.role = \"admin\" || @request.auth.role = \"monitor\""
  }, collection)

  return app.save(collection)
})
