const express = require("express");

const contactsOperations = require("../../models/contacts");
const router = express.Router();
const { schemaPost } = require("../../middleware/scemaPost");
const { schemaPut } = require("../../middleware/shemaPut");
const { validationPost } = require("../../middleware/validationPost");
const { validationPut } = require("../../middleware/validationPut");

router.get("/", async (req, res, next) => {
  const allContacts = await contactsOperations.listContacts();
  return res.status(200).json(allContacts);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await contactsOperations.getContactById(req.params.contactId);
  if (contact) {
    return res.status(200).json(contact);
  } else {
    return res.status(404).json({
      message: "Not found",
    });
  }
});

router.post("/", validationPost(schemaPost), async (req, res, next) => {
  const contact = await contactsOperations.addContact({ ...req.body });
  return res.status(201).json(contact);
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await contactsOperations.removeContact(req.params.contactId);
  if (contact) {
    return res.status(200).json({
      message: "contact deleted",
    });
  } else {
    return res.status(404).json({
      message: "Not found",
    });
  }
});

router.put("/:contactId", validationPut(schemaPut), async (req, res, next) => {
  const addedContact = await contactsOperations.updateContact(
    req.params.contactId,
    req.body
  );
  if (addedContact) {
    return res.status(200).json(addedContact);
  } else {
    return res.status(404).json({
      message: "Not found",
    });
  }
});

module.exports = router;
