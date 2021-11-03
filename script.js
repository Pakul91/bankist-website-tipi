'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
//----butons---
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
//---sections/locations---
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
/////////////////////////////////////////////////

//===Modal window===
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//===Button scrolling===
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//===Page Navigation===
////Good, but not efficient way (in case of multiple elements)
// document.querySelectorAll('.nav__link').forEach(function (el, i) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
// // Event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event. 'e.target' is a perfect tool for it

//=========== EVENT DELEGATION  ==============
document.querySelector(`.nav__links`).addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains(`nav__link`)) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//=========== TABBED COMPONENT  ==============

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  //Picking the clicked element closest parent element containing '.operations__tab' class
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //setting all tabs to inactive state
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  //adding 'active' state to the clicked tab
  clicked.classList.add('operations__tab--active');

  //setting all tabs to inactive state
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Activate the matching content tab
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//=========== MENU FADE ANIMATION  ==============

//Callback function for event handlers
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    //selecting the target we hoovering over
    const link = e.target;
    //selecting all the sibling element
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    //selecting logo element
    const logo = link.closest('.nav').querySelector('img');

    //setting opacity to 50%
    siblings.forEach(el => {
      //for each element which is no the one we hoovering over
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//-----USING .BIND TO PAS AN ARGUMENT----
//The '.bind' returns a new function. By setting an "argument" in it we are setting a new '.this' keyword inside the function
// '0.5' and '1' will become new '.this' keyword

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//=========== STICKY NAVIGATION  ==============

// // ---USING SCROLL EVENT---
// // initalCoords will indicates to position of the element relative to the vieport
// const initialCoords = section1.getBoundingClientRect();

// //Scrolling event is avaiable on the window element
// window.addEventListener('scroll', function (e) {
//   //window.scrollY will indicate the distance from the top of the vieport to the top of the webPage
//   // console.log(window.scrollY);
//   // If the position of scrollY (so the place we are actually scrolling) is bigger then the distance of the top of section1 to the top of the page. Then the 'Sticky'class will be added to the 'nav' bar. Otherwise it will be removed.
//   if (window.scrollY > initialCoords.top) nav.classList.add(`sticky`);
//   else {
//     nav.classList.remove(`sticky`);
//   }
// });
//---USING INTERSECTION OBSERVER---
//'.getBoudingClientRect()' will return and object with multiple properties such as size of the element. From there we can select a specific property we are interested in.
const navHeight = nav.getBoundingClientRect().height;

const headerObserverCallback = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(headerObserverCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //The box that will be applied outside/inside the target element. In px.
});
headerObserver.observe(header);

//=========== REVEALING ELEMENT ON SCROLL ==============
// Add

// 'allSections' will select all of the sections we are interested in
const allSections = document.querySelectorAll('.section');
// Callback function
const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard Clausure .Checking if entry '.isIntersecting' is false
  if (!entry.isIntersecting) return;
  // enetering the 'entry', selecting '.target' property and removing 'section--hiden' class from it
  entry.target.classList.remove('section--hidden');
  // Cancelling the observation on the element
  observer.unobserve(entry.target);
};
// Options Array
const revealOptions = {
  root: null, //viewport
  threshold: 0.15,
};
// Setting up observer
const sectionObserver = new IntersectionObserver(revealSection, revealOptions);
// Applying abserver and adding 'section--hidden' class to all sections
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//=========== LAZY IMGAGE LOADING ==============
// For  the better performance we can initially load the low-resolution img so the page loads faster. And ones we reach given img we can re-load it to teh higher-resolution one. To do so we need to assing special data attribute in HTML to store url to the big-res immage.

//selecting all img with 'data-src' atribute
const imgTargets = document.querySelectorAll('img[data-src]');
//Callback function
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //In this case we are adding event listerner waiting for 'load' event to ensure that the lazy-img class is removed only when the big-size img is fully LOADED. That prewents to small-size img to be displayed
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');

    // unoserving the targer
    observer.unobserve(entry.target);
  });
};
//Setting an observer

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
//Applying .observe to each img
imgTargets.forEach(img => imgObserver.observe(img));

//=========== SLIDER ==============

