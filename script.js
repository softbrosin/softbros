// header

const humberger = document.querySelector('.menu__icon');
const navLinks = document.querySelector('.nav-links');
humberger.addEventListener('click', () => {
    humberger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

const main = document.querySelector('main');
main.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) humberger.click();
});


// reveal
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.1 // Adjust as needed
    });

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Back-top-top

const header = document.querySelector('header');

function scrollup() {
    header.scrollIntoView();
}