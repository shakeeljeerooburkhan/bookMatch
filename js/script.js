// --- Stockage des réponses ---
const selections = { step1: null, step2: null, step3: null, step4: null, step5: null, step6: null, step7: null };

const PROFILE_NAMES = {
  A: "CURIEUX HUMANISTE",
  B: "CRÉATIF ENGAGÉ",
  C: "STRATEGE ANALYSTE",
  D: "DÉFENSEUR DES IDÉES",
  E: "EXPLORATEUR DE L'AME",
}; 

const BOOKS_DATABASE = {
  A: [
    { title: "Internet : ce qui nous échappe temps, énergie, gestion de nos données", author: "Coline Tison", loc: "Salle rouge", img: "img/CH1.png" },
    { title: "Scroller: l'art de faire défiler la vie", author: "Laurent Tessier", loc: "Salle rouge", img: "img/CH2.png" },
    { title: "Les frontières numériques", author: "Imad Saleh, Nasreddine Bouhaï, Hakim Hachour", loc: "Salle rouge", img: "img/CH3.png" },
    { title: "Sociologie du numérique", author: "Dominique Boullier", loc: "Salle rouge", img: "img/CH4.png" },
    { title: "La vie privée à l'ère du numérique", author: "Bénédicte Rey", loc: "Salle rouge", img: "img/CH5.png" }
  ],
  B: [
    { title: "Le double : voyage dans le monde miroir", author: "Naomi Klein", loc: "Salle rouge", img: "img/CE1.png" },
    { title: "Les décodeuses du numérique", author: "Léa Cabor, Célia Esnoult, Laure Thiébault", loc: "Salle rouge", img: "img/CE2.png" },
    { title: "L'art des IA", author: "Gabaret, Jim", loc: "Salle bleue", img: "img/CE3.png" },
    { title: "Tous influencés par les réseaux sociaux ?", author: "Julien Nocetti", loc: "Salle rouge", img: "img/CE4.png" },
    { title: "Tempête dans le bocal : comment naviguer serein à l'ère de l'utraconnexion", author: "Bruno Patino", loc: "Salle rouge", img: "img/CE5.png" }
  ],
  C: [
    { title: "Internet et libertés ", author: "Mathieu Labonde, Lou Malhuret, Benoît Piédallu, Axel Simon", loc: "Salle rouge", img: "img/SA1.png" },
    { title: "Culture numérique", author: "Dominique Cardon", loc: "Salle rouge", img: "img/SA2.png" },
    { title: "Datamania : le grand pillage de nos données personnelles", author: "Audric Gueidan ", loc: "Salle rouge", img: "img/SA3.png" },
    { title: "Sécurité informatique", author: "Laurent Bloch, Christophe Wolfhugel, Ary Kokos, Gérôme Billois, Arnaud Soullié, Alexandre Anzala-Yamajako, Thomas Debize", loc: "Salle bleue", img: "img/SA4.png" },
    { title: "Blockchain et monnaies numériques", author: "Enée Bussac", loc: "Salle violette", img: "img/SA5.png" }
  ],
  D: [
    { title: "L'identité numérique dans le droit et la pratique", author: "Caprioli, Éric A.", loc: "Salle verte", img: "img/DI1.png" },
    { title: "Internet et libertés ", author: "Mathieu Labonde, Lou Malhuret, Benoît Piédallu, Axel Simon", loc: "Salle rouge", img: "img/DI2.png" },
    { title: "RGPD simple et pratique", author: "Frédéric Manzano", loc: "Salle verte", img: "img/DI3.png" },
    { title: "Code du numérique", author: " Pascal Agosti, Isabelle Cantero, Eric A. Caprioli, Ilène Choukri", loc: "???", img: "img/DI4.png" },
    { title: "La protection des données personnelles", author: " Laurane Raimondo", loc: "Salle bleue", img: "img/DI5.png" }
  ],
  E: [
    { title: "Apprivoiser les écrans et grandir", author: "Serge Tisseron", loc: "Salle rouge", img: "img/EdA1.png" },
    { title: "Technologies numériques du soi et (co-)constructions identitaires", author: "Fred Dervin, Yasmine Abbas", loc: "Salle rouge", img: "img/EdA2.png" },
    { title: "Identité(s) : métamorphoses identitaires à l’ère d’Internet et de la globalisation", author: "Yves Enrègle, Pascal Lardellier, Richard Delaye", loc: "Salle rouge", img: "img/EdA3.png" },
    { title: "Je : une traversée des identités", author: "Clotilde Leguil", loc: "Salle rouge", img: "img/EdA4.png" },
    { title: "Traces numériques : de la production à l'interprétation", author: "Béatrice Galinon-Mélénec, Sami Zlitni", loc: "Salle rouge", img: "img/EdA5.png" }
  ]
};

