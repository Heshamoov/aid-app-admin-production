/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.role = \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2848092154")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
})
