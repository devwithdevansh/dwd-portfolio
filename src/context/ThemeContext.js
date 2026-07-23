import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to dark mode for the cinematic wow factor
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Add or remove 'dark' class on HTML element
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (e) => {
    // If browser doesn't support View Transitions or we don't have an event, just toggle normally
    if (!document.startViewTransition || !e) {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
      return;
    }

    // Get click position for the center of the circular reveal
    const x = e.clientX ?? window.innerWidth / 2;
    const y = e.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDark = theme === 'dark';
    
    // We start the view transition
    const transition = document.startViewTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 800,
          easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
