const time = document.getElementById('time'),
    greeting = document.getElementById('greeting'),
    name = document.getElementById('name'),
    focus = document.getElementById('focus'),
    content = document.getElementById('content'),
    author = document.getElementById('author');

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
        document.body.style.backgroundImage = 'url(images/morning.jpg)';
        greeting.textContent = 'Good Morning, ';
    } else if (hour < 18) {
        document.body.style.backgroundImage = 'url(images/afternoon.jpg)';
        greeting.textContent = 'Good Afternoon, ';
    } else {
        document.body.style.backgroundImage = 'url(images/night.jpg)';
        greeting.textContent = 'Good Evening, ';
        document.body.style.color = 'white';
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
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        progressSteps: ['1', '2']
    }).queue([
        {
            title: 'Your Name'
        },
        {
            focus: 'Your Focus'
        }
    ]).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'All done!',
                html: `
              <p>Your Name: ${result.value[0]}</p>
              <p>Your Focus: ${result.value[1]}</p>
            `,
                confirmButtonText: 'Lovely!'
            })

            localStorage.setItem('name', result.value[0]);
            localStorage.setItem('focus', result.value[1]);
        }
    })
}

axios.get('https://api.quotable.io/random').then(res => {
    content.textContent = res.data.content;
    author.textContent = res.data.author;
});

showTime();
setBg();
getName();
getFocus();