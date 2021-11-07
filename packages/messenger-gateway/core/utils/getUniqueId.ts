import uniqid from 'uniqid';
import storage from 'node-persist';

const createUniqueId = async () => {
  await storage.init( /* options ... */ );
  let uuid = await storage.getItem('uuid') || uniqid();
  await storage.setItem('uuid', uuid)

  return () => uuid;
}

let uuid: string | null = null

export const getUniqueId = async () => {
  await storage.init( /* options ... */ );
  if (uuid) return uuid;
  uuid = await storage.getItem('uuid') || uniqid();
  await storage.setItem('uuid', uuid)
  return uuid;
};
