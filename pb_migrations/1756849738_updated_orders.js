// Reference removed to avoid PB parsing types.d.ts as migration
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8qnplrgm",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending paid processing ready completed canceled"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8qnplrgm",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "paid",
        "processing",
        "ready",
        "completed",
        "canceled"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
