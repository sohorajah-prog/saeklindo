/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("services");

  collection.fields.add(new TextField({
    name: "nama_en",
    required: false
  }));

  collection.fields.add(new TextField({
    name: "deskripsi_en",
    required: false
  }));

  collection.fields.add(new TextField({
    name: "benefits_en",
    required: false
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("services");
    collection.fields.removeByName("nama_en");
    collection.fields.removeByName("deskripsi_en");
    collection.fields.removeByName("benefits_en");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
