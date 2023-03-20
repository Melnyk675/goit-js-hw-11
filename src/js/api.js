
import axios from 'axios';
export const getData = async (searchSubmit, page, per_page) => {
  const API_KEY = '34414398-5d6fc8cc69c48610553b5888c';
  console.log(
    `IN FETCH search query: ${searchSubmit}, page: ${page} and ${per_page}`
  );
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchSubmit}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error('Error loading images from Pixabay:', error);
    throw new Error('Error loading images from Pixabay');
  }
};
