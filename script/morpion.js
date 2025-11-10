let plateau = document.querySelector("#Morpion")
let cases = document.querySelectorAll("#Morpion .case")

let texteStatut = document.querySelector("#statut");
let joueurActuelSpan = document.querySelector("#joueur");

let scoreXElement = document.querySelector("#scoreX");
let scoreOElement = document.querySelector("#scoreO");

let boutonStart = document.querySelector("#Start");
let boutonEndGame = document.querySelector("#EndGame");
let boutonRestart = document.querySelector("#Restart");

let selectMode = document.querySelector("#modeJeu")

let actualPlayer = "X"
let etatPlateau = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let modeOrdi = true;

let score = {
  X: 0,
  O: 0
};

let winCombi = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];
boutonStart.addEventListener("click", function () {
  modeOrdinateur = (selectMode.value === "ordinateur");
  startGame();
})

function startGame() {
  gameActive = true;
  boutonStart.style.display = "none"
  boutonEndGame.style.display = "block"
  boutonRestart.style.display = "none"
  document.getElementById("MorpionContainer").style.display = "block"
  actualPlayer = "X"
  etatPlateau = ["", "", "", "", "", "", "", "", ""]
  joueurActuelSpan.textContent = actualPlayer;
  texteStatut.textContent = "Au tour de : ";
  texteStatut.appendChild(joueurActuelSpan);

  cases = document.querySelectorAll("#Morpion .case");
  for (let i = 0; i < cases.length; i++) {
    cases[i].textContent = ""
    cases[i].disabled = false
    cases[i].addEventListener("click", clicCase)
  }
}

boutonEndGame.addEventListener("click", function () {
  stopGame("Partie arretée")
})

function stopGame(message) {
  gameActive = false
  boutonEndGame.style.display = "none"
  boutonRestart.style.display = "block"
  for (let i = 0; i < cases.length; i++) {
    cases[i].disabled = true;
  }
  texteStatut.textContent = message;
}

boutonRestart.addEventListener("click", function () {
  startGame()
})

function clicCase(e) {
  if (!gameActive) return;

  let idCase = e.currentTarget.id;
  let index = parseInt(idCase.replace("case", ""), 10);

  if (etatPlateau[index] !== "") return;

  // Le joueur humain joue
  etatPlateau[index] = actualPlayer;
  e.currentTarget.textContent = actualPlayer;
  e.currentTarget.disabled = true;

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
    texteStatut.textContent = "Égalité ";

    boutonEndGame.style.display = "none";
    boutonRestart.style.display = "block";
    return;
  }

  // Tour suivant
  actualPlayer = (actualPlayer === "X") ? "O" : "X";
  joueurActuelSpan.textContent = actualPlayer;

  // Si mode ordinateur activé
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
  joueurActuelSpan.textContent = actualPlayerl;
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
