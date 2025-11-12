// ======================================================
// === 🎮 GESTION DU MORPION ET DU PUISSANCE 4 EN JS ===
// ======================================================

// ======================================================
// === SÉLECTION DES ÉLÉMENTS DU DOM ===
// ======================================================
let morpionPlateau = document.querySelector("#Morpion");
let morpionCases = document.querySelectorAll(".case");

let puissance4Plateau = document.querySelector("#Puissance4");
let puissance4Case = document.querySelectorAll(".grid");

let texteStatut = document.querySelector("#statut");
let joueurActuelSpan = document.querySelector("#joueur");

let scoreXElement = document.querySelector("#scoreX");
let scoreOElement = document.querySelector("#scoreO");

let boutonStart = document.querySelector("#Start");
let boutonEndGame = document.querySelector("#EndGame");
let boutonRestart = document.querySelector("#Restart");

let selectMode = document.querySelector("#modeJeu");
let selectGame = document.querySelector("#Jeu");

// ======================================================
// === VARIABLES GLOBALES ===
// ======================================================
let playerOne = "X";
let playertwo = "O";
let actualPlayer;
let etatPlateau = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let modeOrdinateur = true;

let score = { X: 0, O: 0 };

let winCombi = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// ======================================================
// === 🎬 DÉMARRAGE, ARRÊT ET RESTART DU JEU ===
// ======================================================

// Bouton Start
boutonStart.addEventListener("click", function () {
  modeOrdinateur = (selectMode.value === "ordinateur");
  startGame();
});

// Fonction de démarrage du jeu
function startGame() {
  if (selectGame.value == "morpion") {
    // === Initialisation du Morpion ===
    gameActive = true;
    morpionPlateau.innerHTML = ""; // Vide les anciennes cases
    document.getElementById("Puissance4Container").style.display = "none";
    boutonStart.style.display = "none";
    boutonEndGame.style.display = "block";
    boutonRestart.style.display = "none";
    document.getElementById("MorpionContainer").style.display = "block";

    actualPlayer = playerOne;
    etatPlateau = ["", "", "", "", "", "", "", "", ""];
    joueurActuelSpan.textContent = actualPlayer;
    texteStatut.textContent = "Au tour de : ";
    texteStatut.appendChild(joueurActuelSpan);

    for (let i = 0; i < 9; i++) {
      let square = document.createElement("div");
      square.setAttribute("class", "case");
      square.setAttribute("id", "case" + i);
      square.addEventListener("click", clicCase);
      morpionPlateau.appendChild(square);
    }
    morpionCases = document.querySelectorAll(".case");

  } else if (selectGame.value == "puissance4") {
    // === Initialisation du Puissance 4 ===
    gameActive = true;
    etatPlateau = [];
    for (let i = 0; i < 42; i++) {
      etatPlateau.push("");
    }
    puissance4Plateau.innerHTML = ""; // Vide la grille
    document.getElementById("MorpionContainer").style.display = "none";
    boutonStart.style.display = "none";
    boutonEndGame.style.display = "block";
    boutonRestart.style.display = "none";
    document.getElementById("Puissance4Container").style.display = "block";

    actualPlayer = playerOne;
    joueurActuelSpan.textContent = actualPlayer;
    texteStatut.textContent = "Au tour de : ";
    texteStatut.appendChild(joueurActuelSpan);

    for (let i = 0; i < 42; i++) {
      let square = document.createElement("div");
      square.setAttribute("class", "grid");
      square.setAttribute("id", "p4case" + i);
      square.addEventListener("click", clicP4);
      puissance4Plateau.appendChild(square);
    }
    puissance4Case = document.querySelectorAll(".grid");
  }
}

// Bouton EndGame
boutonEndGame.addEventListener("click", function () {
  stopGame("Partie arretée");
});

// Fonction pour arrêter une partie
function stopGame(message) {
  gameActive = false;
  boutonEndGame.style.display = "none";
  boutonRestart.style.display = "block";

  const elements = document.querySelectorAll(".case, .grid");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.pointerEvents = "none";
  }

  texteStatut.textContent = message;
}

// Bouton Restart
boutonRestart.addEventListener("click", function () {
  startGame();
});

// ======================================================
// === 🧩 FONCTIONS DE CLIC : MORPION & PUISSANCE 4 ===
// ======================================================

