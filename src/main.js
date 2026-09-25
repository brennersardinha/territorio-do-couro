import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import './style.css';

const stageData = [
  { status: 'Visão final', product: 'Sapato social', kicker: 'A forma final', title: 'O social como destino', detail: 'O sapato social define a linguagem da experiência. O modelo 3D será refinado para receber couro ou material sintético fornecido pela loja.' },
  { status: 'Solado destacado', product: 'Solado', kicker: 'Estrutura', title: 'O solado sustenta a ideia', detail: 'Solados para calçados sociais com diferentes acabamentos e composições. A disponibilidade e as opções devem ser confirmadas pelo WhatsApp.' },
  { status: 'Palmilha destacada', product: 'Palmilha', kicker: 'Conforto', title: 'A palmilha encontra o pé', detail: 'A palmilha participa do conforto e da estrutura interna do calçado. Consulte os modelos disponíveis para sua produção.' },
  { status: 'Cabedal em produção', product: 'Couro ou sintético para cabedal', kicker: 'Cabedal', title: 'Cortar. Produzir. Costurar.', detail: 'Couro e materiais sintéticos para o cabedal, apresentados na sequência de corte, preparação e costura.' },
  { status: 'Cola aplicada', product: 'Cola para montagem', kicker: 'União', title: 'A cola aproxima as partes', detail: 'Colas e adesivos para a montagem de calçados. As características técnicas e a disponibilidade são informadas pela equipe.' },
  { status: 'Embalagem final', product: 'Cadarço e caixa de sapatos', kicker: 'Acabamento', title: 'Pronto para entrar em cena', detail: 'Cadarços e caixas de sapatos completam a apresentação. A embalagem também é um produto fornecido pela loja.' },
];

const scene = document.querySelector('#scene');
const sceneStatus = document.querySelector('#scene-status');
const sceneProduct = document.querySelector('#scene-product');
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
let renderedStep = 0;
let isDragging = false;
let lastPointerX = 0;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(scene.clientWidth, scene.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
scene.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(28, scene.clientWidth / scene.clientHeight, 0.1, 100);
camera.position.set(5.8, 3.2, 7.4);
const cameraFocus = new THREE.Vector3(0, 0, 0);
const world = new THREE.Scene();
world.fog = new THREE.Fog(0xeee9df, 12, 24);

world.add(new THREE.HemisphereLight(0xfff8e9, 0x5c4635, 2.6));
const keyLight = new THREE.DirectionalLight(0xfff1d3, 4.5);
keyLight.position.set(-4, 7, 5); keyLight.castShadow = true; world.add(keyLight);
const rimLight = new THREE.PointLight(0x8aa6a0, 10, 10); rimLight.position.set(4, 2, -3); world.add(rimLight);

const floor = new THREE.Mesh(new THREE.CircleGeometry(5.6, 64), new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: 0.92 }));
floor.rotation.x = -Math.PI / 2; floor.position.y = -1.25; floor.receiveShadow = true; world.add(floor);

const shoe = new THREE.Group();
shoe.rotation.y = -0.48; shoe.rotation.x = 0.08; world.add(shoe);
const soleMaterial = new THREE.MeshStandardMaterial({ color: 0x40352e, roughness: 0.48, metalness: 0.05 });
const leatherMaterial = new THREE.MeshStandardMaterial({ color: 0x87563b, roughness: 0.3, metalness: 0.03 });
const leatherDark = new THREE.MeshStandardMaterial({ color: 0x30241f, roughness: 0.36 });
const fabricMaterial = new THREE.MeshStandardMaterial({ color: 0xdbc7a9, roughness: 0.8 });

