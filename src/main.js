import './style.css';

const stageData = [
  { status: 'Visão final', product: 'Sapato social', kicker: 'A forma final', title: 'O social como destino', detail: 'O sapato social define a linguagem da experiência. Acompanhe a montagem do sapato social e a precis\u00e3o que cada material precisa entregar.' },
  { status: 'Solado destacado', product: 'Solado', kicker: 'Estrutura', title: 'O solado sustenta a ideia', detail: 'Solados para calçados sociais com diferentes acabamentos e composições. A disponibilidade e as opções devem ser confirmadas pelo WhatsApp.' },
  { status: 'Palmilha destacada', product: 'Palmilha', kicker: 'Conforto', title: 'A palmilha encontra o pé', detail: 'A palmilha participa do conforto e da estrutura interna do calçado. Consulte os modelos disponíveis para sua produção.' },
  { status: 'Cola aplicada', product: 'Cola para montagem', kicker: 'União', title: 'A cola aproxima as partes', detail: 'Colas e adesivos para a montagem de calçados. As características técnicas e a disponibilidade são informadas pela equipe.' },
  { status: 'Cabedal em produção', product: 'Couro ou sintético para cabedal', kicker: 'Cabedal', title: 'Cortar. Produzir. Costurar.', detail: 'Couro e materiais sintéticos para o cabedal, apresentados na sequência de corte, preparação e costura.' },
  { status: 'Embalagem final', product: 'Cadarço e caixa de sapatos', kicker: 'Acabamento', title: 'Pronto para entrar em cena', detail: 'Cadarços e caixas de sapatos completam a apresentação. A embalagem também é um produto fornecido pela loja.' },
];

const video = document.querySelector('#story-video');
const clipDurations = [0.084, 0.534, 0.386, 0.591, 0.956, 1.758];
const clipsTotalDuration = clipDurations.reduce((total, duration) => total + duration, 0);
const sceneStatus = document.querySelector('#scene-status');
const liveIndex = document.querySelector('#live-index');
const liveKicker = document.querySelector('#live-kicker');
const liveTitle = document.querySelector('#live-title');
const liveCopy = document.querySelector('#live-copy');
const liveMore = document.querySelector('#live-more');
const liveStory = document.querySelector('.live-story');
const steps = [...document.querySelectorAll('.story-step')];
const detailDialog = document.querySelector('#detail-dialog');
const dialogKicker = document.querySelector('#dialog-kicker');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
let activeStep = 0;
let renderedStep = -1;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let videoReady = false;
let scrollFrame = 0;

function syncVideoToScroll() {
  scrollFrame = 0;
  if (!videoReady || !Number.isFinite(video.duration) || !steps.length) return;
  let step = 0;
  for (let index = 1; index < steps.length; index += 1) {
    const top = steps[index].getBoundingClientRect().top + window.scrollY;
    if (window.scrollY >= top) step = index;
    else break;
  }
  const stepTop = steps[step].getBoundingClientRect().top + window.scrollY;
  const nextTop = step < steps.length - 1
    ? steps[step + 1].getBoundingClientRect().top + window.scrollY
    : stepTop + steps[step].getBoundingClientRect().height;
  const progress = Math.min(1, Math.max(0, (window.scrollY - stepTop) / Math.max(1, nextTop - stepTop)));
  if (activeStep !== step) {
    activeStep = step;
    applyStage(step);
  }
  const segmentStart = clipDurations.slice(0, step).reduce((total, duration) => total + duration, 0);
  const segmentDuration = clipDurations[step];
  const normalizedStart = segmentStart / clipsTotalDuration;
  const normalizedDuration = segmentDuration / clipsTotalDuration;
  const targetTime = Math.min(
    Math.max(0, video.duration - 0.05),
    video.duration * (normalizedStart + normalizedDuration * progress),
  );
  if (Math.abs(video.currentTime - targetTime) > 0.04) video.currentTime = targetTime;
}

function requestVideoSync() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(syncVideoToScroll);
}

function applyStage(step) {
  if (renderedStep !== step && !reducedMotion) {
    liveStory.classList.remove('is-changing');
    void liveStory.offsetWidth;
    liveStory.classList.add('is-changing');
  }
  sceneStatus.textContent = stageData[step].status;
  liveIndex.textContent = `${String(step + 1).padStart(2, '0')} / 06`;
  liveKicker.textContent = stageData[step].kicker;
  liveTitle.textContent = stageData[step].title;
  liveCopy.textContent = stageData[step].detail;
  liveMore.dataset.detail = String(step);
  steps.forEach((item, index) => item.classList.toggle('is-active', index === step));
  renderedStep = step;
}

video.addEventListener('loadedmetadata', () => {
  videoReady = true;
  requestVideoSync();
});
window.addEventListener('scroll', requestVideoSync, { passive: true });
window.addEventListener('resize', requestVideoSync);
applyStage(0);
requestVideoSync();

document.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => { const data = stageData[Number(button.dataset.detail)]; dialogKicker.textContent = data.kicker; dialogTitle.textContent = data.title; dialogCopy.textContent = data.detail; detailDialog.showModal(); }));
document.querySelector('.dialog-close').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => { if (event.target === detailDialog) detailDialog.close(); });
