const express = require("express");
const { Bid } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = new express.Router();

router.get("/items/:itemId/bids", async (req, res) => {
  try {
    const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
    res.send(bids);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/items/:itemId/bids", authenticate, async (req, res) => {
  try {
    const bid = await Bid.create({
      item_id: req.params.itemId,
      user_id: req.user.id,
      bid_amount: req.body.bid_amount,
    });
    res.status(201).send(bid);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
