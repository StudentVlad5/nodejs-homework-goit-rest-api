const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async (req, res) => {
  const data = await fs.readFile(contactsPath);
  const contacts = await JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const contact = await data.find((item) => item.id === contactId);
  if (!contact) {
    return null;
  }
  return contact;
};

const removeContact = async (contactId) => {
  const data = await listContacts();
  let contactIndex;
  const updatedContacts = data.filter(({ id }, index) => {
    if (id === contactId) {
      contactIndex = index;
    }
    return id !== contactId;
  });
  if (contactIndex) {
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return data[contactIndex];
  }
  return null;
};

const addContact = async (body) => {
  const data = await listContacts();
  const updatedContact = { ...body, id: v4() };
  data.push(updatedContact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return updatedContact;
};

const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const index = data.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  data[index] = { ...data[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return data[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
