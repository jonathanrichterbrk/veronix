// --- 1. Übersetzungs-Daten (Dictionaries) ---
const translations = {
    en: {
        nav_home: "Home",
        nav_plugins: "Plugins",
        nav_wiki: "Wiki",
        hero_title: "High-quality <span class='text-emerald-500'>Minecraft Plugins</span>",
        hero_desc: "We develop performant, reliable, and modernly structured plugins for your next Minecraft project. Trust in quality and regular updates.",
        btn_plugins: "To the Plugins",
        btn_discord: "Join Discord",
        feat1_title: "Maximum Performance",
        feat1_desc: "Our plugins are programmed to be extremely resource-efficient, keeping your server running smoothly even with a high player count.",
        feat2_title: "Premium Support",
        feat2_desc: "Fast help guaranteed. Join our Discord server for assistance with configuration and troubleshooting.",
        feat3_title: "Constant Updates",
        feat3_desc: "Minecraft evolves – and so do we. We guarantee fast updates for new Minecraft versions.",
        footer_text: "&copy; 2026 Veronix Development. All rights reserved.",
        plugins_title: "Our <span class='text-emerald-500'>Plugins</span>",
        plugins_desc: "Discover all our projects loaded directly from Modrinth.",
        loading: "Connecting to Modrinth API...",
        no_plugins: "No plugins published by this organization yet.",
        error_title: "There was a problem loading the plugins.",
        error_desc: "Please refresh the page or try again later.",
        download_btn: "Download"
    },
    de: {
        nav_home: "Home", // Bleibt oft gleich
        nav_plugins: "Plugins",
        nav_wiki: "Wiki",
        hero_title: "Hochwertige <span class='text-emerald-500'>Minecraft Plugins</span>",
        hero_desc: "Wir entwickeln performante, zuverlässige und modern strukturierte Plugins für dein nächstes Minecraft-Projekt. Vertraue auf Qualität und regelmäßige Updates.",
        btn_plugins: "Zu den Plugins",
        btn_discord: "Discord beitreten",
        feat1_title: "Maximale Performance",
        feat1_desc: "Unsere Plugins sind extrem ressourcenschonend programmiert, um deinen Server selbst bei hoher Spielerzahl flüssig laufen zu lassen.",
        feat2_title: "Premium Support",
        feat2_desc: "Schnelle Hilfe garantiert. In unserem Discord-Server stehen wir dir bei Fragen zur Konfiguration und bei Problemen zur Seite.",
        feat3_title: "Stetige Updates",
        feat3_desc: "Minecraft entwickelt sich weiter – und wir uns auch. Wir garantieren schnelle Updates für neue Minecraft-Versionen.",
        footer_text: "&copy; 2026 Veronix Development. Alle Rechte vorbehalten.",
        plugins_title: "Unsere <span class='text-emerald-500'>Plugins</span>",
        plugins_desc: "Entdecke alle unsere Projekte direkt aus Modrinth geladen.",
        loading: "Verbinde mit Modrinth API...",
        no_plugins: "Bisher wurden keine Plugins von dieser Organisation veröffentlicht.",
        error_title: "Es gab ein Problem beim Laden der Plugins.",
        error_desc: "Bitte lade die Seite neu oder versuche es später noch einmal.",
        download_btn: "Herunterladen"
    }
};

let currentLang = 'en'; // Standard-Sprache

// --- 2. Initialisierung ---
document.addEventListener('DOMContentLoaded', () => {
    // Sprache aus dem Speicher laden (falls vorhanden)
    const savedLang = localStorage.getItem('veronix_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
        currentLang = savedLang;
    }
    
    // UI auf die richtige Sprache setzen
    applyLanguage(currentLang);

    // Prüfe, ob wir uns auf der plugins.html befinden
    const pluginsGrid = document.getElementById('plugins-grid');
    if (pluginsGrid) {
        fetchModrinthPlugins();
    }
});

// --- 3. Sprach-Logik ---
window.switchLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('veronix_lang', lang);
    applyLanguage(lang);
    
    // Falls wir auf der Plugin-Seite sind, lade das Grid neu, 
    // um die dynamischen Buttons ("Download") zu übersetzen
    if (document.getElementById('plugins-grid')) {
        fetchModrinthPlugins(); 
    }
};

function applyLanguage(lang) {
    // Aktualisiere das <html> Tag für SEO/Accessibility
    document.documentElement.lang = lang;

    // Suche alle Elemente mit data-i18n Attribut und ersetze den Text/HTML
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Style die Sprach-Buttons (Aktive Sprache grün, inaktive grau)
    const btnEn = document.getElementById('btn-en');
    const btnDe = document.getElementById('btn-de');
    
    if (btnEn && btnDe) {
        if (lang === 'en') {
            btnEn.className = "text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors";
            btnDe.className = "text-sm font-bold text-gray-400 hover:text-emerald-400 transition-colors";
        } else {
            btnEn.className = "text-sm font-bold text-gray-400 hover:text-emerald-400 transition-colors";
            btnDe.className = "text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors";
        }
    }
}

// --- 4. Modrinth API Logik ---
async function fetchModrinthPlugins() {
    const organizationSlug = 'veronix'; 
    const apiUrl = `https://api.modrinth.com/v2/search?limit=100&facets=[["author:${organizationSlug}"]]`;
    const pluginsGrid = document.getElementById('plugins-grid');

    // Ladeindikator anzeigen (in der aktuellen Sprache)
    pluginsGrid.innerHTML = `
        <div class="col-span-full text-center py-10" id="loading-indicator">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-gray-400">${translations[currentLang].loading}</p>
        </div>
    `;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API Fehler: ${response.status}`);

        const data = await response.json();
        const projects = data.hits; 
        
        pluginsGrid.innerHTML = '';

        if (projects.length === 0) {
            pluginsGrid.innerHTML = `
                <div class="col-span-full text-center py-10 text-gray-400">
                    ${translations[currentLang].no_plugins}
                </div>
            `;
            return;
        }

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col h-full shadow-lg hover:border-emerald-500 transition-colors group';

            card.innerHTML = `
                <div class="flex-grow">
                    <h2 class="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                        ${project.title}
                    </h2>
                    <p class="text-gray-400 mb-6 line-clamp-3">
                        ${project.description}
                    </p>
                </div>
                
                <div class="mt-auto pt-4 border-t border-gray-700 flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-300 font-medium bg-gray-900 px-3 py-1.5 rounded-lg">
                        <svg class="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        ${project.downloads.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US')}
                    </div>
                    
                    <a href="https://modrinth.com/project/${project.slug}" 
                       target="_blank" rel="noopener noreferrer" 
                       class="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors">
                        ${translations[currentLang].download_btn}
                    </a>
                </div>
            `;
            pluginsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Modrinth-Daten:', error);
        pluginsGrid.innerHTML = `
            <div class="col-span-full text-center py-10 bg-red-900/20 border border-red-500/50 rounded-xl">
                <p class="text-red-400 font-medium">${translations[currentLang].error_title}</p>
                <p class="text-red-300 text-sm mt-2">${translations[currentLang].error_desc}</p>
            </div>
        `;
    }
}
