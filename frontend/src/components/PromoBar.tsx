const PromoBar = () => {
    return (
        <div className="bg-primary text-primary-foreground py-2.5 text-center">
            <p className="text-xs sm:text-sm font-medium tracking-wide">
                Free shipping on orders over $200 | Use code{" "}
                <span className="text-gold font-semibold">LUXE20</span> for 20% off
            </p>
        </div>
    );
};

export default PromoBar;
