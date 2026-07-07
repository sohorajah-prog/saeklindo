/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_services1234",
    "name": "services",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      {
        "id": "text_nama_srv",
        "name": "nama",
        "type": "text",
        "required": true,
        "presentable": true
      },
      {
        "id": "text_desc_srv",
        "name": "deskripsi",
        "type": "text",
        "required": true
      },
      {
        "id": "text_ben_srv",
        "name": "benefits",
        "type": "text",
        "required": true
      },
      {
        "id": "file_img_srv",
        "name": "image",
        "type": "file",
        "required": false,
        "maxSelect": 1,
        "maxSize": 10485760, // 10MB
        "mimeTypes": ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
      },
      {
        "id": "num_order_srv",
        "name": "order",
        "type": "number",
        "required": false
      },
      {
        "id": "autodate_created_srv",
        "name": "created",
        "type": "autodate",
        "onCreate": true
      },
      {
        "id": "autodate_updated_srv",
        "name": "updated",
        "type": "autodate",
        "onCreate": true,
        "onUpdate": true
      }
    ]
  });

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("services");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
