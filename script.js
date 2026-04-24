document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        gameOver: document.getElementById('game-over-screen')
    };

    const buttons = {
        start: document.getElementById('start-button'),
        playAgain: document.getElementById('play-again-button'),
        options: document.querySelectorAll('.option-button'),
        lifelines: {
            fiftyFifty: document.getElementById('lifeline-5050'),
            phone: document.getElementById('lifeline-phone'),
            audience: document.getElementById('lifeline-audience')
        },
        modalClose: document.getElementById('modal-close-button')
    };

    const ui = {
        questionNum: document.getElementById('current-question-num'),
        questionText: document.getElementById('question-text'),
        moneyList: document.getElementById('money-list'),
        moneyWon: document.getElementById('money-won'),
        finalScore: document.getElementById('final-score'),
        gameOverMsg: document.getElementById('game-over-message'),
        modal: document.getElementById('modal'),
        modalTitle: document.getElementById('modal-title'),
        modalText: document.getElementById('modal-text'),
        audiencePoll: document.getElementById('audience-poll'),
        // Gamification UI
        timerBar: document.getElementById('timer-bar'),
        timeText: document.getElementById('time-text'),
        streakContainer: document.getElementById('streak-container'),
        streakCount: document.getElementById('streak-count'),
        questionContainer: document.getElementById('question-container')
    };

    // Game State
    const QUESTION_TIME = 45;
    let state = {
        questions: [],
        currentIndex: 0,
        currentMoney: 0,
        safeHavenAmount: 0,
        isAnswering: false,
        lifelines: {
            fiftyFifty: false,
            phone: false,
            audience: false
        },
        // Gamification State
        timeLeft: QUESTION_TIME,
        timerInterval: null,
        streak: 0
    };

    // --- AUDIO SYSTEM (Web Audio API) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();

    function playSound(type) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type === 'tick') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'wrong') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'levelUp') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554.37, now + 0.1);
            osc.frequency.setValueAtTime(659.25, now + 0.2);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
    }

    // Utility: Format currency
    const formatMoney = (amount) => amount.toLocaleString('es-ES');

    // Utility: Shuffle Array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // --- TIMER SYSTEM ---
    function startTimer() {
        clearInterval(state.timerInterval);
        state.timeLeft = QUESTION_TIME;
        updateTimerUI();

        state.timerInterval = setInterval(() => {
            state.timeLeft--;
            updateTimerUI();
            
            if (state.timeLeft <= 5 && state.timeLeft > 0) {
                playSound('tick');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerInterval);
                timeOut();
            }
        }, 1000);
    }

    function updateTimerUI() {
        ui.timeText.textContent = state.timeLeft + 's';
        const percentage = (state.timeLeft / QUESTION_TIME) * 100;
        ui.timerBar.style.width = percentage + '%';

        ui.timerBar.className = '';
        if (percentage <= 25) {
            ui.timerBar.classList.add('danger');
        } else if (percentage <= 50) {
            ui.timerBar.classList.add('warning');
        }
    }

    function stopTimer() {
        clearInterval(state.timerInterval);
    }

    function timeOut() {
        if (state.isAnswering) return;
        state.isAnswering = true;
        playSound('wrong');
        triggerShake();
        state.streak = 0;
        updateStreakUI();
        
        buttons.options.forEach(b => b.disabled = true);
        const q = state.questions[state.currentIndex];
        buttons.options[q.answer].classList.add('correct');
        
        setTimeout(() => {
            showSourceAndNext(q.source, false);
        }, 2000);
    }

    // --- STREAK SYSTEM ---
    function updateStreakUI() {
        if (state.streak >= 3) {
            ui.streakContainer.classList.remove('hidden');
            ui.streakCount.textContent = state.streak;
            // Force reflow to restart animation
            ui.streakContainer.style.animation = 'none';
            ui.streakContainer.offsetHeight; /* trigger reflow */
            ui.streakContainer.style.animation = null; 
        } else {
            ui.streakContainer.classList.add('hidden');
        }
    }

    // --- SPECIAL EFFECTS ---
    function fireConfetti() {
        if(typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffd700', '#4a00e0', '#00b09b']
            });
        }
    }

    function triggerShake() {
        ui.questionContainer.classList.add('shake');
        setTimeout(() => {
            ui.questionContainer.classList.remove('shake');
        }, 500);
    }

    // Initialize Game
    function initGame() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        // Select 5 random questions for each of the 5 difficulty levels
        let selectedQuestions = [];
        for (let level = 1; level <= 5; level++) {
            let levelQuestions = allQuestions.filter(q => q.difficulty === level);
            levelQuestions = shuffleArray(levelQuestions);
            
            // If we don't have enough, take all we have. Ideally we have >5 per level.
            let needed = 5;
            selectedQuestions.push(...levelQuestions.slice(0, needed));
        }

        state.questions = selectedQuestions;
        state.currentIndex = 0;
        state.currentMoney = 0;
        state.safeHavenAmount = 0;
        state.isAnswering = false;
        state.streak = 0;
        state.lifelines = { fiftyFifty: false, phone: false, audience: false };

        updateLifelinesUI();
        updateStreakUI();
        buildMoneyTree();
        showScreen('game', loadQuestion);
    }

    function showScreen(screenName, callback) {
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            if (s !== screens[screenName]) {
                setTimeout(() => { s.style.display = 'none'; }, 500);
            }
        });

        setTimeout(() => {
            screens[screenName].style.display = 'flex';
            setTimeout(() => {
                screens[screenName].classList.add('active');
                if (callback) callback();
            }, 50);
        }, 500);
    }

    function buildMoneyTree() {
        ui.moneyList.innerHTML = '';
        state.questions.forEach((q, idx) => {
            const li = document.createElement('li');
            const levelNames = ["Debutante", "Intermedio", "Avanzado", "Superior", "Experto"];
            const difficultyName = levelNames[q.difficulty - 1] || "Extra";

            li.innerHTML = `<span class="level-num">${idx + 1}</span> <span class="amount">${difficultyName}</span>`;
            if (q.isSafeHaven || (idx + 1) % 5 === 0) li.classList.add('safe');
            ui.moneyList.appendChild(li);
        });
    }

    function updateMoneyTree() {
        const items = ui.moneyList.querySelectorAll('li');
        items.forEach((item, idx) => {
            item.classList.remove('current');
            if (idx === state.currentIndex) {
                item.classList.add('current');
            }
        });
        ui.moneyWon.textContent = formatMoney(state.currentMoney);
    }

    function loadQuestion() {
        if (state.currentIndex >= state.questions.length) {
            fireConfetti();
            playSound('levelUp');
            endGame(true);
            return;
        }

        // Check if level up
        if (state.currentIndex > 0 && state.currentIndex % 5 === 0) {
            fireConfetti();
            playSound('levelUp');
        }

        state.isAnswering = false;
        const q = state.questions[state.currentIndex];
        
        ui.questionNum.textContent = state.currentIndex + 1;
        ui.questionText.textContent = q.question;

        buttons.options.forEach((btn, idx) => {
            const textSpan = btn.querySelector('.option-text');
            textSpan.textContent = q.options[idx];
            btn.className = 'option-button glass-panel'; // Reset classes
            btn.disabled = false;
        });

        updateMoneyTree();
        startTimer();
    }

    function handleOptionClick(e) {
        if (state.isAnswering) return;
        
        stopTimer();
        const btn = e.currentTarget;
        const selectedIdx = parseInt(btn.dataset.index);
        const q = state.questions[state.currentIndex];

        state.isAnswering = true;
        buttons.options.forEach(b => b.disabled = true);
        
        btn.classList.add('selected');
        
        // Suspense click sound
        playSound('tick');

        // Suspense timing
        setTimeout(() => {
            if (selectedIdx === q.answer) {
                // Correct!
                btn.classList.remove('selected');
                btn.classList.add('correct');
                playSound('correct');
                
                state.streak++;
                updateStreakUI();

                // Acumula: base del nivel + bonus por tiempo y racha
                state.currentMoney += q.money + (state.timeLeft * 10 * state.streak);

                // Checkpoint: último de cada nivel (índices 4, 9, 14, 19)
                if (q.isSafeHaven || (state.currentIndex + 1) % 5 === 0) {
                    state.safeHavenAmount = state.currentMoney;
                }
                ui.moneyWon.textContent = formatMoney(state.currentMoney);

                setTimeout(() => {
                    showSourceAndNext(q.source);
                }, 1000);

            } else {
                // Incorrect
                btn.classList.remove('selected');
                btn.classList.add('incorrect');
                buttons.options[q.answer].classList.add('correct');
                playSound('wrong');
                triggerShake();
                state.streak = 0;
                updateStreakUI();

                setTimeout(() => {
                    showSourceAndNext(q.source, false);
                }, 2000);
            }
        }, 1500); // 1.5s suspense
    }

    function showSourceAndNext(sourceText, isCorrect = true) {
        showModal(isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta", sourceText);
        
        ui.audiencePoll.style.display = 'none';
        buttons.modalClose.textContent = isCorrect ? "Siguiente Pregunta" : "Ver Resultados";
        
        buttons.modalClose.onclick = () => {
            closeModal();
            buttons.modalClose.onclick = closeModal; // reset default
            buttons.modalClose.textContent = "Cerrar";
            
            setTimeout(() => {
                if (isCorrect) {
                    state.currentIndex++;
                    loadQuestion();
                } else {
                    endGame(false);
                }
            }, 300);
        };
    }

    function useLifeline(type) {
        if (state.isAnswering || state.lifelines[type]) return;

        const q = state.questions[state.currentIndex];
        state.lifelines[type] = true;
        updateLifelinesUI();
        playSound('levelUp'); // Happy sound for lifeline

        if (type === 'fiftyFifty') {
            let incorrectIndices = [0, 1, 2, 3].filter(i => i !== q.answer);
            incorrectIndices = shuffleArray(incorrectIndices).slice(0, 2);
            
            incorrectIndices.forEach(idx => {
                buttons.options[idx].classList.add('hide-option');
                buttons.options[idx].disabled = true;
            });
        } 
        else if (type === 'phone') {
            const isCorrect = Math.random() < 0.90;
            let suggestedIdx = q.answer;
            if (!isCorrect) {
                let available = [0, 1, 2, 3].filter(i => i !== q.answer && !buttons.options[i].classList.contains('hide-option'));
                suggestedIdx = available[Math.floor(Math.random() * available.length)];
            }
            const letter = String.fromCharCode(65 + suggestedIdx);
            stopTimer(); // Pause timer while modal is open
            showModal("📞 Llamada a un Experto", `El experto te dice: "Estoy bastante seguro de que la respuesta es la ${letter}."`);            
            buttons.modalClose.onclick = () => {
                closeModal();
                startTimer(); // Resume timer
                buttons.modalClose.onclick = closeModal;
            }
        }
        else if (type === 'audience') {
            const votes = [0, 0, 0, 0];
            let remaining = 100;
            
            const correctVotes = Math.floor(Math.random() * 40) + 40; 
            votes[q.answer] = correctVotes;
            remaining -= correctVotes;

            let available = [0, 1, 2, 3].filter(i => i !== q.answer && !buttons.options[i].classList.contains('hide-option'));
            
            available.forEach((idx, i) => {
                if (i === available.length - 1) {
                    votes[idx] = remaining;
                } else {
                    const v = Math.floor(Math.random() * remaining * 0.8);
                    votes[idx] = v;
                    remaining -= v;
                }
            });

            stopTimer();
            showModal("Comodín del Público", "El público ha votado:", votes);
            buttons.modalClose.onclick = () => {
                closeModal();
                startTimer();
                buttons.modalClose.onclick = closeModal;
            }
        }
    }

    function updateLifelinesUI() {
        buttons.lifelines.fiftyFifty.classList.toggle('disabled', state.lifelines.fiftyFifty);
        buttons.lifelines.phone.classList.toggle('disabled', state.lifelines.phone);
        buttons.lifelines.audience.classList.toggle('disabled', state.lifelines.audience);
    }

    function showModal(title, text, pollData = null) {
        ui.modalTitle.textContent = title;
        ui.modalText.textContent = text;
        
        if (pollData) {
            ui.audiencePoll.style.display = 'flex';
            ui.audiencePoll.innerHTML = '';
            
            const labels = ['A', 'B', 'C', 'D'];
            pollData.forEach((percent, idx) => {
                if (!buttons.options[idx].classList.contains('hide-option')) {
                    const barHeight = Math.round(percent * 1.5); // max 150px for 100%
                    const html = `
                        <div class="poll-bar-container">
                            <div class="poll-percent">${percent}%</div>
                            <div class="poll-bar" style="height: 0px"></div>
                            <div class="poll-label">${labels[idx]}</div>
                        </div>
                    `;
                    ui.audiencePoll.insertAdjacentHTML('beforeend', html);
                    const container = ui.audiencePoll.lastElementChild;
                    setTimeout(() => {
                        container.querySelector('.poll-bar').style.height = `${barHeight}px`;
                    }, 100);
                }
            });
        } else {
            ui.audiencePoll.style.display = 'none';
        }

        ui.modal.style.display = 'flex';
        setTimeout(() => ui.modal.classList.add('show'), 10);
    }

    function closeModal() {
        ui.modal.classList.remove('show');
        setTimeout(() => ui.modal.style.display = 'none', 300);
    }

    function endGame(isWin) {
        stopTimer();
        if (isWin) {
            ui.gameOverMsg.textContent = "¡ERES UN BIBLIOSABIO!";
            ui.gameOverMsg.style.color = "#00b09b";
            fireConfetti();
        } else {
            ui.gameOverMsg.textContent = "¡Juego Terminado!";
            ui.gameOverMsg.style.color = "#cb2d3e";
            state.currentMoney = state.safeHavenAmount; 
        }
        
        ui.finalScore.textContent = formatMoney(state.currentMoney);
        showScreen('gameOver');
    }

    // Event Listeners
    buttons.start.addEventListener('click', initGame);
    buttons.playAgain.addEventListener('click', initGame);
    buttons.options.forEach(btn => btn.addEventListener('click', handleOptionClick));
    
    buttons.lifelines.fiftyFifty.addEventListener('click', () => useLifeline('fiftyFifty'));
    buttons.lifelines.phone.addEventListener('click', () => useLifeline('phone'));
    buttons.lifelines.audience.addEventListener('click', () => useLifeline('audience'));
    
    buttons.modalClose.onclick = closeModal;
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}