function makePart(geometry, material, name) { const part = new THREE.Mesh(geometry, material); part.name = name; part.castShadow = true; part.receiveShadow = true; shoe.add(part); return part; }
const sole = makePart(new RoundedBoxGeometry(4.15, 0.34, 1.72, 5, 0.18), soleMaterial, 'solado'); sole.position.set(0, -0.72, 0);
const midsole = makePart(new RoundedBoxGeometry(3.85, 0.2, 1.5, 5, 0.13), fabricMaterial, 'palmilha'); midsole.position.set(0.07, -0.48, 0);
const upper = makePart(new RoundedBoxGeometry(3.35, 1.3, 1.48, 8, 0.42), leatherMaterial, 'cabedal'); upper.position.set(0.25, 0.22, 0.02); upper.scale.set(1, 0.92, 0.86);
const tongue = makePart(new RoundedBoxGeometry(1.5, 0.65, 0.7, 6, 0.18), leatherDark, 'lingueta'); tongue.position.set(-0.62, 0.88, 0);
const heel = makePart(new RoundedBoxGeometry(0.82, 1.18, 1.32, 6, 0.2), leatherDark, 'calcanhar'); heel.position.set(1.46, 0.3, 0);
const laces = new THREE.Group(); laces.name = 'cadarco'; shoe.add(laces);
for (let index = 0; index < 4; index += 1) { const lace = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.055, 0.055, 3, 0.02), fabricMaterial); lace.position.set(-0.58 + index * 0.18, 0.86 - index * 0.13, 0.42); lace.rotation.z = -0.08; laces.add(lace); }
const glue = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.52, 20), new THREE.MeshStandardMaterial({ color: 0xb9833f, roughness: 0.25, metalness: 0.2 }));
glue.name = 'cola'; glue.position.set(-0.1, -0.02, -0.92); glue.visible = false; glue.castShadow = true; shoe.add(glue);

const box = new THREE.Group(); box.name = 'caixa'; shoe.add(box);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x9b7652, roughness: 0.7 });
const boxBase = new THREE.Mesh(new RoundedBoxGeometry(4.8, 0.25, 3.2, 4, 0.12), boxMaterial); boxBase.position.set(0, -1.02, 0); boxBase.visible = false; box.add(boxBase);
const boxBack = new THREE.Mesh(new RoundedBoxGeometry(4.8, 2.0, 0.2, 4, 0.08), boxMaterial); boxBack.position.set(0, -0.02, -1.5); boxBack.visible = false; box.add(boxBack);
let animatedParts = { sole, midsole, upper, tongue, heel, laces, glue, box };
let loadedModel = null;

function normalizeName(name) { return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[_\s-]/g, ''); }

