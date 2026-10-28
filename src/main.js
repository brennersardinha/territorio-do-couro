import './style.css';

const WHATSAPP_NUMBER = '556281598510';

// Links de WhatsApp com mensagem pronta, definida em data-wa no HTML.
document.querySelectorAll('[data-wa]').forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(link.dataset.wa)}`;
});

const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const waFloat = document.querySelector('.wa-float');
const hero = document.querySelector('.hero');

// Menu mobile
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

// Sombra no cabeçalho ao rolar
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Botão flutuante do WhatsApp aparece depois do hero
new IntersectionObserver(([entry]) => {
  waFloat.classList.toggle('is-visible', !entry.isIntersecting);
}, { threshold: 0.1 }).observe(hero);

// Animação de entrada das seções
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('[data-year]').textContent = new Date().getFullYear();
