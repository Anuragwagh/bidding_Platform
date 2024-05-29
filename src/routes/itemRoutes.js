const express = require("express");
const { Item } = require("../models");
const { authenticate, authorize } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = new express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.send(items);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).send();
    }
    res.send(item);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/", authenticate, upload.single("image"), async (req, res) => {
  const itemData = {
    ...req.body,
    current_price: req.body.starting_price,
    image_url: req.file ? req.file.path : null,
  };
  try {
    const item = await Item.create(itemData);
    res.status(201).send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put("/:id", authenticate, authorize(["admin", "user"]), async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).send();
    }
    if (req.user.role !== "admin" && req.user.id !== item.user_id) {
      return res.status(403).send();
    }
    await item.update(req.body);
    res.send(item);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/:id", authenticate, authorize(["admin", "user"]), async (req, res) => {
  try {
    const item = await Item.findOne({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).send();
    }
    if (req.user.role !== "admin" && req.user.id !== item.user_id) {
      return res.status(403).send();
    }
    await item.destroy();
    res.send({ message: "Item deleted" });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
