import Brand from '../db-files/models/Brand';
const checkIfBrandExists = async(
  options: { name?: string, id?: string },
): Promise<Brand | null> => {
  const { name, id } = options;
  const query: { [key: string]: string } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }
  const existingBrand = await Brand.findOne({ where: query });
  return existingBrand;
};

export {
  checkIfBrandExists,
};
