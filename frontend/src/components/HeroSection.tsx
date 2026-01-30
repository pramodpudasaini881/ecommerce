import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative min-h-[85vh] hero-gradient overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 h-full">
                <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[85vh] py-12">
                    {/* Content */}
                    <div className="space-y-8 animate-slide-up">
                        <div className="space-y-4">
                            <span className="inline-block text-sm font-medium uppercase tracking-[0.3em] text-accent">
                                Spring Collection 2026
                            </span>
                            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary">
                                Elevate Your
                                <span className="block text-gradient-gold">Style</span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                                Discover our curated collection of timeless pieces designed for the modern individual.
                                Crafted with precision, made to last.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button className="btn-gold h-12 px-8 text-sm uppercase tracking-widest">
                                Shop Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button className="btn-outline-dark h-12 px-8 text-sm uppercase tracking-widest">
                                Explore Collection
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 pt-8 border-t border-border">
                            <div>
                                <p className="font-display text-3xl font-bold text-primary">50K+</p>
                                <p className="text-sm text-muted-foreground">Happy Customers</p>
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-primary">200+</p>
                                <p className="text-sm text-muted-foreground">Premium Products</p>
                            </div>
                            <div>
                                <p className="font-display text-3xl font-bold text-primary">15+</p>
                                <p className="text-sm text-muted-foreground">Years Experience</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative hidden lg:block">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"
                                alt="Fashion Model"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card animate-fade-in">
                            <p className="text-sm text-muted-foreground mb-1">Best Seller</p>
                            <p className="font-display text-lg font-semibold">Silk Blend Coat</p>
                            <p className="text-accent font-medium">$289.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
