import uniqid from 'uniqid';

const createUniqueId = () => {
  let uuid = "";
  const localStorage = window.localStorage;
  if (localStorage.getItem('uuid')) {
    uuid = localStorage.getItem('uuid') as string;
  } else {
    uuid = uniqid();
    localStorage.setItem('uuid', uuid);
  }

  return () => uuid;
}

export const getUniqueId = createUniqueId();
