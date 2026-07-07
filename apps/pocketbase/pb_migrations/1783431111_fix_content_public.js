/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collections = ["content", "gallery", "clients"];
  for (const name of collections) {
    try {
      const collection = app.findCollectionByNameOrId(name);
      collection.listRule = "";
      collection.viewRule = "";
      app.save(collection);
    } catch (err) {
      console.error(err);
    }
  }
}, (app) => {});
