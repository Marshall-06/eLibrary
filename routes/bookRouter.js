const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Book, Category } = require('../models/model');
const upload = require("../middlewares/upload");

router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

router.get("/single/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
})

router.post(
  "/create",
  upload.fields([{ name: "image" }, { name: "pdf" }]),
  async (req, res) => {
    const { name, description, categoryId } = req.body;

    if (!name || !description || !categoryId) {
      return res.status(400).json({ error: "Name, Description, Category required" });
    }

    if (!req.files || !req.files.image || !req.files.pdf) {
      return res.status(400).json({ error: "PDF and Image are required" });
    }

    try {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const fileBaseUrl = `${req.protocol}://${req.get("host")}/uploads`;

      const book = await Book.create({
        name,
        description,
        categoryId,
        image: req.files.image[0].filename,
        pdf: req.files.pdf[0].filename,
      });

      res.status(201).json({
        message: "Book uploaded successfully",
        data: {
          id: book.id,
          name: book.name,
          description: book.description,
          categoryId: book.categoryId,
          image: `${fileBaseUrl}/${book.image}`, // ✅ full URL
          pdf: `${fileBaseUrl}/${book.pdf}`,     // ✅ full URL
          createdAt: book.createdAt,
          updatedAt: book.updatedAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);





router.put("/update/:id", upload.fields([{ name: "pdf" }, { name: "image" }]), async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const { name, description, categoryId } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Name and Description are required" });
  }
  if (req.files.image) {
    book.image = req.files.image[0].filename;
  }
  if (req.files.pdf) {
    book.pdf = req.files.pdf[0].filename;
  }
  if (categoryId) {
    const category = await Category.findByPk;
    if (!category) return res.status(400).json({ error: "Category not found" });
  }
  book.name = name;
  book.description = description;
  book.categoryId = categoryId || book.categoryId ;
  pdf = req.files.pdf ? req.files.pdf[0].filename : book.pdf
  image = req.files.image ? req.files.image[0].filename : book.image
  await book.save();
  res.json({ message: "Book updated successfully", book });
})

router.delete("/delete/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  await book.destroy();
  res.json({ message: "Book deleted successfully" });
})


// router.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "../uploads/pdf", req.params.filename);
//   res.download(filePath, req.params.filename, (err) => {
//     if (err) {
//       res.status(500).json({ error: "File not found" });
//     }
//   });
// });



module.exports = router