// --- 1. Übersetzungs-Daten (Dictionaries) ---
const translations = {
    en: {
        nav_home: "Home", nav_plugins: "Plugins", nav_wiki: "Wiki",
        hero_title: "High-quality <span class='text-emerald-500'>Minecraft Plugins</span>",
        hero_desc: "We develop performant, reliable, and modern plugins. Trust in quality and regular updates.",
        btn_plugins: "To the Plugins", btn_discord: "Join Discord",
        feat1_title: "Maximum Performance", feat1_desc: "Our plugins are programmed to be extremely resource-efficient.",
        feat2_title: "Premium Support", feat2_desc: "Fast help guaranteed via our Discord server.",
        feat3_title: "Constant Updates", feat3_desc: "We guarantee fast updates for new Minecraft versions.",
        footer_text: "&copy; 2026 Veronix Development. All rights reserved.",
        plugins_title: "Our <span class='text-emerald-500'>Plugins</span>",
        plugins_desc: "Discover all our projects loaded directly from Modrinth.",
        loading: "Connecting to Modrinth API...",
        no_plugins: "No plugins published yet.",
        error_title: "There was a problem loading the data.",
        error_desc: "Please refresh the page.",
        download_btn: "Download",
        wiki_nav_title: "Documentation",
        wiki_nav_plugins: "Our Plugins",
        wiki_link_start: "Getting Started",
        wiki_page_title: "Getting Started",
        wiki_text_1: "Welcome to the official Veronix Wiki! Choose a plugin from the list on the left to view its commands and documentation.",
        wiki_sub_title_1: "General Installation",
        wiki_list_1: "<li>Download the plugin.</li><li>Drag the .jar file into the <code>/plugins</code> folder.</li><li>Restart the server.</li>"
    },
    de: {
        nav_home: "Home", nav_plugins: "Plugins", nav_wiki: "Wiki",
        hero_title: "Hochwertige <span class='text-emerald-500'>Minecraft Plugins</span>",
        hero_desc: "Wir entwickeln performante, zuverlässige und moderne Plugins. Vertraue auf Qualität und regelmäßige Updates.",
        btn_plugins: "Zu den Plugins", btn_discord: "Discord beitreten",
        feat1_title: "Maximale Performance", feat1_desc: "Unsere Plugins sind extrem ressourcenschonend programmiert.",
        feat2_title: "Premium Support", feat2_desc: "Schnelle Hilfe über unseren Discord-Server garantiert.",
        feat3_title: "Stetige Updates", feat3_desc: "Wir garantieren schnelle Updates für neue Minecraft-Versionen.",
        footer_text: "&copy; 2026 Veronix Development. Alle Rechte vorbehalten.",
        plugins_title: "Unsere <span class='text-emerald-500'>Plugins</span>",
        plugins_desc: "Entdecke alle unsere Projekte direkt aus Modrinth geladen.",
        loading: "Verbinde mit Modrinth...",
        no_plugins: "Bisher wurden keine Plugins veröffentlicht.",
        error_title: "Problem beim Laden der Daten.",
        error_desc: "Bitte lade die Seite neu.",
        download_btn: "Herunterladen",
        wiki_nav_title: "Dokumentation",
        wiki_nav_plugins: "Unsere Plugins",
        wiki_link_start: "Erste Schritte",
        wiki_page_title: "Erste Schritte",
        wiki_text_1: "Willkommen im offiziellen Veronix Wiki! Wähle links ein Plugin aus der Liste, um dessen Befehle und Dokumentation anzuzeigen.",
        wiki_sub_title_1: "Allgemeine Installation",
        wiki_list_1: "<li>Lade das Plugin herunter.</li><li>Ziehe die .jar-Datei in den <code>/plugins</code>-Ordner.</li><li>Starte den Server neu.</li>"
    }
};

