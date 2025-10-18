/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1907087801")

  // update collection data
  unmarshal({
    "name": "donations"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1907087801")

  // update collection data
  unmarshal({
    "name": "donation"
  }, collection)

  return app.save(collection)
})
