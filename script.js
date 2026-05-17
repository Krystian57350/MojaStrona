// Prosty syntezator dźwięków w przeglądarce (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    // Tworzymy oscylator i moduł głośności
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Szybkie wygaszanie dźwięku (envelope)
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Obsługa kliknięć w pady
document.querySelectorAll('.pad').forEach(pad => {
    pad.addEventListener('click', () => {
        // Wymagane przez nowoczesne przeglądarki do odblokowania audio
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const soundType = pad.getAttribute('data-sound');

        // Generujemy różne dźwięki w zależności od padu
        if (soundType === 'kick') {
            playTone(80, 'sine', 0.3); // Niski basowy kick
        } else if (soundType === 'snare') {
            playTone(300, 'triangle', 0.15); // Krótki snare
        } else if (soundType === 'hihat') {
            playTone(800, 'square', 0.05); // Bardzo krótki pisk jako hi-hat
        } else if (soundType === 'synth') {
            playTone(440, 'sawtooth', 0.4); // Klubowy syntezator (nutka A4)
        }
    });
});