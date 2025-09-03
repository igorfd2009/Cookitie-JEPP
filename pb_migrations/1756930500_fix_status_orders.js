/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  // Ajusta o campo 'status' para aceitar os valores padronizados em minúsculas
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
        "preparing",
        "ready",
        "completed"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("js4svdif0pl6b39")

  // Reverte para um conjunto mínimo funcional caso necessário
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
        "paid",
        "preparing",
        "ready",
        "completed"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
