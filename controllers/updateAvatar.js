const { UserSchema } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const FILE_DIR_FORSAVE = path.join(__dirname, "../", "tmp");

const updateAvatar = async (req, res) => {
  const { path: tempUpload, filename } = req.file;

  const [extention] = filename.split(".");
  try {
    const { _id: id } = req.user;
    const avatarName = `${id}.${extention}`;
    const resultUpload = path.join(FILE_DIR_FORSAVE, avatarName);
    await fs.rename(tempUpload, resultUpload);

    Jimp.read(resultUpload.toString(), (err, file) => {
      if (err) throw err;
      file
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .write(`./public/avatars/${avatarName}`); // save
    });
    const avatarURL = path.join("avatars", avatarName);
    await UserSchema.findByIdAndUpdate(req.user._id, { avatarURL });
    res.status(200).json(avatarURL);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = { updateAvatar };
