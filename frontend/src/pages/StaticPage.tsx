
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";

const contentMap: Record<string, { title: string; content: string }> = {
    "privacy-policy": {
        title: "Privacy Policy",
        content: `
            <p>At Kinni Ho, we are committed to protecting your privacy...</p>
            <p>We do not sell your personal data to third parties.</p>
        `
    },
    "terms-of-service": {
        title: "Terms of Service",
        content: `
            <p>Welcome to Kinni Ho. By using our website, you agree to these terms...</p>
        `
    },
    "shipping-returns": {
        title: "Shipping & Returns",
        content: `
            <p>We offer free shipping on orders over $200...</p>
            <p>You can return items within 30 days of receipt.</p>
        `
    },
    "about-us": {
        title: "About Us",
        content: `
            <p>Kinni Ho is a premium fashion destination...</p>
        `
    },
    "faq": {
        title: "Frequently Asked Questions",
        content: `
            <p><strong>Q: How long does shipping take?</strong><br/>A: Usually 3-5 business days.</p>
        `
    }
};

const StaticPage = () => {
    const { slug } = useParams(); // e.g. /page/privacy-policy
    const pageData = contentMap[slug || ""] || {
        title: "Page Not Found",
        content: "<p>The page you are looking for does not exist.</p>"
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl font-bold mb-8">{pageData.title}</h1>
                    <div
                        className="prose prose-stone dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StaticPage;
