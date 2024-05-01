import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const writeContactsFile = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Cannot read contacts: " + error.message);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    return null;
  }

  const [deletedContact] = contacts.splice(contactIndex, 1);
  await writeContactsFile(contacts);
  return deletedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await writeContactsFile(contacts);
  return newContact;
}

async function updateContact(contactId, data) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = { ...contacts[contactIndex], ...data };
  contacts[contactIndex] = updatedContact;
  await writeContactsFile(contacts);
  return updatedContact;
}

const contactsServices = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

export default contactsServices;
