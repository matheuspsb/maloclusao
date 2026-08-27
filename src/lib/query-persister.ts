import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

export const queryPersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "maloclusao-query-cache",
})
