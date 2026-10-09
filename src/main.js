import './style.css';

const stageData = [
  { product: 'Sapato social', kicker: 'Inspiração', title: 'Sapato social', detail: 'Uma referência de calçado social para apresentar combinações de materiais e acabamentos.', image: '/Imagem01.png', imageAlt: 'Sapato feminino elegante e materiais para fabricação de calçados' },
  { product: 'Solado', kicker: 'Solados', title: 'Solados para calçados sociais', detail: 'Conheça opções de solados para diferentes projetos de calçados sociais. Consulte modelos e disponibilidade com a equipe.', image: '/Imagem02.png', imageAlt: 'Diferentes solados para fabricação de calçados femininos' },
  { product: 'Palmilha', kicker: 'Palmilhas', title: 'Palmilhas para calçados', detail: 'Palmilhas para compor a parte interna do calçado. Fale com a equipe para consultar opções disponíveis.', image: '/imagem03.png', imageAlt: 'Palmilhas para diferentes modelos de calçados femininos' },
  { product: 'Cola para montagem', kicker: 'Colas e adesivos', title: 'Colas para montagem de calçados', detail: 'Colas e adesivos usados na montagem de calçados. Consulte a equipe sobre características técnicas e disponibilidade.', image: '/MuralConceitual.png', imageAlt: 'Mural de calçados, couros e materiais para montagem' },
  { product: 'Couro ou sintético para cabedal', kicker: 'Materiais para cabedal', title: 'Couro e materiais sintéticos', detail: 'Materiais para compor o cabedal de calçados. Consulte a equipe para saber quais opções estão disponíveis.', image: '/MuralConceitual.png', imageAlt: 'Mural de couros e calçados em diferentes acabamentos' },
  { product: 'Cadarço e caixa de sapatos', kicker: 'Acessórios e embalagens', title: 'Cadarços e caixas para calçados', detail: 'Detalhes e embalagens para completar a apresentação dos seus calçados. Consulte modelos e disponibilidade.', image: '/MuralCSaparosDiversos.png', imageAlt: 'Composição com diversos modelos de calçados e acessórios' },
];

const carousel = document.querySelector('[data-carousel]');
const viewport = document.querySelector('#carousel-viewport');
const track = document.querySelector('#carousel-track');
const dots = document.querySelector('[data-carousel-dots]');
const previousButton = document.querySelector('[data-carousel-prev]');
const nextButton = document.querySelector('[data-carousel-next]');
const detailDialog = document.querySelector('#detail-dialog');
const dialogKicker = document.querySelector('#dialog-kicker');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
const dialogWhatsapp = document.querySelector('#dialog-whatsapp');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let activeStep = 0;
let autoplayTimer = 0;
let isPaused = reducedMotion;
let isCarouselVisible = true;

function renderCards() {
  track.innerHTML = stageData.map((item, index) => `
    <article class="carousel-card${index === 0 ? ' is-active' : ''}" data-step="${index}" aria-labelledby="card-title-${index}">
      <div class="card-visual"><img src="${item.image}" alt="${item.imageAlt}" loading="lazy" /></div>
      <div class="card-content">
        <p class="step-kicker">${item.kicker}</p>
        <h3 id="card-title-${index}">${item.title}</h3>
        <p>${item.detail}</p>
        <strong class="card-product">${item.product}</strong>
        <button class="more-button" data-detail="${index}">Saiba mais <span>↗</span></button>
      </div>
    </article>
  `).join('');

  dots.innerHTML = stageData.map((item, index) => `
    <button type="button" class="carousel-dot${index === 0 ? ' is-active' : ''}" data-carousel-dot="${index}" aria-label="Selecionar produto ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
  `).join('');
}

function updateActiveStep(step, announce = true) {
  activeStep = Math.max(0, Math.min(step, stageData.length - 1));
  [...track.children].forEach((card, index) => card.classList.toggle('is-active', index === activeStep));
  [...dots.children].forEach((dot, index) => {
    const isActive = index === activeStep;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', String(isActive));
  });
}

