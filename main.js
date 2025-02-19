const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { LocalStorage } = require('node-localstorage');

const dom = new JSDOM(`<!DOCTYPE html><body><div id="time"></div><div id="greeting"></div><div id="name"></div><div id="focus"></div><div id="content"></div><div id="author"></div></body>`, {
  url: "http://localhost"
});

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = new LocalStorage('./scratch');

// Mocks
global.Swal = {
  mixin: () => ({
    queue: () => Promise.resolve({ value: ['Test Name', 'Test Focus'] }),
    fire: () => {}
  })
};

global.axios = {
  get: () => Promise.resolve({
    data: {
      content: 'Test quote content',
      author: 'Test author'
    }
  })
};

// Your existing code starts here
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
const focus = document.getElementById('focus');
const content = document.getElementById('content');
const author = document.getElementById('author');

function showTime() {
  let today = new Date(),
      hour = today.getHours(),
      min = today.getMinutes(),
      sec = today.getSeconds();

  const amPm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} ${amPm}`;

  setTimeout(showTime, 1000);
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function setBg() {
  let hour = new Date().getHours();

  if (hour < 12) {
    greeting.textContent = 'Good Morning, ';
  } else if (hour < 18) {
    greeting.textContent = 'Good Afternoon, ';
  } else {
    greeting.textContent = 'Good Evening, ';
  }
}

function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

if (localStorage.getItem('name') === null && localStorage.getItem('focus') === null) {
  Swal.mixin({}).queue([]).then((result) => {
    if (result.value) {
      localStorage.setItem('name', result.value[0]);
      localStorage.setItem('focus', result.value[1]);
    }
  });
}

axios.get('https://api.quotable.io/random').then(res => {
  content.textContent = res.data.content;
  author.textContent = res.data.author;
});

showTime();
setBg();
getName();
getFocus();

console.log('Script executed successfully');