function loadRealModel() {
  const loader = new GLTFLoader();
  loader.load('/models/sapato-social.glb', (gltf) => {
    const modelParts = {};
    const aliases = {
      sole: ['solado', 'sola'], midsole: ['palmilha'], upper: ['cabedal'], tongue: ['lingueta'],
      heel: ['calcanhar'], laces: ['cadarco', 'cadarcos'], glue: ['cola'], box: ['caixa', 'caixadesapatos']
    };
    gltf.scene.traverse((node) => {
      if (!node.isMesh && !node.isGroup) return;
      const name = normalizeName(node.name);
      Object.entries(aliases).forEach(([part, names]) => { if (!modelParts[part] && names.some((alias) => name.includes(alias))) modelParts[part] = node; });
    });
    const matchedParts = Object.keys(modelParts).length;
    if (matchedParts < 3) return;
    loadedModel = gltf.scene;
    loadedModel.traverse((node) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
    shoe.add(loadedModel);
    [sole, midsole, upper, tongue, heel, laces, glue, box].forEach((part) => { part.visible = false; });
    animatedParts = { ...animatedParts, ...modelParts };
    applyStage(activeStep);
  }, undefined, () => {
    // O fallback procedural permanece ativo quando ainda nao houver um GLB.
  });
}

function applyStage(step) {
  const progress = step / (stageData.length - 1);
  if (renderedStep !== step && !reducedMotion) {
    liveStory.classList.remove('is-changing');
    void liveStory.offsetWidth;
    liveStory.classList.add('is-changing');
  }
  sceneStatus.textContent = stageData[step].status;
  sceneProduct.textContent = stageData[step].product;
  liveIndex.textContent = `${String(step + 1).padStart(2, '0')} / 06`;
  liveKicker.textContent = stageData[step].kicker;
  liveTitle.textContent = stageData[step].title;
  liveCopy.textContent = stageData[step].detail;
  liveMore.dataset.detail = String(step);
  steps.forEach((item, index) => item.classList.toggle('is-active', index === step));
  const target = {
    sole: { x: 0, y: -0.72, z: 0 }, midsole: { x: 0.07, y: -0.48, z: 0 }, upper: { x: 0.25, y: 0.22, z: 0.02 }, tongue: { x: -0.62, y: 0.88, z: 0 }, heel: { x: 1.46, y: 0.3, z: 0 }, laces: { x: 0, y: 0, z: 0 }, glue: { x: -0.1, y: -0.02, z: -0.92 }, box: { x: 0, y: -1.02, z: 0 }
  };
  const explode = step === 1 || step === 2 || step === 3 || step === 4;
  if (explode) { target.sole.x = -1.5; target.sole.y = -0.82; target.midsole.x = -0.55; target.midsole.y = -0.42; target.upper.x = 0.55; target.upper.y = 0.45; target.tongue.x = -0.5; target.tongue.y = 1.25; target.heel.x = 1.6; target.heel.y = 0.65; }
  if (step === 3) { target.upper.x = 0.55; target.upper.y = 0.72; target.upper.z = 0.14; }
  if (step === 4) { target.glue.x = 0.2; target.glue.y = 0.1; }
  Object.entries(target).forEach(([key, position]) => { const object = animatedParts[key]; if (object?.position) gsap.to(object.position, { ...position, duration: reducedMotion ? 0 : 0.85, ease: 'power3.out', overwrite: true }); });
  if (animatedParts.glue) animatedParts.glue.visible = step === 4;
  if (animatedParts.box) animatedParts.box.visible = step === 5;
  gsap.to(shoe.rotation, { y: -0.48 + progress * 0.6, x: 0.08 + (step === 3 ? 0.12 : 0), duration: reducedMotion ? 0 : 1, ease: 'power2.out' });
  const cameraDistance = [7.4, 6.6, 6.2, 4.9, 5.8, 6.8][step];
  const focusPoint = [
    { x: 0, y: 0, z: 0 },
    { x: -1.2, y: -0.65, z: 0 },
    { x: -0.45, y: -0.42, z: 0 },
    { x: 0.55, y: 0.68, z: 0.12 },
    { x: 0.2, y: 0.1, z: -0.35 },
    { x: 0, y: -0.2, z: 0 }
  ][step];
  gsap.to(camera.position, { z: cameraDistance, duration: reducedMotion ? 0 : 1.05, ease: 'power2.out', overwrite: true });
  gsap.to(cameraFocus, { ...focusPoint, duration: reducedMotion ? 0 : 1.05, ease: 'power2.out', overwrite: true });
  renderedStep = step;
}

function animate() { requestAnimationFrame(animate); if (!reducedMotion && !isDragging) shoe.rotation.y += 0.0015; camera.lookAt(cameraFocus); renderer.render(world, camera); }
animate();
applyStage(0);
loadRealModel();

const motionToggle = document.querySelector('#motion-toggle');
motionToggle.addEventListener('click', () => {
  reducedMotion = !reducedMotion;
  motionToggle.setAttribute('aria-pressed', String(reducedMotion));
  motionToggle.textContent = reducedMotion ? 'Ativar movimento' : 'Reduzir movimento';
  applyStage(activeStep);
});

scene.addEventListener('pointerdown', (event) => {
  isDragging = true;
  lastPointerX = event.clientX;
  scene.setPointerCapture(event.pointerId);
  scene.classList.add('is-dragging');
});

scene.addEventListener('pointermove', (event) => {
  if (!isDragging) return;
  const delta = event.clientX - lastPointerX;
  lastPointerX = event.clientX;
  shoe.rotation.y += delta * 0.012;
});

function stopDragging(event) {
  isDragging = false;
  scene.classList.remove('is-dragging');
  if (event?.pointerId !== undefined && scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
}

scene.addEventListener('pointerup', stopDragging);
scene.addEventListener('pointercancel', stopDragging);
scene.addEventListener('pointerleave', (event) => { if (event.pointerType === 'mouse') stopDragging(event); });

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { activeStep = Number(entry.target.dataset.step); applyStage(activeStep); } }), { threshold: 0.62 });
steps.forEach((step) => observer.observe(step));

document.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => { const data = stageData[Number(button.dataset.detail)]; dialogKicker.textContent = data.kicker; dialogTitle.textContent = data.title; dialogCopy.textContent = data.detail; detailDialog.showModal(); }));
document.querySelector('.dialog-close').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', (event) => { if (event.target === detailDialog) detailDialog.close(); });
window.addEventListener('resize', () => { const width = scene.clientWidth; const height = scene.clientHeight; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); });
