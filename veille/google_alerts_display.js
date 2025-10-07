const RSS_FEED_URL = "https://www.google.fr/alerts/feeds/11186227470798614956/17038765441040678728";
const PROXY_URL = "https://corsproxy.io/?url=";

async function fetchRSS() {
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_FEED_URL));

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const text = await response.text();

        if (!text.startsWith('<?xml')) {
            throw new Error("Le flux RSS ne contient pas de XML valide.");
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        // Vérifie les erreurs de parsing XML
        const parsererror = xml.querySelector("parsererror");
        if (parsererror) {
            throw new Error("Erreur lors du parsing XML : " + parsererror.textContent);
        }

        const entries = Array.from(xml.querySelectorAll("entry")).slice(0, 6); // 🔥 Limitée à 6

        if (entries.length === 0) {
            document.getElementById("rss-feed").innerHTML = "Aucune alerte trouvée.";
            return;
        }

        let output = "";

        entries.forEach(entry => {
            const title = entry.querySelector("title")?.textContent || "Titre non disponible";

            // Google Alerts : le lien est dans l’attribut href
            const linkElement = entry.querySelector("link");
            const link = linkElement?.getAttribute("href") || "#";

            let description = entry.querySelector("content")?.textContent || "Aucune description disponible.";

            // Nettoyage HTML
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

fetchRSS();
