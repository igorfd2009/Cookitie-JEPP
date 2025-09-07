// Reference removed to avoid PB parsing types.d.ts as migration
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  collection.listRule = "@request.auth.id != \"\""
  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = "@request.auth.id != \"\""
  collection.updateRule = "@request.auth.id != \"\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  collection.listRule = "@request.auth.id != \"\"\n"
  collection.viewRule = "@request.auth.id != \"\"\n"
  collection.createRule = "@request.auth.id != \"\"\n"
  collection.updateRule = "@request.auth.id != \"\"\n"

  return dao.saveCollection(collection)
})
