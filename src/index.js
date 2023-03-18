import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const galleryEL = document.querySelector('.gallery');
const btnLoadMoreEl = document.querySelector('.load-more');

let page = 1; 

formEl.addEventListener('submit', onFormSubmit);
btnLoadMoreEl.addEventListener('click', onLoadMoreClick);


function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  const search = inputEl.value.trim();

  if (search) {
    clearMarkup();
    generateMarkup(search);
  } else
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
}

function onLoadMoreClick() {
  const search = inputEl.value.trim();
  page += 1;
  generateMarkup(search);
  console.log(search);
}

async function getPosts(search) {
  const key = '34414398-5d6fc8cc69c48610553b5888c';
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  const perPage = 40;
  const API_URL = `https://pixabay.com/api/?key=${key}&q=${search}&image_type=${imageType}&orientation=${orientation}&safesearch=${safesearch}&per_page=${perPage}&page=${page}`;
    
  try {
    const response = await axios.get(API_URL);
    const data = response.data.hits;
    total += response.data.hits.length;
    if (data.length !== 0) {
      showLoadMoreBtn();
    }
    if (response.data.totalHits <= total || response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      hidesLoadMoreBtn();

      console.log(response.data.totalHits);
  }
  console.log(total);
  console.log(response.data.totalHits);
  return data;
} catch (error) {
} finally 
{
}
}

function createMarkup(arr) {
  const markup = arr.hits
    .map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}">
            <div class="photo-card">
            <div class="photo">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
            </div>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            ${item.likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            ${item.views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            ${item.comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            ${item.downloads}
                        </p>
                    </div>
            </div>
        </a>`
    )
    .join(''); 
  refs.gallery.insertAdjacentHTML('beforeend', markup); 
  simpleLightBox.refresh(); 
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', 
  captionDelay: 250, 
});