const slider = function () {
  // --------- VARIABLES ----------------

  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // curSlide will track which slide we are currently looking at
  let curSlide = 0;
  // Sets the limit of slides
  const maxSlide = slides.length;

  // --------- FUNCTIONS ----------------

  //FUNCTION TO CREATE DOT FOR EACH SLIDE
  const createDots = function () {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    );
  };

  //FUNCTION TO ACTIVATE 1ST DOT
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    //selecting element with specyfic class and attibute
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //FUNCTION TO CHANGE SLIDES
  const goToSlide = function (currentSlide) {
    slides.forEach(
      // Adding 'translateX()' to the slides so they will position themselfes one next to eachother. The template literal is used to determinate what % of translation will be assinged to specific slide

      // Applying new translation in X. The logic is to keep the  slide we wont to look at  0% translation.
      (s, i) => (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
    );
  };

  //NEXT SLIDE FUNCTION
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      //When we reach the last slide the curSlide will be atomaticly set to 0
      curSlide = 0;
    } else {
      //Incresing curSlide position
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //PREVIOUS SLIDE FUNCTION
  const prevSlide = function () {
    if (curSlide === 0) {
      //When the curSlide is 0 the it will be changed to the last one
      curSlide = maxSlide - 1;
    } else {
      //decreasing curSlide position
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // --------- INITIALIZATION ----------------

  const init = function () {
    //Creating dots
    createDots();
    //Activating 1st dot
    activateDot(0);
    //Setting the slides in the starting position
    goToSlide(0);
  };
  init();

  // --------- EVENTS ----------------

  //Going to the next slide (right/left). When Clicked on the arrow button.
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //Going to the next slide (right/left). When arrow key (on keyboard) is pressed
  document.addEventListener('keydown', function (e) {
    //if statement
    if (e.key === 'ArrowRight') nextSlide();
    //short circuiting
    e.key === 'ArrowLeft' && prevSlide();
  });

  //clicking on the dot
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////////////////////////////
// //============= THE INTERSECION OBSERVER API ================
//Callback function to be passed to IntersectionObserver
//This function will be called every time when observed element will intersect the root element at the threshold that we defined.
// 'entries' is an array of 'treshold' entries.
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// //Option object to be passed to IntersectionObserver
// const obsOptions = {
//   root: null, // the element we want our target (setcion1) to intersect with. null= entire viewport
//   threshold: [0, 0.2], //the percentage of the intersecion when the callback will be called
// };
// //creating a new observer and assigning it to a variable
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// //Using .observe method on the variable with a target as an argument
// observer.observe(section1);
//////////////////////////////////////////////////////////
// SELECTING , CREATING AND DELETING ELEMENTS IN DOM

// //=============SELECTING ELEMENTS================
// //Selecting the whole document, head, body.
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// //Selectiong element using its class
// const header = document.querySelector('.header');
// //Selecting all of the elements with the same class. Returns NodeLIst
// document.querySelectorAll('.section');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);
// //Selecting  element using its ID
// document.getElementById('section--1');
// //Selecting all the elements with specyfic Tag. Returns HTMLCollection
// document.getElementsByTagName('button');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// //Selecting all elements with the same class. Returns HTMLCollection
// document.getElementsByClassName('btn');
// console.log(document.getElementsByClassName('btn'));

// //=============CREATING AND INSERTING ELEMENTS================
// // Creating/pasting the whole HTML section/element using .insertAdjacentHTML. The position wil idicate where the text will be placed: 'beforebegin', 'afterbegin', 'beforeend','afterend'. The 'text' can be inserted manualy as an argument, or we can pass a variable insted

// //"element".insertAdjacentHTML(position, text)

// //Creating specyfic element. Tag name has to be passed. Creates element but will not insert it anywhere.
// const message = document.createElement('div');
// //// Adding class to it
// message.classList.add('cookie-message');
// //// Adding text to it
// // message.textContent =
// //   'We use cookies for improved functionality and analytisc.';
// //// Adding HTML
// message.innerHTML =
//   'We use cookies for improved functionality and analytisc. <button class="btn btn--close-cookie">Got it!<button>';

// //Adding message to the header element as its first child
// header.prepend(message);
// //Adding message to the header element as its last child. It will move message instead copying it as 1 element can be only in 1 place at a time.
// header.append(message);

// //Copying message element and apending it.
// // header.append(message.cloneNode(true));

// //Adding message BEFORE header element
// header.before(message);

// //Adding message AFTER header element
// header.after(message);

// //removing message after clicking the 'Got it!' btn using ".remove()"

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();

//     //// The old way
//     // message.parentElement.removeChild(message);
//   });
// //// The old way

// //////////////////////////////////////////////////////////
// // STYLES. ATTRIBUTES AND CLASSES

// //=============STYLES================

// //Setting style on the element. element.style.'property name(usingcamelCase)' = 'string with the value'
// message.style.backgroundColor = '#37383d';
// message.style.width = '100%';

// //We can read style which we've set this way using 'normal' way
// console.log(message.style.backgroundColor);

// // Reading styles defined in CSS sheet
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// //Retrieving style from the sheed and editing it
// //Number.parseFloat is used to retrive the number from the string
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// //=========== CSS CUSTOM PROPETIES/ CSS VARIABLES ==============
// // :root{} in CSS is equivalent of document in js

// //Changing the value of --color-primary CSS Variable(1st argument) to 'orangered'(2nd argument) so it will affect every element containing this property.
// document.documentElement.style.setProperty('--color-primary', 'orengered');

// //=========== HTML ATTRIBUTES ==============

// //accesing attributes. Works only on 'standard' properties.
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src); //getting absolute src
// console.log(logo.getAttribute('src')); //getting relative src
// console.log(logo.className);
// // Setting/changing attribute
// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer); //return undefined
// // Retrieving non-standard attributes
// console.log(logo.getAttribute('designer'));
// // Setting non-standard attributes. 1st atr name 2nd value
// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');

//=========== SCROLLING ==============

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.getElementById('section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   //.getBoundingClientRect will retrive the position of desired element. Relative to the viewport - the visible part of the web-page.
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   //Displaying coordinates of the button while scrooling to diferent positions
//   console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

//   //Vieport sizes
//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );
//   //---Scrolling---
//   //.scrollTo is taking coordinetes from s1coord variable and check the 'left' and 'top' coordinates. Adding actuall pageX/YOffse will allow to scroll by correct amount

//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // Scrolling smoothly
//   // We need to create an obj inside of the .scrollTo() method. Inside that object we need to specify the position from the left and top, and also teh 'behavior' i.e if it will scroll smoothly or just jump
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   //New simple way
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

//=========== EVENTS ==============

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');

//   //removing the event listener. The callback function has to be defined outside
//   h1.removeEventListener('mouseenter', alertH1);
// };

// // 'mouseenter' work same way as :hoover in CSS. i.e every time mouse enters certian area
// h1.addEventListener('mouseenter', alertH1);
//I can add an event listener direcly to the element by adding so called 'on event property'. (the old way)

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

// //=========== BUBBLING AND CAPTURING  / PROPAGATION ==============

// //rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

//   //Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// //If we set third parameter of the event handler to true it will execute to code during caputring faze instead of bubbling faze.
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// );
//=========== DOM TRAVERSING  ==============

// const h1 = document.querySelector('h1');

// //------Going downwards : child------
// // The .querySelector() will work with all of the children of to selected element, but not with siblings or parents
// console.log(h1.querySelectorAll('.highlight'));
// //Checking direct children
// console.log(h1.childNodes);
// console.log(h1.children);
// //First and last element child. Changing styles
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'black';

// //------Going upwards : parent------

// //Direct parent.
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //Closest parent with given name.  Changing bgColor using CSS variable
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //------Going sideways : siblings------
// //Accesing direct siblings. Return element
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// // Accesing direct siblings. Return nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // To acces all of the siblings we need to go up to the parent element and then we will have acces to all its children
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (e) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

//=========== LIFECYCLE DOM EVENTS  ==============

//LIFCYCLE EVENT OCCURS FROM THE MOMENT WHEN THE PAGE IS ACCESED TILL USERV LEAVES IT

//'DOMContentLoaded' will wait till all HTML and JavaScript is loaded.
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});
//'load' will wait till all page is loaded including HTML, JavaScript, images etc. 'load' is called on window
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// //'beforeunload' is called immiedlately before client leaves the pega. I.e when user clicks on 'x' button. Used to create a pop-up with generic message before leaving the page. It is called on window
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   // '' empty string has to be returnet as value on event
//   e.returnValue = '';
// });

//=========== EFFICIENT SCRIPT LOADING: DEFER AND ASYNC ==============
