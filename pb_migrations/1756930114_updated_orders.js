/// <reference path="../pb_data/types.d.ts" />
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
        "pending"
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
        "PENDING PAID PREPARING READY COMPLETED"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