function scrollToStep(step, behavior = reducedMotion ? 'auto' : 'smooth') {
  const target = track.children[step];
  if (!target) return;
  viewport.scrollTo({ left: target.offsetLeft - (viewport.clientWidth - target.clientWidth) / 2, behavior });
  updateActiveStep(step);
}

function restartAutoplay() {
  window.clearTimeout(autoplayTimer);
  if (isPaused || !isCarouselVisible) return;
  autoplayTimer = window.setTimeout(() => {
    const nextStep = activeStep === stageData.length - 1 ? 0 : activeStep + 1;
    scrollToStep(nextStep);
    restartAutoplay();
  }, 5000);
}

function pauseAutoplay() {
  window.clearTimeout(autoplayTimer);
}

renderCards();
updateActiveStep(0, false);
restartAutoplay();

const cardObserver = new IntersectionObserver((entries) => {
  const visibleCard = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visibleCard) updateActiveStep(Number(visibleCard.target.dataset.step));
}, { root: viewport, threshold: [0.55, 0.8] });
 [...track.children].forEach((card) => cardObserver.observe(card));

carousel.addEventListener('mouseenter', pauseAutoplay);
carousel.addEventListener('mouseleave', restartAutoplay);
carousel.addEventListener('focusin', pauseAutoplay);
carousel.addEventListener('focusout', (event) => { if (!carousel.contains(event.relatedTarget)) restartAutoplay(); });
viewport.addEventListener('pointerdown', pauseAutoplay, { passive: true });
viewport.addEventListener('pointerup', () => { if (!isPaused) restartAutoplay(); }, { passive: true });
viewport.addEventListener('pointercancel', () => { if (!isPaused) restartAutoplay(); }, { passive: true });
viewport.addEventListener('scrollend', () => { if (!isPaused) restartAutoplay(); }, { passive: true });
viewport.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') { event.preventDefault(); scrollToStep((activeStep + 1) % stageData.length, 'auto'); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); scrollToStep((activeStep - 1 + stageData.length) % stageData.length, 'auto'); }
  if (event.key === 'Home') { event.preventDefault(); scrollToStep(0, 'auto'); }
  if (event.key === 'End') { event.preventDefault(); scrollToStep(stageData.length - 1, 'auto'); }
});
previousButton.addEventListener('click', () => { scrollToStep((activeStep - 1 + stageData.length) % stageData.length); restartAutoplay(); });
nextButton.addEventListener('click', () => { scrollToStep((activeStep + 1) % stageData.length); restartAutoplay(); });
dots.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-carousel-dot]');
  if (!dot) return;
  scrollToStep(Number(dot.dataset.carouselDot));
  restartAutoplay();
});

const visibilityObserver = new IntersectionObserver(([entry]) => {
  isCarouselVisible = entry.isIntersecting;
  if (isCarouselVisible) restartAutoplay();
  else pauseAutoplay();
}, { threshold: 0.2 });
visibilityObserver.observe(carousel);
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAutoplay(); else restartAutoplay(); });

function openDetail(index) {
  const data = stageData[index];
  if (!data) return;
  dialogKicker.textContent = 'Produto';
  dialogTitle.textContent = data.title;
  dialogCopy.textContent = data.detail;
  dialogWhatsapp.href = `https://api.whatsapp.com/send/?phone=%2B556281598510&text=${encodeURIComponent(`Olá! Vi o produto "${data.product}" no site da Território do Couro. Você pode me informar a disponibilidade e o preço?`)}&type=phone_number&app_absent=0`;
  pauseAutoplay();
  detailDialog.showModal();
}

track.addEventListener('click', (event) => {
  const button = event.target.closest('[data-detail]');
  if (button) openDetail(Number(button.dataset.detail));
});
document.querySelector('.dialog-close').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('close', () => { if (!isPaused && isCarouselVisible) restartAutoplay(); });
detailDialog.addEventListener('click', (event) => { if (event.target === detailDialog) detailDialog.close(); });