// --- NEU: Eigene, saubere Kurzbeschreibungen für die Plugins ---
// Der Schlüssel ("vrx-economy") muss exakt der URL-Slug bei Modrinth sein.
const customSummaries = {
    "vrx-economy": {
        en: "🌟 Robust economic framework providing a stable currency system and essential financial commands to power your server's entire marketplace and trade. 🌟",
        de: "🌟 Robustes Wirtschaftssystem, das eine stabile Währung und essenzielle Finanzbefehle bietet, um den gesamten Marktplatz und Handel deines Servers zu steuern. 🌟"
    },
    "jobsystem-vrx": { 
        en: "🌟 Advanced job system featuring custom levels and rewards to enhance player engagement and provide dynamic career paths on your Minecraft server. 🌟",
        de: "🌟 Fortschrittliches Job-System mit Leveln und Belohnungen, das die Spielerbindung stärkt und dynamische Karrierewege auf deinem Minecraft-Server ermöglicht. 🌟"
    },
    "vrx-clans": {
        en: "🌟 Feature-rich clan system allowing players to form alliances, manage ranks, and compete in team-based gameplay with specialized management tools. 🌟",
        de: "🌟 Funktionsreiches Clan-System, das Allianzen, Rangverwaltung und teambasiertes Gameplay durch spezialisierte Management-Tools für alle Spieler ermöglicht. 🌟"
    }
};

let currentLang = 'en'; 

// --- 2. Initialisierung ---
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('veronix_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'de')) currentLang = savedLang;
    
    applyLanguage(currentLang);

    if (document.getElementById('plugins-grid')) fetchModrinthPlugins();
    if (document.getElementById('wiki-plugin-list')) initWikiSidebar();
});

// --- 3. Sprach-Logik ---
window.switchLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('veronix_lang', lang);
    applyLanguage(lang);
    if (document.getElementById('plugins-grid')) fetchModrinthPlugins(); 
};

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });

    const btnEn = document.getElementById('btn-en');
    const btnDe = document.getElementById('btn-de');
    if (btnEn && btnDe) {
        btnEn.className = `text-sm font-bold transition-colors ${lang === 'en' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`;
        btnDe.className = `text-sm font-bold transition-colors ${lang === 'de' ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'}`;
    }
}

// --- Hilfsfunktion für Modrinth-Tags ---
const tagTranslations = {
    de: {
        "game-mechanics": "Spielemechaniken", "mobs": "Mobs", "social": "Sozial",
        "economy": "Wirtschaft", "equipment": "Ausrüstung", "library": "Bibliothek", "management": "Verwaltung"
    },
    en: {
        "game-mechanics": "Game Mechanics", "mobs": "Mobs", "social": "Social",
        "economy": "Economy", "equipment": "Equipment", "library": "Library", "management": "Management"
    }
};

