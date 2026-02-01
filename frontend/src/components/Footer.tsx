import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <span className="font-display text-3xl font-bold">Ecommerce App</span>
                        <p className="text-primary-foreground/70 text-sm leading-relaxed">
                            Curating timeless pieces for the modern individual.
                            Quality craftsmanship since 2010.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-6">Ecommerce App</h3>
                        <ul className="space-y-3">
                            {["New Arrivals", "Women", "Men", "Accessories", "Sale"].map(
                                (item) => (
                                    <li key={item}>
                                        <a
                                            href="#"
                                            className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-3">
                            {[
                                "Contact Us",
                                "FAQs",
                                "Shipping & Returns",
                                "Size Guide",
                                "Track Order",
                            ].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-primary-foreground/70 text-sm mb-4">
                            Subscribe for exclusive offers and new arrivals
                        </p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:border-gold"
                            />
                            <button
                                type="submit"
                                className="w-full btn-gold py-3 rounded-lg text-sm uppercase tracking-widest"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-primary-foreground/50 text-sm">
                        © 2026 Ecommerce App. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                            (item) => (
                                <a
                                    key={item}
                                    href={`/page/${item.toLowerCase().replace(/ /g, "-")}`}
                                    className="text-primary-foreground/50 hover:text-primary-foreground text-sm transition-colors"
                                >
                                    {item}
                                </a>
                            )
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
