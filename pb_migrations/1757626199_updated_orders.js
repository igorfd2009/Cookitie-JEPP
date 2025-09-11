/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  collection.listRule = "userId = @request.auth.id"
  collection.viewRule = "userId = @request.auth.id"
  collection.createRule = "@request.auth.id != \"\" && userId = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\""
  collection.deleteRule = "userId = @request.auth.id\n"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = "@request.auth.id != \"\"\n"

  return dao.saveCollection(collection)
})
