const express = require("express");
const { validation } = require("../../middleware/validation");
const { isValidId } = require("../../middleware/isValidId");
const { schema } = require("../../middleware/scema");
const { cntrlWrap } = require("../../middleware/cntrlWrap");

const {
  getAll,
  getById,
  add,
  update,
  remove,
  updateFavorite,
} = require("../../controllers/contacts");

const router = express.Router();
router.get("/", cntrlWrap(getAll));
router.get("/:id", isValidId, cntrlWrap(getById));
router.post("/", validation(schema), cntrlWrap(add));
router.delete("/:id", isValidId, cntrlWrap(remove));
router.put("/:id", isValidId, validation(schema), cntrlWrap(update));
router.patch(
  "/:id/favorite",
  isValidId,
  validation(schema),
  cntrlWrap(updateFavorite)
);

module.exports = router;
