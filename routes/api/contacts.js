const express = require("express");

const contactsOperations = require("../../models/contacts");
const router = express.Router();
const { schema } = require("../../middleware/scema");

router.get("/", async (req, res, next) => {
  const allContacts = await contactsOperations.listContacts();
  return res.status(200).json({
    status: 200,
    data: {
      result: allContacts,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await contactsOperations.getContactById(req.params.contactId);
  if (contact) {
    return res.status(200).json({
      status: 200,
      data: {
        result: contact,
      },
    });
  } else {
    return res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

router.post("/", async (req, res, next) => {
  const validationResult = schema.validate(req.query);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ status: 400, message: validationResult.error });
  }
  const { name, email, phone } = req.query;
  if (name && email && phone) {
    const contact = await contactsOperations.addContact({ name, email, phone });
    return res.status(201).json({
      status: 201,
      data: {
        result: contact,
      },
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "missing required name field",
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await contactsOperations.removeContact(req.params.contactId);
  if (contact) {
    return res.status(200).json({
      status: 200,
      message: "contact deleted",
    });
  } else {
    return res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.query;
  if (!name || !email || !phone) {
    return res.status(400).json({
      status: 400,
      message: "missing fields",
    });
  }

  const validationResult = schema.validate(req.query);
  if (validationResult.error) {
    return res
      .status(400)
      .json({ status: 400, message: validationResult.error });
  }

  const addedContact = await contactsOperations.updateContact(
    req.params.contactId,
    { name, email, phone }
  );
  if (addedContact) {
    return res.status(200).json({
      status: 200,
      result: addedContact,
    });
  } else {
    return res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

module.exports = router;
