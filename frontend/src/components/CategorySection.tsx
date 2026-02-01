import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/api/categoryService";

const CategorySection = () => {
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getAllCategories,
    });

    const placeholderImages = [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
        "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80",
        "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
    ];

    return (
        <section className="py-16 lg:py-24 bg-secondary">
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
                    {(categories || []).map((category: any, index: number) => (
                        <Link
                            key={category._id}
                            to={`/?category=${category._id}`}
                            className="category-card group aspect-[4/5] rounded-2xl cursor-pointer block relative"
                        >
                            <img
                                src={placeholderImages[index % placeholderImages.length]}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors rounded-2xl" />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                                <span className="text-white/80 text-sm uppercase tracking-widest mb-1">
                                    View Collection
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
