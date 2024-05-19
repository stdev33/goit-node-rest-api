import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerFuncWrapper from "../decorators/controllerFuncWrapper.js";

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const filter = { owner };
    const fields = "-createdAt -updatedAt";
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const settings = { skip, limit };

    if (favorite) {
      filter.favorite = favorite === "true";
    }

    const contacts = await contactsService.listContacts({
      filter,
      fields,
      settings,
    });

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const contact = await contactsService.getContactById({ _id, owner });
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const deletedContact = await contactsService.removeContact({ _id, owner });
    if (!deletedContact) {
      throw HttpError(404);
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const updatedContact = await contactsService.updateContact(
      { _id, owner },
      req.body
    );
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const updatedContact = await contactsService.updateContactFavorite(
      { _id, owner },
      req.body
    );
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts: controllerFuncWrapper(getAllContacts),
  getOneContact: controllerFuncWrapper(getOneContact),
  deleteContact: controllerFuncWrapper(deleteContact),
  createContact: controllerFuncWrapper(createContact),
  updateContact: controllerFuncWrapper(updateContact),
  updateFavorite: controllerFuncWrapper(updateFavorite),
};