function getTranslatedTag(tagSlug, lang) {
    if (tagTranslations[lang] && tagTranslations[lang][tagSlug]) return tagTranslations[lang][tagSlug];
    return tagSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// --- 4. Modrinth API (Katalog / Plugins-Seite) ---
async function fetchModrinthPlugins() {
    const orgSlug = 'veronix'; 
    const pluginsGrid = document.getElementById('plugins-grid');
    if (!pluginsGrid) return;

    pluginsGrid.innerHTML = `<div class="col-span-full text-center py-10"><div class="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div><p class="text-gray-400">${translations[currentLang].loading}</p></div>`;

    try {
        const res = await fetch(`https://api.modrinth.com/v3/organization/${orgSlug}/projects`);
        if (!res.ok) throw new Error();
        
        let rawProjects = await res.json(); 
        if (rawProjects.length === 0) return pluginsGrid.innerHTML = `<div class="col-span-full text-center py-10">${translations[currentLang].no_plugins}</div>`;

        let projectsData = rawProjects;
        if (typeof rawProjects[0] === 'string') {
            const idsQuery = JSON.stringify(rawProjects);
            const multiRes = await fetch(`https://api.modrinth.com/v2/projects?ids=${idsQuery}`);
            if (multiRes.ok) projectsData = await multiRes.json();
        }

        pluginsGrid.innerHTML = '';

        projectsData.forEach(p => {
            const slug = p.slug || p.id || p;
            const title = p.title || p.name || slug;
            const downloads = p.downloads || 0;
            const categories = p.categories || []; 

            // HIER GREIFT DAS NEUE SYSTEM:
            let summary = "";
            if (customSummaries[slug] && customSummaries[slug][currentLang]) {
                // Eigener Text gefunden!
                summary = customSummaries[slug][currentLang];
            } else {
                // Kein eigener Text da -> Modrinth Fallback
                summary = p.description || '';
                if (summary.length > 180) summary = summary.substring(0, 180) + '...';
            }

            let tagsHtml = categories.map(tag => {
                const displayName = getTranslatedTag(tag, currentLang);
                return `<span class="bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-600 font-medium">${displayName}</span>`;
            }).join('');

            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col h-full shadow-lg hover:border-emerald-500 transition-colors group';
            card.innerHTML = `
                <div class="flex-grow">
                    <h2 class="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">${title}</h2>
                    <p class="text-gray-400 mb-5 text-sm leading-relaxed">${summary}</p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${tagsHtml}
                    </div>
                </div>
                
                <div class="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div class="flex items-center text-sm text-gray-300 font-medium bg-gray-900 px-3 py-1.5 rounded-lg">
                        <svg class="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        ${downloads.toLocaleString(currentLang === 'de' ? 'de-DE' : 'en-US')}
                    </div>
                    <a href="https://modrinth.com/project/${slug}" target="_blank" class="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors">
                        ${translations[currentLang].download_btn}
                    </a>
                </div>
            `;
            pluginsGrid.appendChild(card);
        });
    } catch (e) {
        pluginsGrid.innerHTML = `<div class="col-span-full text-center py-10 text-red-400">${translations[currentLang].error_title}</div>`;
    }
}

// --- 5. Wiki Logik ---
async function initWikiSidebar() {
    const list = document.getElementById('wiki-plugin-list');
    if (!list) return;

    try {
        const res = await fetch(`https://api.modrinth.com/v3/organization/veronix/projects`);
        if (!res.ok) throw new Error();
        
        let rawProjects = await res.json(); 
        
        list.innerHTML = '';
        if (rawProjects.length === 0) {
            list.innerHTML = `<li class="text-gray-500 text-sm">Keine Plugins gefunden.</li>`;
            return;
        }

        let projectsData = rawProjects;
        if (typeof rawProjects[0] === 'string') {
            const idsQuery = JSON.stringify(rawProjects);
            const multiRes = await fetch(`https://api.modrinth.com/v2/projects?ids=${idsQuery}`);
            if (multiRes.ok) projectsData = await multiRes.json();
        }

        projectsData.forEach(p => {
            const slug = p.slug || p.id || p;
            const title = p.title || p.name || slug;

            const li = document.createElement('li');
            li.innerHTML = `<a href="#" onclick="loadPluginWiki('${slug}', '${title}', event)" class="text-gray-400 hover:text-emerald-400 transition-colors block truncate" title="${title}">► ${title}</a>`;
            list.appendChild(li);
        });
    } catch (e) {
        list.innerHTML = `<li class="text-red-400 text-sm">Fehler beim Laden der Plugins</li>`;
    }
}

window.loadPluginWiki = async function(slug, title, event) {
    if(event) event.preventDefault();
    const contentArea = document.getElementById('wiki-content');
    
    contentArea.innerHTML = `<div class="text-center py-20"><div class="animate-spin inline-block w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div><p class="text-gray-400">Lade Dokumentation für ${title}...</p></div>`;

    try {
        const res = await fetch(`https://api.modrinth.com/v2/project/${slug}`);
        if (!res.ok) throw new Error();
        const project = await res.json();
        
        const htmlContent = marked.parse(project.body || (currentLang === 'en' ? '*No documentation found.*' : '*Keine Dokumentation hinterlegt.*'));

        contentArea.innerHTML = `
            <div class="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <h1 class="text-3xl md:text-4xl font-bold text-white">${title}</h1>
                <a href="https://modrinth.com/project/${slug}" target="_blank" class="bg-gray-900 border border-gray-700 text-emerald-500 hover:text-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    View on Modrinth
                </a>
            </div>
            <div class="prose prose-invert prose-emerald max-w-none text-gray-300">
                ${htmlContent}
            </div>
        `;
    } catch (e) {
        contentArea.innerHTML = `<div class="text-red-400 py-10">Fehler beim Abrufen der Modrinth-Dokumentation.</div>`;
    }
}

window.showDefaultWiki = function(event) {
    if(event) event.preventDefault();
    const contentArea = document.getElementById('wiki-content');
    contentArea.innerHTML = `
        <div id="default-wiki-content">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-6" data-i18n="wiki_page_title">${translations[currentLang].wiki_page_title}</h1>
            <div class="prose prose-invert max-w-none text-gray-300 space-y-6">
                <p data-i18n="wiki_text_1">${translations[currentLang].wiki_text_1}</p>
                <h2 class="text-2xl font-semibold text-white mt-8 mb-4" data-i18n="wiki_sub_title_1">${translations[currentLang].wiki_sub_title_1}</h2>
                <ul class="list-disc pl-5 space-y-2" data-i18n="wiki_list_1">${translations[currentLang].wiki_list_1}</ul>
            </div>
        </div>
    `;
}