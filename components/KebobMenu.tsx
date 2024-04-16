import React, { useState, useEffect, useRef } from 'react';

type KebobMenuProps = {
  children?: React.ReactNode;
  classList?: string;
}
const KebobMenu = ({ children, classList }: KebobMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const subMenu = useRef<HTMLDivElement>(null);
  const dotMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    if (dotMenu.current && !dotMenu.current.contains(target)) {
      setIsOpen(false);
    }
  }

  return (
    <div className={`kebob-menu ${classList}`} ref={dotMenu} onClick={() => setIsOpen(true)}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className={`kebob-menu-items ${isOpen ? 'open' : ''}`} ref={subMenu}>
        {children}
      </div>
    </div>
  );
}

export default KebobMenu;