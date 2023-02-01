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
router.get("/", async (req, res) => cntrlWrap(getAll(req, res)));
router.get("/:id", isValidId, async (req, res) => cntrlWrap(getById(req, res)));
router.post("/", validation(schema), async (req, res) =>
  cntrlWrap(add(req, res))
);
router.delete("/:id", isValidId, async (req, res) =>
  cntrlWrap(remove(req, res))
);
router.put("/:id", isValidId, validation(schema), async (req, res) =>
  cntrlWrap(update(req, res))
);
router.patch("/:id/favorite", isValidId, validation(schema), async (req, res) =>
  cntrlWrap(updateFavorite(req, res))
);

module.exports = router;
