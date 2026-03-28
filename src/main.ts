// ============================================
// aidAR — Main Entry Point
// ============================================
import './style.css';
import { initScene, getScene, startRenderLoop } from './viewer/scene';
import { createProceduralModel, type BodyParts } from './viewer/model';
import { CPRAnimation, BleedingAnimation } from './viewer/animations';
import { initNarrator } from './narrator/narrator';

// ---- App Init ----
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize 3D Scene
  const container = document.getElementById('three-canvas-container')!;
  initScene(container);
  const scene = getScene();

  // 2. Create Procedural Model
  const bodyParts: BodyParts = await createProceduralModel();
  scene.add(bodyParts.root);

  // 3. Initialize Animations
  const cprAnim = new CPRAnimation(bodyParts);
  const bleedingAnim = new BleedingAnimation(bodyParts);

  // 4. Animation Control Buttons
  const btnCpr = document.getElementById('btn-cpr')!;
  const btnBleeding = document.getElementById('btn-bleeding')!;
  const btnReset = document.getElementById('btn-reset')!;
  const viewerModeLabel = document.getElementById('viewer-mode-label')!;

  btnCpr.addEventListener('click', () => {
    bleedingAnim.stop();
    btnBleeding.classList.remove('active');

    if (cprAnim.isActive()) {
      cprAnim.stop();
      btnCpr.classList.remove('active');
      viewerModeLabel.textContent = 'Interactive Mode';
    } else {
      cprAnim.start();
      btnCpr.classList.add('active');
      viewerModeLabel.textContent = 'CPR Demonstration';
    }
  });

  btnBleeding.addEventListener('click', () => {
    cprAnim.stop();
    btnCpr.classList.remove('active');

    if (bleedingAnim.isActive()) {
      bleedingAnim.stop();
      btnBleeding.classList.remove('active');
      viewerModeLabel.textContent = 'Interactive Mode';
    } else {
      bleedingAnim.start();
      btnBleeding.classList.add('active');
      viewerModeLabel.textContent = 'Bleeding Management';
    }
  });

  btnReset.addEventListener('click', () => {
    cprAnim.stop();
    bleedingAnim.stop();
    btnCpr.classList.remove('active');
    btnBleeding.classList.remove('active');
    viewerModeLabel.textContent = 'Interactive Mode';
  });

  // 5. Start Render Loop
  startRenderLoop((delta) => {
    cprAnim.update(delta);
    bleedingAnim.update(delta);
    if (bodyParts.cprMixer) {
      bodyParts.cprMixer.update(delta);
    }
    if (bodyParts.bleedingMixer) {
      bodyParts.bleedingMixer.update(delta);
    }
  });

  // 6. Initialize Narrator
  initNarrator();

  // 7. Mobile Panel Toggle
  const mobileToggle = document.getElementById('mobile-panel-toggle')!;
  const sidePanel = document.getElementById('side-panel')!;

  mobileToggle.addEventListener('click', () => {
    sidePanel.classList.toggle('collapsed');
  });
});
