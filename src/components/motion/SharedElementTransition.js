import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A helper hook/component to trigger the native View Transitions API.
 * Provides a graceful fallback for unsupported browsers.
 */
export function useSharedTransition() {
  const navigate = useNavigate();

  const navigateWithTransition = (to) => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }

    document.startViewTransition(() => {
      // The browser captures the "before" state, then we navigate.
      // We must flush the navigation synchronously for React.
      navigate(to);
    });
  };

  return navigateWithTransition;
}

export default function SharedElementTransition({ children, to, className = "", onClick }) {
  const navigate = useSharedTransition();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
