import React, { createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type ScrollContextType = {
  scrollToSection: (id: string) => void;
  navigateToSection: (id: string, pagePath: string) => void;
};

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within ScrollProvider");
  return context;
};

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.log(`Section with ID "${id}" not found.`);
    }
  };

  const navigateToSection = (id: string, pagePath: string) => {
    if (location.pathname !== pagePath) {
      // Navigate to the target page first
      navigate(pagePath, {
        state: { scrollToId: id }, // Pass the section ID via state
      });
    } else {
      // If already on the target page, scroll directly
      scrollToSection(id);
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollToSection, navigateToSection }}>
      {children}
    </ScrollContext.Provider>
  );
};