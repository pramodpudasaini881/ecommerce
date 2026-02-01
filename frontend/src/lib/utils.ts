import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const BASE_URL = "http://localhost:5000";

export const resolveImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads") || imagePath.startsWith("\\uploads")) {
        return `${BASE_URL}${imagePath}`;
    }
    return imagePath;
};
