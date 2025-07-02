import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import categories from '../../Pages/BrandCategory/BrandCategory';

const CategorySelector = ({ category, setCategory }) => {
  const [subSubCategory, setSubSubCategory] = useState('');
  const [subSubOptions, setSubSubOptions] = useState([]);

  useEffect(() => {
    const subSubCats = [];

    categories.forEach(main => {
      if (Array.isArray(main.children)) {
        main.children.forEach(sub => {
          if (typeof sub === 'string') return; // Skip if sub is a string
          if (Array.isArray(sub.children)) {
            sub.children.forEach(subsub => {
              subSubCats.push({
                label: subsub,
                fullPath: `${main.name} > ${sub.name} > ${subsub}`,
              });
            });
          }
        });
      }
    });

    setSubSubOptions(subSubCats);
  }, []);

  useEffect(() => {
    const selected = subSubOptions.find(item => item.label === subSubCategory);
    if (selected) {
      setCategory(selected.fullPath);
    } else {
      setCategory('');
    }
  }, [subSubCategory, subSubOptions, setCategory]);

  return (
    <Stack direction="row" spacing={2}>
      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={subSubCategory}
          onChange={(e) => setSubSubCategory(e.target.value)}
          label="Sub-Sub Category"
        >
          <MenuItem value="">All</MenuItem>
          {subSubOptions.map((item) => (
            <MenuItem key={item.fullPath} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default CategorySelector;
