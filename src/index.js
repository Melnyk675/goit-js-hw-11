import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getData } from './js/api';

let page = 1;
let per_page = 40;
let searchSubmit = '';
let isLoading = false;

const searchForm = document.querySelector('#search-form');
const imagesList = document.querySelector('.gallery');
let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const handleSubmit = e => {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  if (searchSubmit === value || !value.trim()) {
    return;
  }
  searchSubmit = value.trim();
  page = 1;
  imagesList.innerHTML = '';
  console.log(
    `New search query: ${searchSubmit}, page: ${page} and ${per_page}`
  );
  isLoading = false;
  getImages();


  if (searchSubmit !== '') {
    return; 
  } else 
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
};

searchForm.addEventListener('submit', handleSubmit);

const renderImages = data => {
  const newImagesList = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
            <a href="${largeImageURL}" class="link overlay"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
              <p class="info-item">           
                <b>likes </b>${likes}
              </p>
              <p class="info-item">
                <b>views </b>${views}
              </p>
              <p class="info-item">
                <b>comments </b>${comments}
              </p>
              <p class="info-item">
                <b>downloads </b>${downloads}
              </p>
            </div>
          </div>`
    )
    .join('');

  if (!page) {
    imagesList.innerHTML = '';
  }
  imagesList.insertAdjacentHTML('beforeend', newImagesList);
  lightbox.refresh();
  if (imagesList.children.length >= data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  isLoading = false;
};

async function getImages() {
  if (isLoading) return;
  isLoading = true;
  console.log(`Fetching images for query: ${searchSubmit}, page: ${page}`);
  
  try {
    const data = await getData(searchSubmit, page, per_page);
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
      if (page === 1)
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      renderImages(data);
    }catch(error) {
      console.error('you get this error:', error);
    }
}


window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (isLoading) return;
    page += 1;
    getImages();
  }
});
