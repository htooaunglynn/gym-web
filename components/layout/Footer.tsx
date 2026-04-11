import React from "react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface-container-low border-t border-border py-6 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-label-md text-on-surface-variant">
                    © {currentYear} GymHub. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-label-md text-on-surface hover:text-primary transition-default">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-label-md text-on-surface hover:text-primary transition-default">
                        Terms & Conditions
                    </a>
                    <a href="#" className="text-label-md text-on-surface hover:text-primary transition-default">
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
}
