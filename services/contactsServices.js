import Contact from "../models/Contact.js";

async function listContacts(searchOptions = {}) {
  const { filter = {}, fields = "", settings = {} } = searchOptions;
  const result = await Contact.find(filter, fields, settings).populate(
    "owner",
    "email subscription"
  );
  return result;
}

async function getContactById(filter) {
  const result = await Contact.findOne(filter);
  return result;
}

async function removeContact(filter) {
  const deletedContact = await Contact.findOneAndDelete(filter);
  return deletedContact;
}

async function addContact(data) {
  const result = await Contact.create(data);
  return result;
}

async function updateContact(filter, data) {
  const updatedContact = await Contact.findOneAndUpdate(filter, data);
  return updatedContact;
}

async function updateContactFavorite(filter, { favorite }) {
  const updatedContact = await Contact.findOneAndUpdate(filter, {
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
