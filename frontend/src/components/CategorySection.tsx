import { Link } from "react-router-dom";

const categories = [
    {
        id: 1,
        name: "Women",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        itemCount: 124,
    },
    {
        id: 2,
        name: "Men",
        image: "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80",
        itemCount: 98,
    },
    {
        id: 3,
        name: "Accessories",
        image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&q=80",
        itemCount: 56,
    },
];

const CategorySection = () => {
    return (
        <section className="py-16 lg:py-24 bg-secondary" id="women">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
                        Browse by Category
                    </span>
                    <h2 className="font-display text-4xl lg:text-5xl font-bold mt-3 text-primary">
                        Shop Collections
                    </h2>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/?category=${category.name}`}
                            className="category-card group aspect-[4/5] rounded-2xl cursor-pointer block relative"
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                <span className="text-white/80 text-sm uppercase tracking-widest mb-1">
                                    {category.itemCount} Items
                                </span>
                                <h3 className="font-display text-3xl font-bold text-white">
                                    {category.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;
