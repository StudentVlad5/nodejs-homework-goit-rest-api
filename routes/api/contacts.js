const express = require("express");
const router = express.Router();
const { validation } = require("../../middleware/validation");
const { isValidId } = require("../../middleware/isValidId");
const { schemacontact } = require("../../middleware/scemacontact");
const { cntrlWrap } = require("../../middleware/cntrlWrap");
const { isAuth } = require("../../middleware/isAuth");

const {
  getAll,
  getById,
  add,
  update,
  remove,
  updateFavorite,
} = require("../../controllers/contactsController");


router.use(isAuth);
router.get("/", cntrlWrap(getAll));
router.get("/:id", isValidId, cntrlWrap(getById));
router.post("/", validation(schemacontact), cntrlWrap(add));
router.delete("/:id", isValidId, cntrlWrap(remove));
router.put("/:id", isValidId, validation(schemacontact), cntrlWrap(update));
router.patch(
  "/:id/favorite",
  isValidId,
  validation(schemacontact),
  cntrlWrap(updateFavorite)
);

module.exports = router;
