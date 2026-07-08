/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collections = ["content", "gallery", "clients"];
  for (const name of collections) {
    try {
      const collection = db.findCollectionByNameOrId(name);
      collection.listRule = "";
      collection.viewRule = "";
      db.save(collection);
    } catch (err) {
      console.error(err);
    }
  }
}, (db) => {
  // empty rollback since we are just fixing the previous broken one
});
