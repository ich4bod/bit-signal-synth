const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
test('instrument controls and accessible status are present', () => {
  for (const id of ['waveform', 'frequency', 'duration', 'play', 'export']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /aria-live="polite"/);
});
test('offline synthesis and keyboard mappings are implemented', () => {
  assert.match(js, /OfflineAudioContext/);
  assert.match(js, /keydown/);
  assert.match(js, /audio\/wav/);
});
