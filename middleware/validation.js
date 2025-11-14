const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
};
module.exports = validateProduct;
