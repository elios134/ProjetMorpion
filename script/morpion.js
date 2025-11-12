// === Sélection des éléments ===
let morpionPlateau = document.querySelector("#Morpion");
let morpionCases = document.querySelectorAll(".case");

let puissance4Plateau = document.querySelector("#Puissance4")
let puissance4Case = document.querySelectorAll(".grid")

let texteStatut = document.querySelector("#statut");
let joueurActuelSpan = document.querySelector("#joueur");

let scoreXElement = document.querySelector("#scoreX");
let scoreOElement = document.querySelector("#scoreO");

let boutonStart = document.querySelector("#Start");
let boutonEndGame = document.querySelector("#EndGame");
let boutonRestart = document.querySelector("#Restart");

let selectMode = document.querySelector("#modeJeu");
let selectGame = document.querySelector("#Jeu");

// === Variables globales ===
let playerOne = "X";
let playertwo = "O"
let actualPlayer
let etatPlateau = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let modeOrdinateur = true;

let score = {
  X: 0,
  O: 0
};

let winCombi = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// === Bouton Start ===
boutonStart.addEventListener("click", function () {
  modeOrdinateur = (selectMode.value === "ordinateur");
  startGame();
})

function startGame() {
  if (selectGame.value == "morpion") {
    gameActive = true;
    morpionPlateau.innerHTML = ""; // 🔥 vide les anciennes cases
    document.getElementById("Puissance4Container").style.display = "none";
    boutonStart.style.display = "none"
    boutonEndGame.style.display = "block"
    boutonRestart.style.display = "none"
    document.getElementById("MorpionContainer").style.display = "block"
    actualPlayer = playerOne
    etatPlateau = ["", "", "", "", "", "", "", "", ""]
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
    gameActive = true;
    puissance4Plateau.innerHTML = ""; //  vide la grille
    document.getElementById("MorpionContainer").style.display = "none"
    boutonStart.style.display = "none"
    boutonEndGame.style.display = "block"
    boutonRestart.style.display = "none"
    document.getElementById("Puissance4Container").style.display = "block"
    actualPlayer = playerOne
    joueurActuelSpan.textContent = actualPlayer;
    texteStatut.textContent = "Au tour de : ";
    texteStatut.appendChild(joueurActuelSpan);
    puissance4Case = document.querySelectorAll(".grid");
    for (let i = 0; i < 42; i++) {
      let square = document.createElement("div")
      square.setAttribute("class", "grid")
      square.addEventListener("click", clicP4);
      puissance4Plateau.appendChild(square)
    }
  }
}

boutonEndGame.addEventListener("click", function () {
  stopGame("Partie arretée")
})

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


boutonRestart.addEventListener("click", function () {
  startGame()
})

function clicCase() {
  if (!gameActive || this.textContent !== "") return;

  let index = Array.from(morpionCases).indexOf(this);
  etatPlateau[index] = actualPlayer;
  this.textContent = actualPlayer;
  this.disabled = true;

  if (verifierVictoire()) {
    gameActive = false;
    texteStatut.textContent = "Le joueur " + actualPlayer + " gagne !";
    score[actualPlayer]++;
    mettreAJourScore();
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  if (!casesDisponibles()) {
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

function clicP4() {
  if (!gameActive || this.textContent !== "") return;

  let index = Array.from(puissance4Case).indexOf(this);
  etatPlateau[index] = actualPlayer;
  this.textContent = actualPlayer;
  this.disabled = true;

  if (verifierVictoire()) {
    gameActive = false;
    texteStatut.textContent = "Le joueur " + actualPlayer + " gagne !";
    score[actualPlayer]++;
    mettreAJourScore();
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  if (!casesDisponibles()) {
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


function tourOrdinateur() {
  if (!gameActive) return;

  let casesVides = [];
  for (let i = 0; i < etatPlateau.length; i++) {
    if (etatPlateau[i] === "") casesVides.push(i);
  }

  if (casesVides.length === 0) return;

  let choix = casesVides[Math.floor(Math.random() * casesVides.length)];
  etatPlateau[choix] = "O";
  document.getElementById("case" + choix).textContent = "O";
  document.getElementById("case" + choix).disabled = true;

  if (verifierVictoire()) {
    gameActive = false;
    texteStatut.textContent = "L’ordinateur gagne !";
    score["O"]++;
    mettreAJourScore();
    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  if (!casesDisponibles()) {
    gameActive = false;
    texteStatut.textContent = "Égalité";

    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  actualPlayer = "X";
  joueurActuelSpan.textContent = actualPlayer;
}

function verifierVictoire() {
  for (let [a, b, c] of winCombi) {
    if (etatPlateau[a] && etatPlateau[a] === etatPlateau[b] && etatPlateau[a] === etatPlateau[c]) {
      return true;
    }
  }
  return false;
}

function casesDisponibles() {
  return etatPlateau.includes("");
}

function mettreAJourScore() {
  scoreXElement.textContent = score.X;
  scoreOElement.textContent = score.O;
}



