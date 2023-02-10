const express = require("express");
const { cntrlWrap } = require("../../middleware/cntrlWrap");
const { validation } = require("../../middleware/validation");
const {
  schemauserRegistration,
  schemauserLogin,
} = require("../../middleware/scemauser");
const { isAuth } = require("../../middleware/isAuth");
const { scemaSubscription } = require("../../middleware/scemauser");
const { userSubscription } = require("../../controllers/userSubscription");
const {
  signupController,
  loginController,
  logoutController,
} = require("../../controllers/authController");
const { getCurrentUser } = require("../../controllers/getCurrentUser");
const { upload } = require("../../middleware/upload");
const { updateAvatar } = require("../../controllers/updateAvatar");

const router = express.Router();
router.post("/login", validation(schemauserLogin), cntrlWrap(loginController));
router.post(
  "/signup",
  validation(schemauserRegistration),
  cntrlWrap(signupController)
);
router.get("/logout", isAuth, cntrlWrap(logoutController));
router.get("/current", isAuth, cntrlWrap(getCurrentUser));
router.patch(
  "/",
  isAuth,
  validation(scemaSubscription),
  cntrlWrap(userSubscription)
);

router.patch("/avatars", isAuth, upload.single("avatar"), cntrlWrap(updateAvatar));
module.exports = router;
