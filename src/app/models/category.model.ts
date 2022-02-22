export interface Category {
  value: string;
  options: any[];
};

export const filterCategory = (options: any[], search: any): string[] => options.filter(
  item => item.value.toLowerCase()
    .includes(search.value.toLowerCase())
);
