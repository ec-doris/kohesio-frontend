export interface Category {
  value: string;
  options: any[];
};

export const filterCategory = (options: any[], value: any): string[] => options.filter(
  item => {
    let search = '';
    if (typeof value === 'string') {
      search = value;
    } else {
      search = value?.value;
    }

    return item.value.toLowerCase()
      .includes(search.toLowerCase());
  }
);
