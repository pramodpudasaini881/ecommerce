import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    // Sale filter
    const saleFilter = req.query.sale === 'true' ? { salePrice: { $gt: 0 } } : {};

    // Sort
    let sortQuery = {};
    if (req.query.sort === 'newest') {
      sortQuery = { createdAt: -1 };
    } else if (req.query.sort === 'price_asc') {
      sortQuery = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortQuery = { price: -1 };
    }

    const count = await Product.countDocuments({ ...keyword, ...category, ...saleFilter });
    const products = await Product.find({ ...keyword, ...category, ...saleFilter })
      .sort(sortQuery)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category");

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (product) res.json(product);
  else res.status(404).json({ message: "Product not found" });
};

// Create new product (admin)
export const createProduct = async (req, res) => {
  const { name, description, price, countInStock, image, category } = req.body;
  const product = await Product.create({
    name,
    description,
    price,
    countInStock,
    image,
    category,
  });
  res.status(201).json(product);
};

// Update product (admin)
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// Delete product (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: "Product already reviewed" });
      return;
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
