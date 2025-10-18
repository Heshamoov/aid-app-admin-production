/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1971690239")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"admin\" && createdBy = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1971690239")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
})
