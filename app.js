(() => {
  const $ = (id) => document.getElementById(id);
  const waveform = $('waveform'), frequency = $('frequency'), duration = $('duration'), status = $('status');
  const update = () => { $('frequencyValue').value = `${frequency.value} Hz`; $('durationValue').value = `${Number(duration.value).toFixed(2)} s`; status.textContent = `Ready: ${waveform.value} wave at ${frequency.value} Hz for ${Number(duration.value).toFixed(2)} seconds.`; };
  [waveform, frequency, duration].forEach(el => el.addEventListener('input', update));
  async function render() {
    const rate = 44100, frames = Math.ceil(rate * Number(duration.value));
    const context = new OfflineAudioContext(1, frames, rate);
    const osc = context.createOscillator(), gain = context.createGain();
    osc.type = waveform.value; osc.frequency.value = Number(frequency.value); gain.gain.setValueAtTime(.18, 0); gain.gain.exponentialRampToValueAtTime(.001, Number(duration.value));
    osc.connect(gain).connect(context.destination); osc.start(); osc.stop(Number(duration.value));
    return context.startRendering();
  }
  async function play() { try { const buffer = await render(); const ac = new AudioContext(); const source = ac.createBufferSource(); source.buffer = buffer; source.connect(ac.destination); source.start(); status.textContent = 'Playing generated signal.'; } catch (e) { status.textContent = `Audio error: ${e.message}`; } }
  function wav(buffer) { const samples = buffer.getChannelData(0), bytes = new ArrayBuffer(44 + samples.length * 2), view = new DataView(bytes); const text = (at, value) => [...value].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0))); text(0,'RIFF'); view.setUint32(4,36+samples.length*2,true); text(8,'WAVEfmt '); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,buffer.sampleRate,true); view.setUint32(28,buffer.sampleRate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); text(36,'data'); view.setUint32(40,samples.length*2,true); samples.forEach((v,i)=>view.setInt16(44+i*2,Math.max(-1,Math.min(1,v))*0x7fff,true)); return bytes; }
  async function exportWav() { try { const blob = new Blob([wav(await render())], {type:'audio/wav'}), link = Object.assign(document.createElement('a'), {href:URL.createObjectURL(blob), download:`signal-${frequency.value}hz.wav`}); link.click(); URL.revokeObjectURL(link.href); status.textContent = 'WAV export generated.'; } catch (e) { status.textContent = `Export error: ${e.message}`; } }
  $('play').addEventListener('click', play); $('export').addEventListener('click', exportWav);
  $('instrument').addEventListener('keydown', (event) => { const keys = {ArrowUp:()=>frequency.stepUp(),ArrowDown:()=>frequency.stepDown(),']':()=>duration.stepUp(),'[':()=>duration.stepDown(),w:()=>waveform.selectedIndex=(waveform.selectedIndex+1)%waveform.options.length,s:()=>waveform.selectedIndex=(waveform.selectedIndex+waveform.options.length-1)%waveform.options.length,Space:play,e:exportWav}; const fn=keys[event.code]||keys[event.key]; if(fn){event.preventDefault();fn();update();} });
  update();
})();
