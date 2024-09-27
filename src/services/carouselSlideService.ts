import CarouselSlide from '../db-files/models/CarouselSlide';

const checkIfCarouselSlideExists = async(options: { id?: string }) => {
  const { id } = options;
  const query: { [key: string]: string } = {};

  if (id) {
    query.id = id;
  }

  const carouselSlide = await CarouselSlide.findOne({ where: query });
  return carouselSlide; // Return the carousel slide object or null
};

const checkIfSlideOrderExists = async(slideOrder: number): Promise<boolean> => {
  const existingSlide = await CarouselSlide.findOne({ where: { slideOrder } });
  return existingSlide !== null;
};

const checkIfSlideTitleExists = async(title: string): Promise<boolean> => {
  const existingSlide = await CarouselSlide.findOne({ where: { title } });
  return existingSlide !== null;
};

const caroselSlideResponseFormatter = (
  caroselSlide: CarouselSlide,
): object => {
  const responseObject: { [key: string]: string | number | boolean | undefined } = {};
  responseObject.title = caroselSlide.title;
  responseObject.description = caroselSlide.description;
  responseObject.slideOrder = caroselSlide.slideOrder;
  responseObject.imagePath = caroselSlide.imagePath;
  responseObject.category = caroselSlide.categoryName;
  responseObject.brand = caroselSlide.brandName;
  return responseObject;
};

export  { checkIfSlideOrderExists , checkIfCarouselSlideExists ,
  checkIfSlideTitleExists , caroselSlideResponseFormatter };
