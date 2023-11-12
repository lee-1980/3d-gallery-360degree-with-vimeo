
import ImageQuery from './ImageQuery';
import Carousel3D from './Carousel3D'

import './style.css'

const API_KEY = "20524329-a56f712174c95d9a33f77f075";

let currentImageSet:any = [];

// Init 3D Carousel
const carousel = new Carousel3D();

// Init image query service
const iq = new ImageQuery(API_KEY)

// Setup image input element
const imageInput = document.querySelector('.image-input') as HTMLInputElement;
imageInput!.addEventListener('change', () => {

  iq.query(imageInput.value, (data) => {

    currentImageSet = data.hits;
    const imgSet = currentImageSet.map((it:any) => it.webformatURL);
    if (currentImageSet[0]) carousel.loadImageSet(imgSet);
  });
});

// Select all text on click
imageInput.addEventListener('click', () => {
  imageInput.select();
});

// Start rotation animation
carousel.startAnimate();

