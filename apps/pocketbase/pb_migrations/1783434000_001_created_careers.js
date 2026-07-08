/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_careers12345",
    "name": "careers",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      {
        "id": "text_title_car",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": true
      },
      {
        "id": "text_title_en_car",
        "name": "title_en",
        "type": "text",
        "required": false
      },
      {
        "id": "text_desc_car",
        "name": "description",
        "type": "text",
        "required": true
      },
      {
        "id": "text_desc_en_car",
        "name": "description_en",
        "type": "text",
        "required": false
      },
      {
        "id": "text_req_car",
        "name": "requirements",
        "type": "text",
        "required": false
      },
      {
        "id": "text_req_en_car",
        "name": "requirements_en",
        "type": "text",
        "required": false
      },
      {
        "id": "text_loc_car",
        "name": "location",
        "type": "text",
        "required": false
      },
      {
        "id": "text_type_car",
        "name": "type",
        "type": "text",
        "required": false
      },
      {
        "id": "text_type_en_car",
        "name": "type_en",
        "type": "text",
        "required": false
      },
      {
        "id": "text_apply_car",
        "name": "applyUrl",
        "type": "text",
        "required": false
      },
      {
        "id": "bool_active_car",
        "name": "isActive",
        "type": "bool",
        "required": false
      },
      {
        "id": "num_order_car",
        "name": "order",
        "type": "number",
        "required": false
      },
      {
        "id": "autodate_created_car",
        "name": "created",
        "type": "autodate",
        "onCreate": true
      },
      {
        "id": "autodate_updated_car",
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
    const collection = app.findCollectionByNameOrId("careers");
    return app.delete(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
