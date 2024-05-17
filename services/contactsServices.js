import Contact from "../models/Contact.js";

async function listContacts(searchOptions = {}) {
  const { filter = {}, fields = "", settings = {} } = searchOptions;
  const result = await Contact.find(filter, fields, settings).populate(
    "owner",
    "email subscription"
  );
  return result;
}

async function getContactById(contactId) {
  const result = await Contact.findById(contactId);
  return result;
}

async function removeContact(contactId) {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
}

async function addContact(name, email, phone) {
  const newContact = { name, email, phone };
  const result = await Contact.create(newContact);
  return result;
}

async function updateContact(contactId, data) {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, data);
  return updatedContact;
}

async function updateContactFavorite(contactId, { favorite }) {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, {
    favorite,
  });

  return updatedContact;
}

const contactsServices = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactFavorite,
};

export default contactsServices;
