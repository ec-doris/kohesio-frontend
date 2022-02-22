export interface Category {
  value: string;
  options: any[];
};

export const filterCategory = (options: any[], value: string): string[] => options.filter(
  item => item.value.toLowerCase()
    .includes(value.toLowerCase())
);