// --- Helpers ---
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const screens = $$('.screen');
const liveRegion = $('#live-region');

// --- Gestion de la barre de progression ---
function updateProgressBar(stepNumber) {
  const totalSteps = 7;
  const percentage = (stepNumber / totalSteps) * 100;
  
  // On cherche l'écran qui devient actif
  const targetScreen = document.querySelector(`.screen[data-step="${stepNumber}"]`);
  if (targetScreen) {
    const progressBar = targetScreen.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  }
}

// --- Affichage des écrans ---
function showScreen(stepOrFinal) {
  screens.forEach(scr => {
    const isFinal = (stepOrFinal === 'final' && scr.id === 'final-screen');
    const isTarget = isFinal || (scr.dataset.step === String(stepOrFinal));
    scr.classList.toggle('is-active', isTarget);
    scr.setAttribute('aria-hidden', isTarget ? 'false' : 'true');
  });

  if (stepOrFinal !== 'final') {
    updateProgressBar(stepOrFinal);
  }

  liveRegion.textContent = (stepOrFinal === 'final') 
    ? 'Écran final affiché.' 
    : `Étape ${stepOrFinal} active.`;
}

// --- Gestion du choix ---
function handleChoice(cardEl) {
  const parentScreen = cardEl.closest('.screen');
  const step = Number(parentScreen.dataset.step);

  // Récupération des données data-label et data-type du HTML
  const label = cardEl.dataset.label;
  const type  = cardEl.dataset.type;

  selections[`step${step}`] = { label, type };

  if (step < 7) {
    showScreen(step + 1);
  } else {
    showResult();
    showScreen('final');
  }
}

//fhiefj
function initCarousel() {
  const container = document.querySelector('.carousel-container');
  const items = document.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  if (!container || items.length === 0) return;

  // On retire l'ancien événement pour éviter les bugs si on recommence le quiz
  container.onclick = null;

  container.onclick = () => {
    // Masquer l'item actuel
    items[currentIndex].classList.remove('active');
    
    // Calculer le suivant
    currentIndex = (currentIndex + 1) % items.length;
    
    // Afficher le suivant
    items[currentIndex].classList.add('active');
  };
}

// --- Rendu du résultat ---
function showResult() {
  // --- 1. Calcul du score ---
  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  
  Object.values(selections).forEach(selection => {
    // CORRECTION : On vérifie selection.type car selection est un objet
    if (selection && selection.type && counts[selection.type] !== undefined) {
      counts[selection.type]++;
    }
  });

  let bestType = 'A';
  let bestScore = -1;
  // ... (le reste de la fonction reste identique)
  Object.entries(counts).forEach(([type, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  });

  const profileName = PROFILE_NAMES[bestType] || "Profil inconnu";

  // --- 2. Affichage du nom du profil à gauche ---
  const summary = document.getElementById('summary');
  if (summary) {
    summary.innerHTML = `
      <div class="summary__row">
        <div class="result-profile neon-soft">${profileName}</div>
      </div>
    `;
  }

  // --- 3. Génération dynamique des 5 livres à droite ---
  const books = BOOKS_DATABASE[bestType] || [];
  const carouselInner = document.querySelector('.carousel-inner');

  if (carouselInner && books.length > 0) {
    // On vide les images statiques et on met les livres de la base de données
    carouselInner.innerHTML = books.map((book, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${book.img}" class="carousel-img" alt="${book.title}">
        <div class="book-overlay">
          <div class="book-title">${book.title}</div>
          <div class="book-author">${book.author}</div>
          <div class="book-location">
            <i class="fa-solid fa-location-dot"></i> ${book.loc}
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- 4. Activation du clic manuel ---
  initCarousel();
}



// --- Liaison des événements ---
function wireChoices() {
  // On utilise une délégation d'événement pour être sûr de capter le clic sur la carte
  document.addEventListener('click', (e) => {
    const choiceCard = e.target.closest('.choice');
    if (choiceCard) {
      handleChoice(choiceCard);
    }
  });
}

function wireRestart() {
  const restartBtn = $('#restart');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      for (let i = 1; i <= 7; i++) selections[`step${i}`] = null;
      showScreen(1);
    });
  }
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
  wireChoices();
  wireRestart();
  showScreen(1);
});

// Gestion du bouton retour
document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('.back-button');
  if (backBtn) {
    const parentScreen = backBtn.closest('.screen');
    const currentStep = Number(parentScreen.dataset.step);

    if (currentStep > 1) {
      showScreen(currentStep - 1);
    } else {
      // Si on est à l'étape 1, on peut retourner à l'accueil
      window.location.href = "accueil.html";
    }
  }

});