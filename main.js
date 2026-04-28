// Wartet darauf, dass das HTML-Dokument vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
    
    // Prüfe, ob wir uns auf der plugins.html befinden (anhand der ID des Grids)
    const pluginsGrid = document.getElementById('plugins-grid');
    
    if (pluginsGrid) {
        fetchModrinthPlugins();
    }
});

/**
 * Holt die Projekt-Daten von der Modrinth API für eine Organisation
 */
async function fetchModrinthPlugins() {
    // Der Slug der Organisation (aus der URL: https://modrinth.com/organization/veronix)
    const organizationSlug = 'veronix'; 
    
    // Wir nutzen die Search-API, da sie am stabilsten ist, um alle Projekte 
    // eines Teams/einer Organisation gesammelt und formatiert abzufragen.
    // Facets-Filter: Wir filtern nach Projekten, bei denen 'veronix' der Autor/die Organisation ist.
    const apiUrl = `https://api.modrinth.com/v2/search?limit=100&facets=[["author:${organizationSlug}"]]`;

    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API Fehler: ${response.status}`);
        }

        const data = await response.json();
        const projects = data.hits; // Die Search-API verpackt die Ergebnisse im "hits" Array
        
        // Grid leeren (Ladeindikator entfernen)
        const pluginsGrid = document.getElementById('plugins-grid');
        pluginsGrid.innerHTML = '';

        if (projects.length === 0) {
            pluginsGrid.innerHTML = `
                <div class="col-span-full text-center py-10 text-gray-400">
                    Bisher wurden keine Plugins von dieser Organisation veröffentlicht.
                </div>
            `;
            return;
        }

        // Durch jedes Projekt loopen und eine Card generieren
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col h-full shadow-lg hover:border-emerald-500 transition-colors group';

            // HTML-Struktur der Card
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
                        <svg class="w-4 h-4 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        ${project.downloads.toLocaleString('de-DE')}
                    </div>
                    
                    <a href="https://modrinth.com/project/${project.slug}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors">
                        Download
                    </a>
                </div>
            `;

            // Card dem Grid hinzufügen
            pluginsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Fehler beim Abrufen der Modrinth-Daten:', error);
        
        const pluginsGrid = document.getElementById('plugins-grid');
        pluginsGrid.innerHTML = `
            <div class="col-span-full text-center py-10 bg-red-900/20 border border-red-500/50 rounded-xl">
                <p class="text-red-400 font-medium">Es gab ein Problem beim Laden der Plugins.</p>
                <p class="text-red-300 text-sm mt-2">Bitte überprüfe den Organisations-Namen oder versuche es später noch einmal.</p>
            </div>
        `;
    }
}
