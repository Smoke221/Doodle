import React from "react";

interface ShapesMenuProps {
  onSelectShape: (shape: string) => void;
}

const ShapesMenu: React.FC<ShapesMenuProps> = ({ onSelectShape }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectShape(e.target.value);
  };

  return (
    <div>
      <select onChange={handleSelectChange}>
        <option value="">Shapes</option>
        <option value="circle">Circle</option>
        <option value="rectangle">Rectangle</option>
        <option value="triangle">Triangle</option>
      </select>
    </div>
  );
};

export default ShapesMenu;
