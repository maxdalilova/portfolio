const RSS_FEED_URL = "https://www.google.fr/alerts/feeds/11186227470798614956/10976880858622356364";
const PROXY_URL = "https://corsproxy.io/"; 

async function fetchRSS() {
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_FEED_URL));

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Vérifiez la réponse complète du proxy

        if (!data.contents) {
            throw new Error("Données invalides reçues du proxy.");
        }

        const text = data.contents;

        if (!text.startsWith('<?xml')) {
            throw new Error("Le flux RSS ne contient pas de XML valide.");
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        console.log(xml); // Vérifiez le XML après parsing

        // Utilisez <entry> au lieu de <item>
        const entries = Array.from(xml.querySelectorAll("entry"));
        console.log(entries); // Vérifiez si les éléments <entry> sont trouvés

        if (entries.length === 0) {
            document.getElementById("rss-feed").innerHTML = "Aucune alerte trouvée.";
            return;
        }

        let output = "";

        entries.forEach(entry => {
            const title = entry.querySelector("title")?.textContent || "Titre non disponible";
            const link = entry.querySelector("link")?.textContent.trim() || "#"; // Adaptation pour Google Alerts
            let description = entry.querySelector("content")?.textContent || "Aucune description disponible.";

            // Nettoyage du HTML
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = description;
            const sanitizedDescription = tempDiv.textContent || tempDiv.innerText || "";

            output += `
            <div class="project">
                <h3><a href="${link}" target="_blank">${title}</a></h3>
                <p>${sanitizedDescription}</p>
            </div>
            `;
        });

        document.getElementById("rss-feed").innerHTML = output;

    } catch (error) {
        console.error("❌ Erreur lors de la récupération du flux RSS :", error);
        document.getElementById("rss-feed").innerHTML = "Erreur de chargement des alertes.";
    }
}

// Appel de la fonction au chargement de la page
fetchRSS();
