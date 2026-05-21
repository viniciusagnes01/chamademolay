const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
    }
  });
},{threshold:0.12});
reveals.forEach(el=>observer.observe(el));

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if(toggle){
  toggle.addEventListener('click', ()=>{
    nav.classList.toggle('open');
  });
}

const links = document.querySelectorAll('.nav a');
links.forEach(link=>{
  link.addEventListener('click', ()=>{
    nav.classList.remove('open');
  });
});

window.addEventListener('scroll', ()=>{
  const topbar = document.querySelector('.topbar');
  if(window.scrollY > 30){
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
});