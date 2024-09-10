import React from 'react';
import { Chip, Box } from '@mui/material';

const CategoryChips = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <Chip
        label="ALL"
        onClick={() => onSelectCategory("")}
        color={selectedCategory === "" ? "primary" : "default"}
        variant={selectedCategory === "" ? "filled" : "outlined"}
      />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          onClick={() => onSelectCategory(category)}
          color={selectedCategory === category ? "primary" : "default"}
          variant={selectedCategory === category ? "filled" : "outlined"}
        />
      ))}
    </Box>
  );
};

export default CategoryChips;