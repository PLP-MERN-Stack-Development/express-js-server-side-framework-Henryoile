const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const validateProduct = require('../middleware/validation');

let products = [];

// GET all products with filtering, pagination, and search
router.get('/', (req, res) => {
    let result = [...products];
    const { category, page = 1, limit = 5, search } = req.query;

    if (category) result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + Number(limit));

    res.json({
        total: result.length,
        page: Number(page),
        limit: Number(limit),
        data: paginated
    });
});

// GET product statistics
router.get('/stats', (req, res) => {
    const stats = {};
    products.forEach(p => {
        stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json(stats);
});

// GET product by ID
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// POST create new product
router.post('/', validateProduct, (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = { id: uuidv4(), name, description, price, category, inStock };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', validateProduct, (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

// DELETE product
router.delete('/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

module.exports = router;
