/**
 * MOLE FEVER - Modern 2D Arcade Web Game
 * High-performance, clean vanilla JavaScript implementation
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Sound Synthesizer (Web Audio API - No External Assets Needed)
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initialized = false;
      this.loadPreference();
    }

    loadPreference() {
      try {
        const saved = localStorage.getItem('mole_fever_muted');
        this.muted = saved === 'true';
      } catch (e) {
        this.muted = false;
      }
    }

    savePreference() {
      try {
        localStorage.setItem('mole_fever_muted', this.muted);
      } catch (e) {}
    }

    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.initialized = true;
    }

    toggleMute() {
      this.muted = !this.muted;
      this.savePreference();
      return this.muted;
    }

    // Play Pop sound when mole peeks up
    playPop() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(540, t + 0.08);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
      } catch (e) {}
    }

    // Play Whack punch sound
    playWhack() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
      } catch (e) {}
    }

    // Play Fever hit (brighter dual harmonic chord)
    playFeverHit() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        [587.33, 880].forEach((freq, i) => { // D5, A5
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 0.15);

          gain.gain.setValueAtTime(0.16, t + (i * 0.02));
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.2);
        });
      } catch (e) {}
    }

    // Play Miss sound (soft hollow drop)
    playMiss() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.17);
      } catch (e) {}
    }

    // Play Combo Milestone Fanfare (x5, x10, x20, x30)
    playMilestone() {
      if (this.muted || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.07;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.18);
        });
      } catch (e) {}
    }

    // Play Fever Mode activation sound
    playFeverStart() {
      if (this.muted || !this.ctx) return;
      try {
        const chords = [440, 554.37, 659.25, 880, 1108.73];
        chords.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.05;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.25);
        });
      } catch (e) {}
    }

    // Play Game Over jingle
    playGameOver(isNewRecord = false) {
      if (this.muted || !this.ctx) return;
      try {
        const freqs = isNewRecord 
          ? [523.25, 659.25, 783.99, 1046.50, 1318.51] // High fanfare
          : [440, 392, 349.23, 293.66]; // Descending soft outro

        freqs.forEach((freq, idx) => {
          const t = this.ctx.currentTime + idx * 0.1;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 0.3);
        });
      } catch (e) {}
    }

    // Play urgent countdown tick (<= 5s)
    playTick() {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.06);
      } catch (e) {}
    }
  }

  /* ==========================================================================
     2. Particle Canvas Engine (Lightweight, 60fps)
     ========================================================================== */
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();

      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    // Spawn hit explosion particles at client coordinates
    spawnHitExplosion(x, y, isFever = false) {
      const count = isFever ? 18 : 12;
      const palette = isFever 
        ? ['#fbbf24', '#f59e0b', '#ec4899', '#38bdf8', '#ffffff']
        : ['#38bdf8', '#818cf8', '#c084fc', '#ffffff'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 3 + Math.random() * 4,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          decay: 0.025 + Math.random() * 0.02,
          isStar: Math.random() > 0.4
        });
      }

      this.startLoop();
    }

    // Spawn celebration confetti on Game Over / New Record
    spawnConfetti() {
      const palette = ['#38bdf8', '#fbbf24', '#ec4899', '#10b981', '#a855f7'];
      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
          y: window.innerHeight * 0.4,
          vx: (Math.random() - 0.5) * 12,
          vy: -6 - Math.random() * 8,
          radius: 4 + Math.random() * 4,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          decay: 0.015,
          isStar: true
        });
      }
      this.startLoop();
    }

    clear() {
      this.particles = [];
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startLoop() {
      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air resistance
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;

        if (p.isStar) {
          // Draw star / diamond
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
      }
    }
  }

  /* ==========================================================================
     3. Core Game Logic
     ========================================================================== */
  class MoleFeverGame {
    constructor() {
      // Game State
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.timeLeft = 30;
      this.gameState = 'idle'; // 'idle' | 'playing' | 'ended'
      this.feverActive = false;
      this.currentTier = 1;

      // Hole and Mole tracking
      this.activeHoleIndex = -1;
      this.moleWhacked = false;
      this.lastHoleIndex = -1;

      // Timers
      this.gameTimerInterval = null;
      this.moleTimeout = null;
      this.spawnTimeout = null;
      this.toastTimeout = null;

      // Persistence
      this.highScore = this.loadData('mole_fever_highscore', 0);
      this.allTimeMaxCombo = this.loadData('mole_fever_maxcombo', 0);

      // Subsystems
      this.sound = new SoundManager();
      this.canvas = document.getElementById('fx-canvas');
      this.fx = new ParticleEngine(this.canvas);

      // DOM Elements
      this.cacheDOMElements();
      this.initBoardGrid();
      this.bindEvents();
      this.updateHUD();
      this.syncSoundIcon();
    }

    loadData(key, fallback) {
      try {
        const val = localStorage.getItem(key);
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? fallback : parsed;
      } catch (e) {
        return fallback;
      }
    }

    saveData(key, value) {
      try {
        localStorage.setItem(key, value.toString());
      } catch (e) {}
    }

    cacheDOMElements() {
      this.body = document.body;
      this.tierBadge = document.getElementById('tier-badge');
      this.hudScore = document.getElementById('hud-score');
      this.hudHighscore = document.getElementById('hud-highscore');
      this.feverMultiplier = document.getElementById('fever-multiplier');
      this.hudTimer = document.getElementById('hud-timer');
      this.cardTimer = document.getElementById('card-timer');
      this.timerBarFill = document.getElementById('timer-bar-fill');
      this.hudCombo = document.getElementById('hud-combo');
      this.hudMaxCombo = document.getElementById('hud-maxcombo');
      this.feverBanner = document.getElementById('fever-banner');
      this.boardGrid = document.getElementById('board-grid');
      this.btnStart = document.getElementById('btn-start-game');
      this.btnStartText = document.getElementById('btn-start-text');
      this.btnSound = document.getElementById('btn-sound');
      this.iconSoundOn = this.btnSound.querySelector('.icon-sound-on');
      this.iconSoundOff = this.btnSound.querySelector('.icon-sound-off');
      this.btnHelp = document.getElementById('btn-help');
      this.btnCloseHelp = document.getElementById('btn-close-help');
      this.modalHelp = document.getElementById('modal-help');
      this.modalGameOver = document.getElementById('modal-gameover');
      this.btnRestart = document.getElementById('btn-restart');
      this.comboToast = document.getElementById('combo-toast');
      this.comboToastMsg = document.getElementById('combo-toast-msg');

      // Results elements
      this.resScore = document.getElementById('res-score');
      this.resHighScore = document.getElementById('res-highscore');
      this.resMaxCombo = document.getElementById('res-maxcombo');
      this.badgeNewRecord = document.getElementById('badge-new-record');
      this.resGrade = document.getElementById('res-grade');
      this.resComment = document.getElementById('res-comment');
    }

    // Populate all 9 holes using hole-0 template
    initBoardGrid() {
      const templateHole = document.getElementById('hole-0');
      if (!templateHole) return;

      const templateHTML = templateHole.outerHTML;
      this.boardGrid.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const holeDiv = document.createElement('div');
        holeDiv.innerHTML = templateHTML;
        const hole = holeDiv.firstElementChild;
        hole.id = `hole-${i}`;
        hole.dataset.index = i.toString();

        const moleWrap = hole.querySelector('.mole-wrapper');
        if (moleWrap) moleWrap.id = `mole-${i}`;

        const fxAnchor = hole.querySelector('.floating-text-anchor');
        if (fxAnchor) fxAnchor.id = `fx-anchor-${i}`;

        this.boardGrid.appendChild(hole);
      }
      this.holes = Array.from(this.boardGrid.querySelectorAll('.hole'));
    }

    bindEvents() {
      // Audio trigger on user interaction
      const initAudio = () => {
        this.sound.initContext();
        window.removeEventListener('pointerdown', initAudio);
        window.removeEventListener('keydown', initAudio);
      };
      window.addEventListener('pointerdown', initAudio, { once: true });
      window.addEventListener('keydown', initAudio, { once: true });

      // Start / Replay Buttons
      this.btnStart.addEventListener('click', () => {
        this.sound.initContext();
        if (this.gameState === 'playing') return;
        this.startGame();
      });

      this.btnRestart.addEventListener('click', () => {
        this.modalGameOver.classList.add('hidden');
        this.startGame();
      });

      // Sound Toggle
      this.btnSound.addEventListener('click', () => {
        this.sound.initContext();
        const isMuted = this.sound.toggleMute();
        this.syncSoundIcon();
      });

      // Help Modal
      this.btnHelp.addEventListener('click', () => {
        this.modalHelp.classList.remove('hidden');
      });
      this.btnCloseHelp.addEventListener('click', () => {
        this.modalHelp.classList.add('hidden');
      });
      this.modalHelp.addEventListener('click', (e) => {
        if (e.target === this.modalHelp) {
          this.modalHelp.classList.add('hidden');
        }
      });

      // Board Pointer Events (supports mouse and touch smoothly with zero double triggers)
      this.boardGrid.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    }

    syncSoundIcon() {
      if (this.sound.muted) {
        this.iconSoundOn.classList.add('hidden');
        this.iconSoundOff.classList.remove('hidden');
      } else {
        this.iconSoundOn.classList.remove('hidden');
        this.iconSoundOff.classList.add('hidden');
      }
    }

    /* ==========================================================================
       4. Difficulty, Speeds & Combo System
       ========================================================================== */
    // Duration mole stays visible
    getShowDuration() {
      if (this.combo >= 30) return 650;  // 0.65s
      if (this.combo >= 20) return 750;  // 0.75s (Fever range)
      if (this.combo >= 10) return 900;  // 0.90s
      if (this.combo >= 5)  return 1100; // 1.10s
      return 1300;                       // 1.30s (Base)
    }

    // Interval between mole hide and next spawn (guarantees 0.15s ~ 0.2s minimum)
    getSpawnDelay() {
      if (this.combo >= 20) return 150;
      if (this.combo >= 10) return 175;
      return 200;
    }

    // Calculate tier from current combo
    calculateTier() {
      if (this.combo >= 20) return 4;
      if (this.combo >= 10) return 3;
      if (this.combo >= 5)  return 2;
      return 1;
    }

    updateTierVisuals() {
      const tier = this.calculateTier();
      if (tier !== this.currentTier) {
        this.currentTier = tier;
        this.body.className = `tier-${tier}`;
        this.tierBadge.textContent = tier === 4 ? '🔥 FEVER' : `TIER ${tier}`;

        // Fever mode transitions
        if (tier === 4 && !this.feverActive) {
          this.activateFever();
        } else if (tier < 4 && this.feverActive) {
          this.deactivateFever();
        }
      }
    }

    activateFever() {
      this.feverActive = true;
      this.feverBanner.classList.remove('hidden');
      this.feverMultiplier.classList.remove('hidden');
      this.sound.playFeverStart();
      this.showMilestoneToast('🔥 FEVER MODE! 2X POINTS! 🔥');
    }

    deactivateFever() {
      this.feverActive = false;
      this.feverBanner.classList.add('hidden');
      this.feverMultiplier.classList.add('hidden');
    }

    showMilestoneToast(msg) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.comboToastMsg.textContent = msg;
      this.comboToast.classList.remove('hidden');
      this.toastTimeout = setTimeout(() => {
        this.comboToast.classList.add('hidden');
      }, 1400);
    }

    checkComboMilestone() {
      if (this.combo === 5) {
        this.sound.playMilestone();
        this.showMilestoneToast('COMBO x5! NICE!');
      } else if (this.combo === 10) {
        this.sound.playMilestone();
        this.showMilestoneToast('COMBO x10! AWESOME!');
      } else if (this.combo === 20) {
        // Fever activated in updateTierVisuals
      } else if (this.combo === 30) {
        this.sound.playMilestone();
        this.showMilestoneToast('COMBO x30! UNSTOPPABLE!');
      }
    }

    /* ==========================================================================
       5. Hole & Mole Spawning Engine
       ========================================================================== */
    spawnMole() {
      if (this.gameState !== 'playing') return;

      // Select unbiased random hole (avoid immediate duplicate)
      let nextHole;
      do {
        nextHole = Math.floor(Math.random() * 9);
      } while (nextHole === this.lastHoleIndex && this.holes.length > 1);

      this.lastHoleIndex = nextHole;
      this.activeHoleIndex = nextHole;
      this.moleWhacked = false;

      const hole = this.holes[nextHole];
      hole.classList.remove('mole-hit');
      hole.classList.add('mole-up');

      this.sound.playPop();

      const showDuration = this.getShowDuration();

      // Clear existing mole timer if any
      if (this.moleTimeout) clearTimeout(this.moleTimeout);

      // Schedule auto-hide if player misses
      this.moleTimeout = setTimeout(() => {
        if (!this.moleWhacked && this.gameState === 'playing') {
          this.handleMiss();
        }
      }, showDuration);
    }

    hideMole(whacked = false) {
      if (this.activeHoleIndex === -1) return;
      const hole = this.holes[this.activeHoleIndex];
      if (hole) {
        if (!whacked) {
          hole.classList.remove('mole-up', 'mole-hit');
        } else {
          // Keep mole-hit class for bonk animation, remove mole-up
          hole.classList.remove('mole-up');
          setTimeout(() => {
            hole.classList.remove('mole-hit');
          }, 350);
        }
      }
      this.activeHoleIndex = -1;
    }

    handleMiss() {
      // Combo resets to 0
      this.combo = 0;
      this.sound.playMiss();
      this.updateTierVisuals();
      this.updateHUD();

      this.hideMole(false);

      // Schedule next mole after spawn delay
      if (this.gameState === 'playing') {
        const delay = this.getSpawnDelay();
        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        this.spawnTimeout = setTimeout(() => {
          this.spawnMole();
        }, delay);
      }
    }

    /* ==========================================================================
       6. User Input Handling
       ========================================================================== */
    handlePointerDown(e) {
      if (this.gameState !== 'playing') return;

      // Find closest hole element
      const hole = e.target.closest('.hole');
      if (!hole) return;

      e.preventDefault(); // Stop mouse emulation & scrolling

      const holeIndex = parseInt(hole.dataset.index, 10);

      // Check if whacked active mole and not whacked yet
      if (holeIndex === this.activeHoleIndex && !this.moleWhacked && hole.classList.contains('mole-up')) {
        this.whackMole(holeIndex, e.clientX, e.clientY);
      }
    }

    whackMole(holeIndex, clientX, clientY) {
      this.moleWhacked = true;
      if (this.moleTimeout) clearTimeout(this.moleTimeout);

      // Score calculation
      const points = this.feverActive ? 2 : 1;
      this.score += points;
      this.combo += 1;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Check tier changes & milestones
      this.updateTierVisuals();
      this.checkComboMilestone();

      // Audio & Particle FX
      if (this.feverActive) {
        this.sound.playFeverHit();
      } else {
        this.sound.playWhack();
      }

      // Particle explosion at hit point (fallback to hole center if offscreen)
      const hole = this.holes[holeIndex];
      const rect = hole.getBoundingClientRect();
      const px = clientX && clientX > 0 ? clientX : rect.left + rect.width / 2;
      const py = clientY && clientY > 0 ? clientY : rect.top + rect.height / 2;
      this.fx.spawnHitExplosion(px, py, this.feverActive);

      // Floating score text popup (+1 or +2)
      this.showFloatingScore(holeIndex, points);

      // Animate Mole Hit state
      hole.classList.add('mole-hit');
      this.hideMole(true);

      // HUD Bump animations
      this.hudScore.classList.add('score-bump');
      this.hudCombo.classList.add('combo-bump');
      setTimeout(() => {
        this.hudScore.classList.remove('score-bump');
        this.hudCombo.classList.remove('combo-bump');
      }, 250);

      this.updateHUD();

      // Schedule next mole spawn
      if (this.gameState === 'playing') {
        const delay = this.getSpawnDelay();
        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        this.spawnTimeout = setTimeout(() => {
          this.spawnMole();
        }, delay);
      }
    }

    showFloatingScore(holeIndex, points) {
      const anchor = document.getElementById(`fx-anchor-${holeIndex}`);
      if (!anchor) return;

      const floatEl = document.createElement('div');
      floatEl.className = `float-score ${points > 1 ? 'fever-score' : ''}`;
      floatEl.textContent = `+${points}`;

      anchor.appendChild(floatEl);
      setTimeout(() => {
        floatEl.remove();
      }, 700);
    }

    /* ==========================================================================
       7. Game Lifecycle & 30s Countdown
       ========================================================================== */
    startGame() {
      this.clearAllTimers();

      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.timeLeft = 30;
      this.gameState = 'playing';
      this.feverActive = false;
      this.currentTier = 1;
      this.activeHoleIndex = -1;
      this.lastHoleIndex = -1;
      this.moleWhacked = false;

      // Reset visuals
      this.body.className = 'tier-1';
      this.tierBadge.textContent = 'TIER 1';
      this.feverBanner.classList.add('hidden');
      this.feverMultiplier.classList.add('hidden');
      this.cardTimer.classList.remove('timer-urgent');
      this.modalGameOver.classList.add('hidden');
      this.btnStart.disabled = true;
      this.btnStartText.textContent = '게임 진행 중...';

      // Reset all holes
      this.holes.forEach(hole => {
        hole.classList.remove('mole-up', 'mole-hit');
      });

      this.updateHUD();

      // Start 30s countdown interval (1 second ticks)
      this.gameTimerInterval = setInterval(() => {
        this.tickTimer();
      }, 1000);

      // Initial mole spawn with tiny intro delay (300ms)
      this.spawnTimeout = setTimeout(() => {
        this.spawnMole();
      }, 300);
    }

    tickTimer() {
      this.timeLeft -= 1;
      if (this.timeLeft < 0) this.timeLeft = 0;

      // Urgent warning at <= 5s
      if (this.timeLeft <= 5 && this.timeLeft > 0) {
        this.cardTimer.classList.add('timer-urgent');
        this.sound.playTick();
      }

      this.updateHUD();

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }

    endGame() {
      this.gameState = 'ended';
      this.clearAllTimers();

      this.btnStart.disabled = false;
      this.btnStartText.textContent = '게임 시작';
      this.cardTimer.classList.remove('timer-urgent');

      this.hideMole(false);
      this.deactivateFever();

      // Check high score and all-time max combo
      let isNewRecord = false;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.saveData('mole_fever_highscore', this.highScore);
        isNewRecord = true;
      }

      if (this.maxCombo > this.allTimeMaxCombo) {
        this.allTimeMaxCombo = this.maxCombo;
        this.saveData('mole_fever_maxcombo', this.allTimeMaxCombo);
      }

      this.updateHUD();
      this.showGameOverModal(isNewRecord);
    }

    showGameOverModal(isNewRecord) {
      this.resScore.textContent = this.score.toString();
      this.resHighScore.textContent = this.highScore.toString();
      this.resMaxCombo.textContent = this.maxCombo.toString();

      if (isNewRecord && this.score > 0) {
        this.badgeNewRecord.classList.remove('hidden');
        this.fx.spawnConfetti();
      } else {
        this.badgeNewRecord.classList.add('hidden');
      }

      // Performance Grade & Evaluation
      let grade = 'C';
      let comment = '아직 연습이 필요해요!';

      if (this.score >= 50) {
        grade = 'SSS';
        comment = '신의 경지에 도달한 두더지 마스터!';
      } else if (this.score >= 40) {
        grade = 'SS';
        comment = '경이로운 반응 속도와 집중력!';
      } else if (this.score >= 30) {
        grade = 'S';
        comment = '환상적인 플레이였습니다!';
      } else if (this.score >= 20) {
        grade = 'A';
        comment = '피버 모드를 훌륭하게 활용했네요!';
      } else if (this.score >= 10) {
        grade = 'B';
        comment = '좋은 흐름입니다. 더 높은 콤보를 노려보세요!';
      }

      this.resGrade.textContent = grade;
      this.resComment.textContent = comment;

      this.sound.playGameOver(isNewRecord);
      this.modalGameOver.classList.remove('hidden');
    }

    clearAllTimers() {
      if (this.gameTimerInterval) {
        clearInterval(this.gameTimerInterval);
        this.gameTimerInterval = null;
      }
      if (this.moleTimeout) {
        clearTimeout(this.moleTimeout);
        this.moleTimeout = null;
      }
      if (this.spawnTimeout) {
        clearTimeout(this.spawnTimeout);
        this.spawnTimeout = null;
      }
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
        this.toastTimeout = null;
      }
    }

    updateHUD() {
      this.hudScore.textContent = this.score.toString();
      this.hudHighscore.textContent = this.highScore.toString();
      this.hudTimer.textContent = this.timeLeft.toString();
      this.hudCombo.textContent = this.combo.toString();
      this.hudMaxCombo.textContent = this.maxCombo.toString();

      // Timer Bar Fill percentage
      const pct = Math.max(0, Math.min(100, (this.timeLeft / 30) * 100));
      this.timerBarFill.style.width = `${pct}%`;
    }
  }

  // Initialize game on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MoleFeverGame());
  } else {
    new MoleFeverGame();
  }
})();
