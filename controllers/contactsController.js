const { ContactSchema } = require("../models/contact");

const getAll = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const findParams = favorite ? { owner: _id, favorite } : { owner: _id };
  const allContact = await ContactSchema.find(
    findParams,
    "-createdAt -updatedAt",
    {
      skip,
      limit: +limit,
    }
  );

  // const allContact = await ContactSchema.find(
  //   { owner: _id },
  //   "-createdAt -updatedAt"
  // );
  return res.status(200).json(allContact);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const contact = await ContactSchema.findById(
    { _id: id, owner: _id },
    "-createdAt -updatedAt"
  );
  if (contact) {
    return res.status(200).json(contact);
  } else {
    return res.status(404).json(`Not found contact id: ${id}`);
  }
};

const add = async (req, res) => {
  const { body } = req;
  const { _id } = req.user;
  const addedContact = await ContactSchema.create({ ...body, owner: _id });
  return res.status(201).json(addedContact);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  const contactToDelete = await ContactSchema.findByIdAndRemove({
    _id: id,
    owner: _id,
  });
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
  const { _id } = req.user;
  const contactToUpdate = await ContactSchema.findByIdAndUpdate(
    { _id: id, owner: _id },
    body,
    {
      new: true,
    }
  );
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
  const { _id } = req.user;
  const contactToUpdate = await ContactSchema.findByIdAndUpdate(
    { _id: id, owner: _id },
    req.body,
    {
      new: true,
    }
  );
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
