const fs = require("fs/promises");
const path = require("path");

const ObjectID = require("bson-objectid");

const contactsPath = path.join(__dirname, "contacts.json");

const updateContacts = async (data) => {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
};

const listContacts = async () => {
  const res = await fs.readFile(contactsPath);
  return JSON.parse(res);
};

const getContactById = async (id) => {
  const contacts = await listContacts();
  const res = await contacts.find(
    (contact) => contact.id === JSON.stringify(id)
  );
  if (!res) {
    return null;
  }
  return res;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((e) => e.id === JSON.stringify(id));
  if (idx === -1) {
    return null;
  }
  const [result] = contacts.splice(idx, 1);
  await updateContacts(contacts);
  return result;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();
  const newContact = {
    id: ObjectID(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
