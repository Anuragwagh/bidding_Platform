const express = require("express");
const { Notification } = require("../models");
const { authenticate } = require("../middleware/auth");

const router = new express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
    res.send(notifications);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/mark-read", authenticate, async (req, res) => {
  try {
    await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
    res.send({ message: "Notifications marked as read" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
