import Category from '../db-files/models/Category';

const checkIfCategoryExists = async(
  options: { name?: string, id?: string },
): Promise<Category | null> => {
  const { name, id } = options;
  const query: { [key: string]: string } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }

  const category = await Category.findOne({ where: query });
  return category; // Return the category object or null
};

export default  checkIfCategoryExists ;
