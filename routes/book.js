const express = require('express');
const router = express.Router();
const { Book } = require('../models');


// Redirect to /books
router.get('/', (req, res) => {
    res.redirect('/books');
});

// GET /books
router.get('/books', async (req, res, next) => {
    try {
        const books = await Book.findAll();
        res.render('index', { books });
    } catch (error) {
        next(error);
    }
});


// GET /books/new
router.get('/books/new', (req, res) => {
    res.render('new-book', { book: {}, errors: [] });
});

// POST /books/new
router.post('/books/new', async (req, res, next) => {
    try {
        await Book.create(req.body);
        res.redirect('/books');
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.render('new-book', {
                book: req.body,
                errors: error.errors.map(err => err.message)
            });
        } else {
            next(error);
        }
    }
});


// GET /books/:id
router.get('/books/:id', async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        if (isNaN(bookId)) {
            console.log('Invalid ID:', req.params.id);
            return res.status(400).send('Invalid book ID');
        }
        const book = await Book.findByPk(bookId);
        if (book) {
            res.render('update-book', { book });
        } else {
            res.status(404).render('page-not-found');
        }
    } catch (error) {
        next(error);
    }
});

// POST /books/:id
router.post('/books/:id', async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const book = await Book.findByPk(bookId);
        if (book) {
            await book.update(req.body);
            res.redirect('/books');
        } else {
            res.render('page-not-found');
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const book = await Book.build(req.body);
            book.id = req.params.id; // preserve the book ID
            res.render('update-book', {
                book,
                errors: error.errors.map(err => err.message)
            });
        } else {
            next(error);
        }
    }
});

// POST /books/:id/delete
router.post('/books/:id/delete', async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const book = await Book.findByPk(bookId);
        if (book) {
            await book.destroy();
            res.redirect('/books');
        } else {
            res.render('page-not-found');
        }
    } catch (error) {
        next(error);
    }
});


module.exports = router;

