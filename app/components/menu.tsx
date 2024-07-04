/*
TODO - remove. most likely unused
*/
import { useState } from 'react';

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div
      className="flex gap-3 justify-center
      items-center h-10 cursor-pointer w-40 
      bg-fuschia-900 dark:bg-none"
      onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <div className="h-6 flex justify-center items-center gap-2.5">
        <div className="dark:text-white font-medium text-fuchsia-950">
          Moonshot
        </div>
      </div>
    </div>
  );
}

export default Menu;
