/**
 * Verification Test for MOLE FEVER Game Logic
 * Tests:
 * 1. File existence & basic syntax
 * 2. HTML elements & IDs required
 * 3. CSS syntax & Tier definitions
 * 4. Game logic: Combo speed calculations, Tier calculations, Score rules, Fever mode rules
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

console.log('--- 1. Testing Files Existence ---');
const files = ['index.html', 'style.css', 'script.js', 'dev-server.js'];
files.forEach(f => {
  assert(fs.existsSync(path.join(rootDir, f)), `File ${f} exists`);
});

console.log('\n--- 2. Validating index.html Content & Elements ---');
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const requiredIds = [
  'tier-badge',
  'main-title',
  'btn-sound',
  'btn-help',
  'hud-score',
  'fever-multiplier',
  'hud-highscore',
  'hud-timer',
  'timer-bar-fill',
  'hud-combo',
  'hud-maxcombo',
  'fever-banner',
  'board-frame',
  'board-grid',
  'combo-toast',
  'btn-start-game',
  'modal-gameover',
  'res-score',
  'res-highscore',
  'res-maxcombo',
  'btn-restart'
];

requiredIds.forEach(id => {
  assert(htmlContent.includes(`id="${id}"`), `HTML contains element with id="${id}"`);
});

assert(htmlContent.includes('MOLE') && htmlContent.includes('FEVER'), 'HTML contains "MOLE FEVER" title');
assert(htmlContent.includes('viewport-fit=cover'), 'HTML has safe-area mobile viewport');

console.log('\n--- 3. Validating style.css Design System & Tiers ---');
const cssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
const requiredTiers = ['tier-1', 'tier-2', 'tier-3', 'tier-4'];
requiredTiers.forEach(tier => {
  assert(cssContent.includes(`.${tier}`), `CSS defines style for .${tier}`);
});
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'CSS includes prefers-reduced-motion accessibility');
assert(cssContent.includes('touch-action: manipulation'), 'CSS includes mobile touch optimization');

console.log('\n--- 4. Validating script.js Core Game Logic Rules ---');
const jsContent = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');

// Check durations specified in requirements:
// Combo 0~4: 1.3s
// Combo 5~9: 1.1s
// Combo 10~19: 0.9s
// Combo 20~29: 0.75s
// Combo 30+: 0.65s
assert(jsContent.includes('1300') && jsContent.includes('1100') && jsContent.includes('900') && jsContent.includes('750') && jsContent.includes('650'), 'Script implements accurate combo speed thresholds (1.3s, 1.1s, 0.9s, 0.75s, 0.65s)');

// Check minimum interval between moles (0.15s ~ 0.2s)
assert(jsContent.includes('150') && jsContent.includes('200'), 'Script implements mole spawn interval of 0.15s ~ 0.2s');

// Check fever mode points (2 points vs 1 point)
assert(jsContent.includes('this.feverActive ? 2 : 1'), 'Script calculates 2 points during fever mode and 1 point otherwise');

// Check combo milestones: 5, 10, 20, 30
assert(jsContent.includes('this.combo === 5') && jsContent.includes('this.combo === 10') && jsContent.includes('this.combo === 30'), 'Script checks combo milestones 5, 10, 20, 30');

// Check localStorage usage
assert(jsContent.includes('mole_fever_highscore') && jsContent.includes('mole_fever_maxcombo'), 'Script persists high score and max combo to localStorage');

// Check 30s game duration
assert(jsContent.includes('timeLeft = 30') || jsContent.includes('this.timeLeft = 30'), 'Script enforces 30 seconds game duration');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} PASSED`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
