import React, { useState, useEffect, useRef } from 'react';

interface SmartElementProps {
  children: React.ReactNode;
  threshold?: number;
}

const SmartElement: React.FC<SmartElementProps> = ({ children, threshold = 115 }) => {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (elementRef.current) {
      const childElement = elementRef.current.firstElementChild as HTMLElement;
      if (childElement) {
        const rect = childElement.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(event.clientX - elementCenterX, 2) +
          Math.pow(event.clientY - elementCenterY, 2)
        );
        setVisible(distance < threshold);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={elementRef} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
      {children}
    </div>
  );
};

export default SmartElement;