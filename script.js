/* ============================================================
   HACKER MISSION PORTFOLIO — script.js
   ============================================================ */

// ─── SOUND EFFECTS ────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext; 
let audioCtx;
function ensureAudio() { if (!audioCtx) audioCtx = new AudioCtx(); }
function playTone(freq, duration = 0.08, type = 'square') {
    try {
        ensureAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
}
function sfxKey()     { playTone(800, 0.04); }
function sfxSuccess() { playTone(523, 0.12, 'sine'); setTimeout(() => playTone(659, 0.12, 'sine'), 120); setTimeout(() => playTone(784, 0.2, 'sine'), 240); }
function sfxError()   { playTone(200, 0.25, 'sawtooth'); }
function sfxUnlock()  { [523,587,659,698,784].forEach((f,i) => setTimeout(() => playTone(f, 0.1, 'sine'), i*80)); }

// ─── MATRIX RAIN ──────────────────────────────────────────────
(function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    let cols, drops;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]|;:<>ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘ';
    const fontSize = 14;
    function resize() {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        cols = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: cols }, () => Math.random() * -100 | 0);
    }
    resize(); window.addEventListener('resize', resize);
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff41'; ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < cols; i++) {
            const ch = chars[Math.random() * chars.length | 0];
            ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ─── BOOT SEQUENCE ────────────────────────────────────────────
const bootLines = [
    '[BOOT] Initializing secure environment...',
    '[BOOT] Loading kernel modules... OK',
    '[NET]  Establishing encrypted tunnel... OK',
    '[AUTH] Agent profile: MASINA SIRI SURYA',
    '[AUTH] Clearance level: FULL-STACK DEVELOPER',
    '[SYS]  Loading mission briefing...',
    '[SYS]  All systems operational.',
    '',
    '▶ Ready. Press INITIALIZE to begin your mission.'
];

(async function boot() {
    const container = document.getElementById('bootText');
    for (const line of bootLines) {
        const p = document.createElement('p');
        container.appendChild(p);
        for (let i = 0; i < line.length; i++) {
            p.textContent += line[i];
            await sleep(18 + Math.random() * 12);
        }
        p.style.opacity = '1'; sfxKey(); await sleep(200);
    }
    document.getElementById('initBtn').style.display = 'inline-block';
})();

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── NOTIFICATION ─────────────────────────────────────────────
function notify(msg, type = 'success') {
    const el = document.getElementById('notification');
    el.textContent = msg; el.className = `notification ${type} show`;
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 3500);
}

// ─── SCREEN MANAGEMENT ───────────────────────────────────────
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// ─── MISSION 1: TERMINAL RIDDLE ──────────────────────────────
let m1Attempts = 0;
const M1_ANSWER = 'map';

function startMission1() { sfxKey(); showScreen('mission1Screen'); document.getElementById('m1Input').focus(); }

document.getElementById('m1Input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase(); m1Attempts++;
        const output = document.getElementById('m1Output');
        if (val === M1_ANSWER || val === 'a map') {
            sfxSuccess();
            const line = document.createElement('p'); line.className = 't-line success';
            line.textContent = `[ACCESS GRANTED] Welcome, Agent Surya. Dossier unlocked.`;
            output.appendChild(line); this.disabled = true;
            notify('✅ Mission 1 Complete — Dossier Unlocked!', 'success');
            setTimeout(() => { showScreen('dossierScreen'); animateSectionEntries(); }, 1500);
        } else {
            sfxError();
            const line = document.createElement('p'); line.className = 't-line error';
            line.textContent = `[DENIED] "${val}" is incorrect. Try again.`;
            output.appendChild(line);
            document.getElementById('m1Attempts').textContent = `Attempts: ${m1Attempts}`;
            this.value = '';
        }
    } else { sfxKey(); }
});

// ─── MISSION 2: CAESAR CIPHER ────────────────────────────────
let m2Attempts = 0;
const M2_ANSWER = 'code breaker';

document.getElementById('m2Input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase(); m2Attempts++;
        if (val === M2_ANSWER || val === 'codebreaker') {
            sfxUnlock(); this.disabled = true;
            document.getElementById('mission2Section').style.display = 'none';
            document.getElementById('projectsLock').classList.add('hidden');
            document.getElementById('projects').classList.remove('locked-section');
            document.getElementById('projectsNavLink').classList.remove('locked');
            document.getElementById('projectsNavLink').classList.add('unlocked');
            document.getElementById('projectsNavLink').textContent = 'PROJECTS';
            document.getElementById('mpDot2').classList.add('completed');
            document.getElementById('mission3Section').style.display = 'block';
            notify('✅ Mission 2 Complete — Projects Vault Unlocked!', 'success');
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        } else {
            sfxError(); document.getElementById('m2Attempts').textContent = `Attempts: ${m2Attempts}`; this.value = '';
        }
    } else { sfxKey(); }
});

// ─── MISSION 3: PASSCODE ─────────────────────────────────────
const M3_CODE = '7002';
let m3Attempts = 0;
const passInputs = document.querySelectorAll('.passcode-digit');

passInputs.forEach((inp, idx) => {
    inp.addEventListener('input', function() {
        sfxKey(); this.value = this.value.replace(/\D/g, '');
        if (this.value && idx < passInputs.length - 1) passInputs[idx + 1].focus();
        const code = Array.from(passInputs).map(i => i.value).join('');
        if (code.length === 4) {
            m3Attempts++;
            if (code === M3_CODE) {
                sfxUnlock();
                passInputs.forEach(i => { i.classList.add('correct'); i.disabled = true; });
                document.getElementById('contactLock').classList.add('hidden');
                document.getElementById('contact').classList.remove('locked-section');
                document.getElementById('contactNavLink').classList.remove('locked');
                document.getElementById('contactNavLink').classList.add('unlocked');
                document.getElementById('contactNavLink').textContent = 'CONTACT';
                document.getElementById('mpDot3').classList.add('completed');
                document.getElementById('mission3Section').style.display = 'none';
                notify('✅ Mission 3 Complete — All Access Granted!', 'success');
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            } else {
                sfxError();
                passInputs.forEach(i => { i.classList.add('wrong'); i.value = ''; });
                setTimeout(() => passInputs.forEach(i => i.classList.remove('wrong')), 500);
                passInputs[0].focus();
                document.getElementById('m3Attempts').textContent = `Attempts: ${m3Attempts}`;
            }
        }
    });
    inp.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && idx > 0) passInputs[idx - 1].focus();
    });
});

// ─── SECTION ANIMATIONS ─────────────────────────────────────
function animateSectionEntries() {
    const sections = document.querySelectorAll('#dossierScreen .section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
        });
    }, { threshold: 0.1 });
    sections.forEach(sec => {
        sec.style.opacity = '0'; sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(sec);
    });
    setTimeout(() => { sections[0].style.opacity = '1'; sections[0].style.transform = 'translateY(0)'; }, 100);
}

// ─── NAV TRACKING ─────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
const sectionIds = ['about', 'skills', 'education', 'projects', 'contact'];
window.addEventListener('scroll', () => {
    let current = '';
    for (const id of sectionIds) {
        const sec = document.getElementById(id);
        if (sec && sec.getBoundingClientRect().top <= 200) current = id;
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}` && !link.classList.contains('locked'));
    });
});
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.classList.contains('locked')) { e.preventDefault(); notify('🔒 Complete the mission to unlock this section.', 'error'); }
    });
});