// --- Clic sur une case du Morpion ---
function clicCase() {
  if (!gameActive || this.textContent !== "") return;

  let index = Array.from(morpionCases).indexOf(this);
  etatPlateau[index] = actualPlayer;
  this.textContent = actualPlayer;
  this.disabled = true;

  // Ajout de couleur si c’est un joueur O (et non l’ordinateur)
  if (!modeOrdinateur && actualPlayer === "O") {
    this.style.color = "red"; // ou n’importe quelle couleur
  } else if (!modeOrdinateur && actualPlayer === "X") {
    this.style.color = "blue"; // optionnel, pour équilibrer visuellement
  }
  if (verifierVictoireM()) {
    gameActive = false;
    texteStatut.textContent = "Le joueur " + actualPlayer + " gagne !";
    score[actualPlayer]++;
    mettreAJourScore();
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  if (!casesDisponiblesM()) {
    gameActive = false;
    texteStatut.textContent = "Égalité";
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  actualPlayer = (actualPlayer === playerOne) ? "O" : "X";
  joueurActuelSpan.textContent = actualPlayer;

  if (modeOrdinateur && actualPlayer === "O" && gameActive) {
    setTimeout(tourOrdinateur, 500);
  }
}

// --- Clic sur une case du Puissance 4 ---
function clicP4() {
  if (!gameActive) return;

  const index = Array.from(puissance4Case).indexOf(this);
  const col = index % 7;

  // Trouve la case libre la plus basse dans la colonne
  for (let row = 5; row >= 0; row--) {
    const i = row * 7 + col;
    if (etatPlateau[i] === "") {
      etatPlateau[i] = actualPlayer;
      let cell = document.getElementById("p4case" + i);
      cell.textContent = actualPlayer;
      cell.classList.add("drop");
      // Couleur différente si mode joueur vs joueur
      if (!modeOrdinateur && actualPlayer === "O") {
        cell.style.color = "red";
      } else if (!modeOrdinateur && actualPlayer === "X") {
        cell.style.color = "blue";
      }
      setTimeout(() => cell.classList.remove("drop"), 500);
      break;
    }
  }

  if (verifierVictoireP()) {
    texteStatut.textContent = "Le joueur " + actualPlayer + " gagne !";
    gameActive = false;
    score[actualPlayer]++;
    mettreAJourScore();
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  if (!casesDisponiblesP()) {
    texteStatut.textContent = "Égalité";
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    gameActive = false;
    return;
  }

  actualPlayer = actualPlayer === "X" ? "O" : "X";
  joueurActuelSpan.textContent = actualPlayer;

  if (modeOrdinateur && actualPlayer === "O" && gameActive) {
    setTimeout(tourOrdinateur, 500);
  }
}

// ======================================================
// === 💻 TOUR AUTOMATIQUE DE L’ORDINATEUR ===
// ======================================================
function tourOrdinateur() {
  if (!gameActive) return;

  // === MORPION ===
  if (selectGame.value == "morpion") {
    let casesVides = [];
    for (let i = 0; i < etatPlateau.length; i++) {
      if (etatPlateau[i] === "") casesVides.push(i);
    }

    if (casesVides.length === 0) return;

    let choix = casesVides[Math.floor(Math.random() * casesVides.length)];
    etatPlateau[choix] = "O";
    document.getElementById("case" + choix).textContent = "O";
    document.getElementById("case" + choix).style.color = "red"
    document.getElementById("case" + choix).disabled = true;

    if (verifierVictoireM()) {
      gameActive = false;
      texteStatut.textContent = "L’ordinateur gagne !";
      score["O"]++;
      mettreAJourScore();
      boutonEndGame.style.display = "none";
      boutonRestart.style.display = "block";
      return;
    }

    if (!casesDisponiblesM()) {
      gameActive = false;
      texteStatut.textContent = "Égalité";
      boutonEndGame.style.display = "none";
      boutonRestart.style.display = "block";
      return;
    }

    actualPlayer = "X";
    joueurActuelSpan.textContent = actualPlayer;
  }

  // === PUISSANCE 4 ===
  else if (selectGame.value == "puissance4") {
    const colonnes = 7;
    const lignes = 6;

    // Cherche les colonnes jouables
    let colonnesDisponibles = [];
    for (let c = 0; c < colonnes; c++) {
      if (etatPlateau[c] === "" || etatPlateau[(lignes - 1) * colonnes + c] === "")
        colonnesDisponibles.push(c);
    }

    if (colonnesDisponibles.length === 0) return;

    // Choisit une colonne aléatoire
    let colChoisie = colonnesDisponibles[Math.floor(Math.random() * colonnesDisponibles.length)];

    // Trouve la case libre la plus basse
    let ligneChoisie = -1;
    for (let r = lignes - 1; r >= 0; r--) {
      let index = r * colonnes + colChoisie;
      if (etatPlateau[index] === "") {
        ligneChoisie = r;
        break;
      }
    }

    if (ligneChoisie === -1) return; // Sécurité

    let choix = ligneChoisie * colonnes + colChoisie;
    etatPlateau[choix] = "O";

    let cell = document.getElementById("p4case" + choix);
    cell.textContent = "O";
    cell.style.color = "red"
    cell.classList.add("drop");
    setTimeout(() => cell.classList.remove("drop"), 500);

    if (verifierVictoireP()) {
      gameActive = false;
      texteStatut.textContent = "L’ordinateur gagne !";
      score["O"]++;
      mettreAJourScore();
      boutonEndGame.style.display = "none";
      boutonRestart.style.display = "block";
      return;
    }

    if (!casesDisponiblesP()) {
      gameActive = false;
      texteStatut.textContent = "Égalité";
      boutonEndGame.style.display = "none";
      boutonRestart.style.display = "block";
      return;
    }

    actualPlayer = "X";
    joueurActuelSpan.textContent = actualPlayer;
  }
}

// ======================================================
// === 🏆 FONCTIONS DE VÉRIFICATION ET SCORE ===
// ======================================================
function verifierVictoireM() {
  for (let [a, b, c] of winCombi) {
    if (etatPlateau[a] && etatPlateau[a] === etatPlateau[b] && etatPlateau[a] === etatPlateau[c]) {
      return true;
    }
  }
  return false;
}

function verifierVictoireP() {
  const colonnes = 7;
  const lignes = 6;
  const getCase = (r, c) => etatPlateau[r * colonnes + c];

  for (let r = 0; r < lignes; r++) {
    for (let c = 0; c < colonnes; c++) {
      let joueur = getCase(r, c);
      if (!joueur) continue;

      // Horizontal
      if (c + 3 < colonnes &&
        joueur === getCase(r, c + 1) &&
        joueur === getCase(r, c + 2) &&
        joueur === getCase(r, c + 3)) return true;

      // Vertical
      if (r + 3 < lignes &&
        joueur === getCase(r + 1, c) &&
        joueur === getCase(r + 2, c) &&
        joueur === getCase(r + 3, c)) return true;

      // Diagonale ↘
      if (r + 3 < lignes && c + 3 < colonnes &&
        joueur === getCase(r + 1, c + 1) &&
        joueur === getCase(r + 2, c + 2) &&
        joueur === getCase(r + 3, c + 3)) return true;

      // Diagonale ↙
      if (r + 3 < lignes && c - 3 >= 0 &&
        joueur === getCase(r + 1, c - 1) &&
        joueur === getCase(r + 2, c - 2) &&
        joueur === getCase(r + 3, c - 3)) return true;
    }
  }

  return false;
}

// Vérifie s’il reste des cases vides
function casesDisponiblesM() { return etatPlateau.includes(""); }
function casesDisponiblesP() { return etatPlateau.includes(""); }

// Met à jour l’affichage du score
function mettreAJourScore() {
  scoreXElement.textContent = score.X;
  scoreOElement.textContent = score.O;
}

// ======================================================
// === 🔄 CHANGEMENT AUTOMATIQUE DE MODE OU DE JEU ===
// ======================================================
selectGame.addEventListener("change", function () {
  if (gameActive) stopGame("Changement de jeu détecté !");
  modeOrdinateur = (selectMode.value === "ordinateur");
  startGame();
});

selectMode.addEventListener("change", function () {
  if (gameActive) stopGame("Changement de mode !");
  modeOrdinateur = (selectMode.value === "ordinateur");
  startGame();
});
