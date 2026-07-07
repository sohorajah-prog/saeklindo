/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("content");

  collection.fields.add(new FileField({
    name: "image_file",
    required: false,
    maxSelect: 1,
    maxSize: 10485760, // 10MB
    mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
  }));

  return app.save(collection);
}, (app) => {
  try {
    const collection = app.findCollectionByNameOrId("content");
    collection.fields.removeByName("image_file");
    return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
