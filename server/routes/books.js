// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find((err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  const actionForm = "/books/add";
  res.render('books/details', { books: {}, title: "Add a new book", actionForm });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  const bookToBeAdded = new book({
    Title: req.body.title,
    Price: req.body.price,
    Author: req.body.author,
    Genre: req.body.genre
  });
  bookToBeAdded.save();
  res.redirect('/books');
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const actionForm = "/books/"+id;

  book.findById(id, (err, data) => {
    if (err) {
      res.send(500, "Error! Try Again");
    }
    res.render('books/details', { books: data, title: "Update book " + data.Title, actionForm });
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  const Title = req.body.title,
    Price = req.body.price,
    Author = req.body.author,
    Genre = req.body.genre;

    book.findByIdAndUpdate(id, {
      Title,
      Price,
      Author,
      Genre
    }).catch(error => {
      res.send(500, error)
    });
  res.redirect('/books');
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

  const id = req.params.id;
  book.findByIdAndRemove(id)
    .catch(error => {
      res.send(500, err);
    });
  res.redirect('/books');

});


module.exports = router;
