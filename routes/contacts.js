const express = require("express");

const router = express.Router();

//@route    GET api/contacts
//@desc     Gets all user's contacts
//@access   Private
router.get("/", (req, res) => {
  res.send("Get all user's contacts");
});

//@route    POST api/auth
//@desc     Add a new contact
//@access   Private
router.post("/", (req, res) => {
  res.send("Add a new contact");
});

//@route    PUT api/auth/:id
//@desc     Edit a contact with id
//@access   Private
router.put("/:id", (req, res) => {
  res.send("Edit a contact");
});

//@route    PUT api/auth/:id
//@desc     Delete a contact with id
//@access   Private
router.delete("/:id", (req, res) => {
  res.send("Delete a contact");
});
module.exports = router;
