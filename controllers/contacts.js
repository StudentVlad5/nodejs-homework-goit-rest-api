const ContactSchema = require("../models/contact");

const getAll = async (_, res) => {
  const allContact = await ContactSchema.find({}, "-createdAt -updatedAt");
  return res.status(200).json(allContact);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const contact = await ContactSchema.findById(id, "-createdAt -updatedAt");
  if (contact) {
    return res.status(200).json(contact);
  } else {
    return res.status(404).json(`Not found contact id: ${id}`);
  }
};

const add = async (req, res) => {
  const { body } = req;
  const addedContact = await ContactSchema.create(body);
  return res.status(201).json(addedContact);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const contactToDelete = await ContactSchema.findByIdAndRemove(id);
  if (contactToDelete) {
    return res.status(200).json(contactToDelete);
  } else {
    const error = new Error(`contact whith id = ${id} not found`);
    error.status = 404;
    throw error;
  }
};

const update = async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const contactToUpdate = await ContactSchema.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (contactToUpdate) {
    return res.status(200).json(contactToUpdate);
  } else {
    const error = new Error(`contact whith id = ${id} not found`);
    error.status = 404;
    throw error;
  }
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const contactToUpdate = await ContactSchema.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (contactToUpdate) {
    return res.status(200).json(contactToUpdate);
  } else {
    const error = new Error(`contact whith id = ${id} not found`);
    error.status = 404;
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
  updateFavorite,
};
