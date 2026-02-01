import ProductCard from "./ProductCard";

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: any;
    isNew?: boolean;
    isSale?: boolean;
}

interface ProductGridProps {
    onAddToCart: (product: Product) => void;
    products: Product[];
    isLoading: boolean;
}

const ProductGrid = ({ onAddToCart, products, isLoading }: ProductGridProps) => {
    if (isLoading) {
        return (
            <section className="py-16 lg:py-24 bg-background" id="new">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <p className="text-xl">Loading products...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-background" id="new">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
                        Curated Selection
                    </span>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold mt-3 mb-4 text-primary">
                        Featured Products
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Handpicked pieces that embody quality craftsmanship and timeless design
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={{
                                ...product,
                                category: product.category?.name || "Product"
                            }}
                            onAddToCart={() => onAddToCart(product)}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="btn-outline-dark px-8 py-3 text-sm uppercase tracking-widest rounded-lg border-2">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
