// OTT Tracker - Main JavaScript File
class OTTTracker {
    constructor() {
        this.apiKey = localStorage.getItem('tmdb_api_key') || '';
        this.baseURL = 'https://api.themoviedb.org/3';
        this.imageBaseURL = 'https://image.tmdb.org/t/p/w500';
        this.watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        this.watched = JSON.parse(localStorage.getItem('watched')) || [];
        this.currentTab = 'search-results';
        this.demoMode = localStorage.getItem('demo_mode') === 'true';
        this.apiProvider = localStorage.getItem('api_provider') || 'tmdb';
        
        // Initialize alternative APIs
        this.altAPIs = new AlternativeAPIs(this);
        
        // Load demo data if available
        this.loadDemoData();
        
        this.init();
    }

    loadDemoData() {
        // Demo data will be loaded from separate script file
        this.demoMovies = window.DEMO_MOVIES || [];
        this.searchResults = window.SEARCH_RESULTS || {};
    }

    init() {
        this.setupEventListeners();
        this.checkApiKey();
        this.updateWatchlistDisplay();
        this.updateWatchedDisplay();
    }

    setupEventListeners() {
        // API Key setup
        document.getElementById('save-api-key').addEventListener('click', () => this.saveApiKey());
        document.getElementById('api-key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });
        document.getElementById('demo-mode-btn').addEventListener('click', () => this.startDemoMode());

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => this.performSearch());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Modal handling
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('detail-modal').addEventListener('click', (e) => {
            if (e.target.id === 'detail-modal') this.closeModal();
        });

        // Settings
        document.getElementById('settings-toggle').addEventListener('click', () => this.toggleSettings());
        document.getElementById('update-api-key').addEventListener('click', () => this.updateApiKey());
        document.getElementById('clear-data').addEventListener('click', () => this.clearAllData());
        
        // API Provider selector
        const apiSelect = document.getElementById('api-provider-select');
        if (apiSelect) {
            apiSelect.value = this.apiProvider;
            apiSelect.addEventListener('change', () => this.changeApiProvider());
        }

        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            const settingsPanel = document.getElementById('settings-panel');
            const settingsBtn = document.getElementById('settings-toggle');
            if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
                settingsPanel.classList.remove('open');
            }
        });
    }

    checkApiKey() {
        if (this.apiKey || this.demoMode) {
            document.getElementById('api-setup').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            document.getElementById('settings-api-key').value = this.apiKey;
            
            // Show demo mode indicator
            if (this.demoMode && !this.apiKey) {
                this.showDemoModeIndicator();
            }
        } else {
            document.getElementById('api-setup').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
        }
    }

    showDemoModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'demo-indicator';
        indicator.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Demo Mode - Limited content available</span>
            <button onclick="ottTracker.exitDemoMode()" class="btn btn-secondary">Get API Key</button>
        `;
        document.querySelector('.header-content').appendChild(indicator);
    }

    saveApiKey() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        if (apiKey) {
            this.apiKey = apiKey;
            localStorage.setItem('tmdb_api_key', apiKey);
            this.checkApiKey();
            this.showNotification('API key saved successfully!', 'success');
        } else {
            this.showNotification('Please enter a valid API key', 'error');
        }
    }

    updateApiKey() {
        const apiKey = document.getElementById('settings-api-key').value.trim();
        if (apiKey) {
            this.apiKey = apiKey;
            localStorage.setItem('tmdb_api_key', apiKey);
            this.showNotification('API key updated successfully!', 'success');
        } else {
            this.showNotification('Please enter a valid API key', 'error');
        }
    }

    async performSearch() {
        const query = document.getElementById('search-input').value.trim();
        const contentType = document.getElementById('content-type').value;
        
        if (!query) {
            this.showNotification('Please enter a search term', 'error');
            return;
        }

        this.showLoading(true);
        
        try {
            let results = [];
            
            // Use demo data if in demo mode or no API key
            if (this.demoMode || !this.apiKey) {
                results = this.searchDemoData(query, contentType);
            } else {
                // Use selected API provider
                switch (this.apiProvider) {
                    case 'omdb':
                        results = await this.altAPIs.searchOMDb(query, this.apiKey);
                        break;
                    case 'tvmaze':
                        if (contentType === 'movie') {
                            throw new Error('TVMaze only supports TV shows. Switch to "TV Series" or "All".');
                        }
                        results = await this.altAPIs.searchTVMaze(query);
                        break;
                    default:
                        // TMDb API
                        const endpoint = contentType === 'multi' ? 'search/multi' : `search/${contentType}`;
                        const response = await fetch(`${this.baseURL}/${endpoint}?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
                        
                        if (!response.ok) {
                            throw new Error('Search failed');
                        }
                        
                        const data = await response.json();
                        results = data.results;
                        break;
                }
            }
            
            this.displaySearchResults(results);
            this.switchTab('search-results');
        } catch (error) {
            console.error('Search error:', error);
            if (this.demoMovies && this.demoMovies.length > 0) {
                this.showNotification('API failed, showing demo content', 'info');
                this.enterDemoMode();
                const results = this.searchDemoData(query, contentType);
                this.displaySearchResults(results);
            } else {
                this.showNotification('Search failed. Please check your API key and try again.', 'error');
            }
        }
        
        this.showLoading(false);
    }

    searchDemoData(query, contentType) {
        const lowerQuery = query.toLowerCase();
        let results = [];

        // Check specific search results first
        for (const [key, items] of Object.entries(this.searchResults || {})) {
            if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
                results = results.concat(items);
            }
        }

        // If no specific results, search through all demo movies
        if (results.length === 0 && this.demoMovies) {
            results = this.demoMovies.filter(item => {
                const title = item.title || item.name || '';
                const overview = item.overview || '';
                return title.toLowerCase().includes(lowerQuery) || 
                       overview.toLowerCase().includes(lowerQuery);
            });
        }

        // Filter by content type
        if (contentType !== 'multi') {
            results = results.filter(item => {
                if (contentType === 'movie') {
                    return item.title || item.media_type === 'movie';
                } else if (contentType === 'tv') {
                    return item.name || item.media_type === 'tv';
                }
                return true;
            });
        }

        return results.slice(0, 20); // Limit results
    }

    enterDemoMode() {
        this.demoMode = true;
        localStorage.setItem('demo_mode', 'true');
        this.checkApiKey();
    }

    startDemoMode() {
        this.enterDemoMode();
        this.showNotification('Demo mode activated! Try searching for "batman", "marvel", or "comedy"', 'success');
        // Show some initial content
        if (this.demoMovies && this.demoMovies.length > 0) {
            this.displaySearchResults(this.demoMovies.slice(0, 8));
        }
    }

    exitDemoMode() {
        this.demoMode = false;
        localStorage.removeItem('demo_mode');
        const indicator = document.querySelector('.demo-indicator');
        if (indicator) indicator.remove();
        this.checkApiKey();
    }

    changeApiProvider() {
        const select = document.getElementById('api-provider-select');
        this.apiProvider = select.value;
        localStorage.setItem('api_provider', this.apiProvider);
        
        // Update UI based on selected provider
        this.updateApiProviderUI();
        
        this.showNotification(`Switched to ${this.getProviderName()} API`, 'success');
    }

    getProviderName() {
        switch (this.apiProvider) {
            case 'omdb': return 'OMDb';
            case 'tvmaze': return 'TVMaze';
            default: return 'TMDb';
        }
    }

    updateApiProviderUI() {
        const keyInput = document.getElementById('settings-api-key');
        const keyLabel = document.querySelector('label[for="settings-api-key"]');
        const apiInfo = document.getElementById('api-provider-info');
        
        if (this.apiProvider === 'tvmaze') {
            keyInput.style.display = 'none';
            keyLabel.style.display = 'none';
            if (apiInfo) {
                apiInfo.innerHTML = '✅ TVMaze API - No key required!';
                apiInfo.style.color = 'var(--success-color)';
            }
        } else {
            keyInput.style.display = 'block';
            keyLabel.style.display = 'block';
            if (apiInfo) {
                const providerInfo = this.apiProvider === 'omdb' 
                    ? 'Get free key at: <a href="http://www.omdbapi.com/" target="_blank">omdbapi.com</a>'
                    : 'Get free key at: <a href="https://www.themoviedb.org/settings/api" target="_blank">TMDb</a>';
                apiInfo.innerHTML = providerInfo;
                apiInfo.style.color = 'var(--text-secondary)';
            }
        }
    }

    displaySearchResults(results) {
        const container = document.getElementById('search-results-grid');
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                    <small>Try a different search term</small>
                </div>
            `;
            return;
        }

        results.forEach(item => {
            const card = this.createContentCard(item);
            container.appendChild(card);
        });
    }

    createContentCard(item) {
        const isMovie = item.media_type === 'movie' || item.title;
        const title = isMovie ? item.title : item.name;
        const releaseDate = isMovie ? item.release_date : item.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const posterPath = item.poster_path ? `${this.imageBaseURL}${item.poster_path}` : 'https://via.placeholder.com/500x750/333/fff?text=No+Image';
        
        const isInWatchlist = this.watchlist.some(w => w.id === item.id);
        const isWatched = this.watched.some(w => w.id === item.id);

        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <img src="${posterPath}" alt="${title}" onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Image'">
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <div class="card-meta">
                    <span class="card-year">${year}</span>
                    <div class="card-rating">
                        <i class="fas fa-star"></i>
                        <span>${(item.vote_average || 0).toFixed(1)}</span>
                    </div>
                </div>
                <div class="card-actions">
                    ${isWatched ? 
                        '<button class="btn btn-success" disabled><i class="fas fa-check"></i> Watched</button>' :
                        isInWatchlist ? 
                            `<button class="btn btn-danger" onclick="ottTracker.removeFromWatchlist(${item.id})"><i class="fas fa-minus"></i> Remove</button>` :
                            `<button class="btn btn-primary" onclick="ottTracker.addToWatchlist(${JSON.stringify(item).replace(/"/g, '&quot;')})"><i class="fas fa-plus"></i> Add</button>`
                    }
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-actions')) {
                this.showDetails(item);
            }
        });

        return card;
    }

    async showDetails(item) {
        const isMovie = item.media_type === 'movie' || item.title;
        
        try {
            let details;
            
            if (this.demoMode || !this.apiKey) {
                // Use item data directly for demo mode
                details = item;
            } else {
                // Use selected API provider
                switch (this.apiProvider) {
                    case 'omdb':
                        details = await this.altAPIs.getOMDbDetails(item.id, this.apiKey);
                        break;
                    case 'tvmaze':
                        details = await this.altAPIs.getTVMazeDetails(item.id);
                        break;
                    default:
                        // TMDb API
                        const endpoint = isMovie ? `movie/${item.id}` : `tv/${item.id}`;
                        const response = await fetch(`${this.baseURL}/${endpoint}?api_key=${this.apiKey}&append_to_response=credits,videos`);
                        details = await response.json();
                        break;
                }
            }
            
            this.displayDetails(details, isMovie);
            document.getElementById('detail-modal').style.display = 'block';
        } catch (error) {
            console.error('Details error:', error);
            this.showNotification('Failed to load details', 'error');
        }
    }

    displayDetails(details, isMovie) {
        const title = isMovie ? details.title : details.name;
        const releaseDate = isMovie ? details.release_date : details.first_air_date;
        const runtime = isMovie ? `${details.runtime} min` : `${details.number_of_seasons} seasons`;
        const backdropPath = details.backdrop_path ? `${this.imageBaseURL.replace('w500', 'w1280')}${details.backdrop_path}` : '';
        
        const isInWatchlist = this.watchlist.some(w => w.id === details.id);
        const isWatched = this.watched.some(w => w.id === details.id);

        const genres = details.genres ? details.genres.map(g => g.name).join(', ') : 'N/A';
        const director = details.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
        const cast = details.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'N/A';

        document.getElementById('detail-content').innerHTML = `
            <div class="detail-header" style="background-image: url('${backdropPath}')">
                <div class="detail-overlay"></div>
                <div class="detail-info">
                    <h1 class="detail-title">${title}</h1>
                    <div class="detail-meta">
                        <span>${new Date(releaseDate).getFullYear()}</span>
                        <span>${runtime}</span>
                        <div class="detail-rating">
                            <i class="fas fa-star"></i>
                            <span>${details.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detail-body">
                <p class="detail-overview">${details.overview || 'No overview available.'}</p>
                
                <div class="detail-actions">
                    ${isWatched ? 
                        `<button class="btn btn-danger" onclick="ottTracker.removeFromWatched(${details.id})"><i class="fas fa-undo"></i> Mark as Unwatched</button>` :
                        isInWatchlist ? 
                            `<button class="btn btn-success" onclick="ottTracker.markAsWatched(${JSON.stringify(details).replace(/"/g, '&quot;')})"><i class="fas fa-check"></i> Mark as Watched</button>
                             <button class="btn btn-danger" onclick="ottTracker.removeFromWatchlist(${details.id})"><i class="fas fa-minus"></i> Remove from Watchlist</button>` :
                            `<button class="btn btn-primary" onclick="ottTracker.addToWatchlist(${JSON.stringify(details).replace(/"/g, '&quot;')})"><i class="fas fa-plus"></i> Add to Watchlist</button>`
                    }
                </div>

                <div class="detail-grid">
                    <div class="detail-item">
                        <h4>Genres</h4>
                        <p>${genres}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Director</h4>
                        <p>${director}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Cast</h4>
                        <p>${cast}</p>
                    </div>
                    <div class="detail-item">
                        <h4>Release Date</h4>
                        <p>${new Date(releaseDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;
    }

    addToWatchlist(item) {
        if (!this.watchlist.some(w => w.id === item.id)) {
            this.watchlist.push(item);
            localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
            this.updateWatchlistDisplay();
            this.showNotification('Added to watchlist!', 'success');
            this.refreshCurrentView();
        }
    }

    removeFromWatchlist(id) {
        this.watchlist = this.watchlist.filter(item => item.id !== id);
        localStorage.setItem('watchlist', JSON.stringify(this.watchlist));
        this.updateWatchlistDisplay();
        this.showNotification('Removed from watchlist', 'success');
        this.refreshCurrentView();
    }

    markAsWatched(item) {
        // Remove from watchlist and add to watched
        this.removeFromWatchlist(item.id);
        if (!this.watched.some(w => w.id === item.id)) {
            this.watched.push(item);
            localStorage.setItem('watched', JSON.stringify(this.watched));
            this.updateWatchedDisplay();
            this.showNotification('Marked as watched!', 'success');
        }
        this.closeModal();
        this.refreshCurrentView();
    }

    removeFromWatched(id) {
        this.watched = this.watched.filter(item => item.id !== id);
        localStorage.setItem('watched', JSON.stringify(this.watched));
        this.updateWatchedDisplay();
        this.showNotification('Removed from watched', 'success');
        this.refreshCurrentView();
        this.closeModal();
    }

    updateWatchlistDisplay() {
        const container = document.getElementById('watchlist-grid');
        const emptyState = document.getElementById('watchlist-empty');
        
        if (this.watchlist.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = '';
            this.watchlist.forEach(item => {
                const card = this.createContentCard(item);
                container.appendChild(card);
            });
        }
    }

    updateWatchedDisplay() {
        const container = document.getElementById('watched-grid');
        const emptyState = document.getElementById('watched-empty');
        
        if (this.watched.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            container.innerHTML = '';
            this.watched.forEach(item => {
                const card = this.createContentCard(item);
                container.appendChild(card);
            });
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === tabName);
        });

        this.currentTab = tabName;
    }

    refreshCurrentView() {
        // Refresh the current tab's content
        if (this.currentTab === 'watchlist') {
            this.updateWatchlistDisplay();
        } else if (this.currentTab === 'watched') {
            this.updateWatchedDisplay();
        }
    }

    closeModal() {
        document.getElementById('detail-modal').style.display = 'none';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    toggleSettings() {
        const panel = document.getElementById('settings-panel');
        panel.classList.toggle('open');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This will remove your watchlist and watched items.')) {
            localStorage.removeItem('watchlist');
            localStorage.removeItem('watched');
            this.watchlist = [];
            this.watched = [];
            this.updateWatchlistDisplay();
            this.updateWatchedDisplay();
            this.showNotification('All data cleared', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }
                .notification-success { background: var(--success-color); }
                .notification-error { background: var(--danger-color); }
                .notification-info { background: var(--primary-color); }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ottTracker = new OTTTracker();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}