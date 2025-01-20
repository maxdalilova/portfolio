function loadData() {
    fetch('skills_data.json')
        .then(response => response.json())
        .then(data => {
            const competenceId = window.location.hash.slice(1);
            const competence = data.skills.find(skill => skill.id === competenceId);

            const competencesSection = document.getElementById('competences-section');
            const sourcesSection = document.getElementById('sources-section');
            const competencesGrid = document.getElementById('competences-grid');
            const sourcesGrid = document.getElementById('sources-grid');
            const competenceTitle = document.getElementById('competence-title');

            // Vérifier si les éléments HTML existent
            if (!competencesSection || !sourcesSection || !competencesGrid || !sourcesGrid || !competenceTitle) {
                console.error("Un ou plusieurs éléments HTML requis sont introuvables.");
                return;
            }

            if (competence) {
                // Afficher la section des compétences
                competencesSection.style.display = 'block';
                sourcesSection.style.display = 'none'; // Masquer initialement la section des sources

                // Mettre à jour le titre de la compétence sélectionnée
                competenceTitle.textContent = competence.title;

                // Réinitialisation des contenus
                competencesGrid.innerHTML = "";
                sourcesGrid.innerHTML = "";

                // Affichage des compétences (sous-catégories)
                Object.entries(competence.competences).forEach(([compTitle, sources]) => {
                    const compDiv = document.createElement('div');
                    compDiv.classList.add('project');
                    compDiv.innerHTML = `<h3>${compTitle}</h3>`;
                    
                    // Ajouter un gestionnaire de clic sur chaque sous-compétence
                    compDiv.addEventListener('click', () => {
                        displaySources(sources); // Afficher les sources quand la compétence est cliquée
                    });

                    competencesGrid.appendChild(compDiv);
                });

            } else {
                // Si aucune compétence n'est sélectionnée, cacher les sections
                competencesSection.style.display = 'none';
                sourcesSection.style.display = 'none';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données :', error));
}

// Fonction pour afficher les sources
function displaySources(sources) {
    const sourcesGrid = document.getElementById('sources-grid');
    const sourcesSection = document.getElementById('sources-section');

    // Réinitialisation du contenu des sources
    sourcesGrid.innerHTML = "";

    let hasSources = false; // Vérifier s'il y a des sources

    sources.forEach(source => {
        if (source.trim() !== "") {
            hasSources = true;
            const sourceDiv = document.createElement('div');
            sourceDiv.classList.add('skill');

            if (source.endsWith(".png") || source.endsWith(".jpg")) {
                sourceDiv.innerHTML = `<img src="${source}" alt="Image source">`;
            } else {
                sourceDiv.innerHTML = `<p>${source}</p>`;
            }

            sourcesGrid.appendChild(sourceDiv);
        }
    });

    // Afficher ou masquer la section des sources
    sourcesSection.style.display = hasSources ? 'block' : 'none';
}

// Charger les compétences au chargement et lors d’un changement d’URL
window.onload = loadData;
window.onhashchange = loadData;
