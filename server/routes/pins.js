const router = require("express").Router();
const Pin = require("../models/Pins");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin); //if successful return 200
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all Pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;