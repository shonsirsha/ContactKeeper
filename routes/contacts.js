const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Contact = require("../models/Contact");
const router = express.Router();

//@route    GET api/contacts
//@desc     Gets all user's contacts
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
    //req.user.id is avail due to auth middleware
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

//@route    POST api/contacts
//@desc     Add a new contact
//@access   Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name: name,
        email: email,
        phone: phone,
        type: type,
        user: req.user.id
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server error");
    }
  }
);

//@route    PUT api/auth/:id
//@desc     Edit a contact with id
//@access   Private
router.put("/:id", auth, async (req, res) => {
  const { email, name, phone, type } = req.body;

  //build contact object
  const contactFields = {};
  if (name) {
    contactFields.name = name;
  }
  if (email) {
    contactFields.email = email;
  }
  if (phone) {
    contactFields.phone = phone;
  }
  if (type) {
    contactFields.type = type;
  }

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    //make sure user owns contact

    if (contact.user.toString() !== req.user.id) {
      //contact.user is the userid from db
      return res.status(401).json({ msg: "Not authorised." });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields
      },
      { new: true }
    );
    res.json(contact);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});

//@route    PUT api/auth/:id
//@desc     Delete a contact with id
//@access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    //make sure user owns contact

    if (contact.user.toString() !== req.user.id) {
      //contact.user is the userid from db
      return res.status(401).json({ msg: "Not authorised." });
    }

    await Contact.findByIdAndRemove(req.params.id);
    return res.json({ msg: "Contact removed" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
