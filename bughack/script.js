// Elementos do DOM
const playerPasswordDisplay = document.getElementById('player-password');
const attemptsList = document.getElementById('attempts-list');
const bugIndicators = document.getElementById('bug-indicators');
const numberKeys = document.querySelectorAll('.key[data-value]');
const clearButton = document.querySelector('.action-key.clear');
const enterButton = document.querySelector('.action-key.enter');
const currentInputDisplay = document.getElementById('current-input');
const startGameBtn = document.getElementById('start-game-btn');

// Variáveis do Jogo
let playerPassword = []; // Senha secreta do jogador (gerada ou digitada)
let currentAttempt = []; // Tentativa atual do jogador
let bugCount = 0;
const MAX_BUGS = 3;
const PASSWORD_LENGTH = 3;

// --- Funções do Jogo ---

// 1. Iniciar o Jogo
startGameBtn.addEventListener('click', startGame);

function startGame() {
    // Resetar o jogo
    playerPassword = generateRandomPassword(); // Ou pedir para o jogador digitar
    currentAttempt = [];
    bugCount = 0;
    attemptsList.innerHTML = '';
    updateBugDisplay();
    updateCurrentInputDisplay();
    //playerPasswordDisplay.textContent = playerPassword.join('-'); // Mostra a senha para o jogador ver (para teste)
    
    // Desabilitar o botão de iniciar jogo e habilitar os controles
    startGameBtn.disabled = true;
    toggleInputControls(false); // Habilita os controles
    //alert("Jogo Iniciado! Sua senha é: " + playerPassword.join('-') + ". Tente adivinhar a senha do outro jogador!");
}

// 2. Gerar uma senha aleatória de 3 dígitos
function generateRandomPassword() {
    const password = [];
    for (let i = 0; i < PASSWORD_LENGTH; i++) {
        password.push(Math.floor(Math.random() * 10)); // Números de 0 a 9
    }
    return password;
}

// 3. Gerenciar o input do teclado numérico
numberKeys.forEach(key => {
    key.addEventListener('click', () => {
        if (currentAttempt.length < PASSWORD_LENGTH) {
            currentAttempt.push(parseInt(key.dataset.value));
            updateCurrentInputDisplay();
        }
    });
});

clearButton.addEventListener('click', () => {
    currentAttempt = [];
    updateCurrentInputDisplay();
});

enterButton.addEventListener('click', checkAttempt);

function updateCurrentInputDisplay() {
    currentInputDisplay.textContent = currentAttempt.join('') || '---';
}

// 4. Checar a tentativa
function checkAttempt() {
    if (currentAttempt.length !== PASSWORD_LENGTH) {
        alert(`A senha deve ter ${PASSWORD_LENGTH} dígitos!`);
        return;
    }

    // AQUI VOCÊ DEVERIA ENVIAR A TENTATIVA PARA O "OUTRO JOGADOR"
    // E RECEBER O FEEDBACK DELE.
    // Para simplificar, vamos simular o feedback contra a PRÓPRIA SENHA DO JOGADOR
    // (A ideia é que ele esteja jogando contra outro que faria essa verificação).

    // --- Simulação de feedback contra a própria senha do jogador (para teste) ---
    const feedback = getFeedback(playerPassword, currentAttempt);
    displayAttempt(currentAttempt, feedback);

    let allWrong = feedback.every(f => f === '❌');
    if (allWrong) {
        bugCount++;
        updateBugDisplay();
        if (bugCount >= MAX_BUGS) {
            alert("Sistema BUGADO! Você perdeu sua vez!");
            toggleInputControls(true); // Desabilita os controles
            // Aqui você poderia adicionar lógica para passar a vez ou reiniciar
            startGameBtn.disabled = false; // Permite iniciar um novo jogo
        }
    }

    if (feedback.every(f => f === '✔️')) {
        alert("Parabéns! Você descobriu a senha!");
        toggleInputControls(true);
        startGameBtn.disabled = false;
    }

    currentAttempt = [];
    updateCurrentInputDisplay();
}

// Função para obter o feedback (simulando a verificação do outro jogador)
function getFeedback(secretPassword, guess) {
    const feedback = new Array(PASSWORD_LENGTH).fill('');
    const secretCopy = [...secretPassword]; // Copia para modificação

    // Primeiro verifica os acertos (posição e número corretos)
    for (let i = 0; i < PASSWORD_LENGTH; i++) {
        if (guess[i] === secretCopy[i]) {
            feedback[i] = '✔️';
            secretCopy[i] = null; // Marca como usado para não ser contado em "bug" ou "erro"
            guess[i] = null; // Marca a tentativa como usada também
        }
    }

    // Depois verifica os bugs (número correto, posição errada)
    for (let i = 0; i < PASSWORD_LENGTH; i++) {
        if (guess[i] !== null) { // Se não foi um acerto
            const indexInSecret = secretCopy.indexOf(guess[i]);
            if (indexInSecret !== -1) {
                feedback[i] = '🌀';
                secretCopy[indexInSecret] = null; // Marca como usado
            } else {
                feedback[i] = '❌'; // Não existe na senha
            }
        }
    }
    return feedback;
}


// 5. Exibir a tentativa e o feedback na tela
function displayAttempt(attempt, feedback) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${attempt.join('-')}</span>
        ${feedback.map(f => `<span class="feedback-icon">${f}</span>`).join('')}
    `;
    attemptsList.prepend(listItem); // Adiciona a última tentativa no topo
}

// 6. Atualizar o display de bugs
function updateBugDisplay() {
    bugIndicators.innerHTML = '';
    for (let i = 0; i < MAX_BUGS; i++) {
        const bugIcon = document.createElement('span');
        bugIcon.classList.add('bug-icon');
        bugIcon.textContent = (i < bugCount) ? '✖️' : '⚪'; // X para bug, círculo para vazio
        bugIndicators.appendChild(bugIcon);
    }
}

// 7. Desabilitar/Habilitar controles de input (teclado)
function toggleInputControls(disable) {
    numberKeys.forEach(key => key.disabled = disable);
    clearButton.disabled = disable;
    enterButton.disabled = disable;
}

// Inicializar o estado do jogo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateBugDisplay();
    updateCurrentInputDisplay();
    toggleInputControls(true); // Começa com os controles desabilitados
});