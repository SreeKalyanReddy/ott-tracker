// OTT Tracker - Main JavaScript File
class OTTTracker {
    constructor() {
        this.apiKey = localStorage.getItem('tmdb_api_key') || '';
        this.baseURL = 'https://api.themoviedb.org/3';
        this.imageBaseURL = 'https://image.tmdb.org/t/p/w500';
        this.watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        this.watched = JSON.parse(localStorage.getItem('watched')) || [];
        this.currentTab = 'search-results';
        this.apiProvider = localStorage.getItem('api_provider') || 'omdb'; // Default to OMDb since it's easier to get
        
        // Auto-setup with your OMDb key if not already configured
        if (!this.apiKey && !localStorage.getItem('setup_completed')) {
            this.apiKey = '84855bfc'; // Your OMDb API key
            localStorage.setItem('tmdb_api_key', this.apiKey);
            localStorage.setItem('api_provider', 'omdb');
            localStorage.setItem('setup_completed', 'true');
        }
        
        // Initialize alternative APIs
        this.altAPIs = new AlternativeAPIs(this);
        
        this.init();
    }



    init() {
        this.setupEventListeners();
        this.checkApiKey();
        this.updateWatchlistDisplay();
        this.updateWatchedDisplay();
        this.populateHomepage();
    }

    setupEventListeners() {
        // API Key setup
        document.getElementById('save-api-key').addEventListener('click', () => this.saveApiKey());
        document.getElementById('api-key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });
        document.getElementById('use-tvmaze').addEventListener('click', () => this.useTVMaze());
        document.getElementById('initial-api-provider').addEventListener('change', () => this.updateInitialApiProvider());

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
        if (this.apiKey || this.apiProvider === 'tvmaze') {
            document.getElementById('api-setup').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            document.getElementById('settings-api-key').value = this.apiKey;
            
            // Load initial homepage content
            this.populateHomepage();
        } else {
            document.getElementById('api-setup').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        const provider = document.getElementById('initial-api-provider').value;
        
        if (apiKey || provider === 'tvmaze') {
            this.apiKey = apiKey;
            this.apiProvider = provider;
            localStorage.setItem('tmdb_api_key', apiKey);
            localStorage.setItem('api_provider', provider);
            this.checkApiKey();
            this.showNotification(`${this.getProviderName()} API configured successfully!`, 'success');
        } else {
            this.showNotification('Please enter a valid API key', 'error');
        }
    }

    useTVMaze() {
        this.apiProvider = 'tvmaze';
        this.apiKey = '';
        localStorage.setItem('api_provider', 'tvmaze');
        localStorage.removeItem('tmdb_api_key');
        this.checkApiKey();
        this.showNotification('TVMaze API activated - TV shows only!', 'success');
    }

    updateInitialApiProvider() {
        const provider = document.getElementById('initial-api-provider').value;
        const keyInput = document.getElementById('api-key-input');
        const saveBtn = document.getElementById('save-api-key');
        
        if (provider === 'tvmaze') {
            keyInput.style.display = 'none';
            saveBtn.textContent = 'Use TVMaze';
        } else {
            keyInput.style.display = 'block';
            saveBtn.textContent = 'Save & Start';
            keyInput.placeholder = provider === 'omdb' ? 'Enter your OMDb API key' : 'Enter your TMDb API key';
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
            
            // Use selected API provider
            switch (this.apiProvider) {
                case 'omdb':
                    if (!this.apiKey) {
                        throw new Error('OMDb API key required. Please add your API key in settings.');
                    }
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
                    if (!this.apiKey) {
                        throw new Error('TMDb API key required. Please add your API key in settings.');
                    }
                    const endpoint = contentType === 'multi' ? 'search/multi' : `search/${contentType}`;
                    const response = await fetch(`${this.baseURL}/${endpoint}?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`);
                    
                    if (!response.ok) {
                        throw new Error('Search failed - check your API key');
                    }
                    
                    const data = await response.json();
                    results = data.results;
                    break;
            }
            
            this.displaySearchResults(results);
            this.switchTab('search-results');
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification(error.message, 'error');
        }
        
        this.showLoading(false);
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
        const homepageSections = document.getElementById('homepage-sections');
        
        // Show search results, hide homepage
        container.style.display = 'grid';
        homepageSections.style.display = 'none';
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

    async populateHomepage() {
        // Show homepage sections, hide search results
        const container = document.getElementById('search-results-grid');
        const homepageSections = document.getElementById('homepage-sections');
        
        container.style.display = 'none';
        homepageSections.style.display = 'block';

        try {
            await this.loadTrendingContent();
        } catch (error) {
            console.error('Failed to load homepage content:', error);
            this.showEmptyHomepage();
        }
    }

    showEmptyHomepage() {
        // Show message when no API key or API fails
        document.getElementById('homepage-sections').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-key"></i>
                <p>API Key Required</p>
                <small>Add your API key in settings to view trending content</small>
                <br><br>
                <button onclick="ottTracker.toggleSettings()" class="btn btn-primary">
                    <i class="fas fa-cog"></i> Open Settings
                </button>
            </div>
        `;
    }

    async loadTrendingContent() {
        if (this.apiProvider === 'tmdb' && this.apiKey) {
            // Load from TMDb API
            const [trending, topRated, nowPlaying, tvShows] = await Promise.all([
                fetch(`${this.baseURL}/trending/all/week?api_key=${this.apiKey}`).then(r => r.json()),
                fetch(`${this.baseURL}/movie/top_rated?api_key=${this.apiKey}`).then(r => r.json()),
                fetch(`${this.baseURL}/movie/now_playing?api_key=${this.apiKey}`).then(r => r.json()),
                fetch(`${this.baseURL}/tv/popular?api_key=${this.apiKey}`).then(r => r.json())
            ]);

            this.populateSection('trending-grid', trending.results?.slice(0, 6) || []);
            this.populateSection('top-rated-grid', topRated.results?.slice(0, 6) || []);
            this.populateSection('new-releases-grid', nowPlaying.results?.slice(0, 6) || []);
            this.populateSection('binge-series-grid', tvShows.results?.slice(0, 6) || []);
            
        } else if (this.apiProvider === 'omdb' && this.apiKey) {
            // OMDb doesn't have trending endpoints, so search for popular terms
            const popularSearches = ['batman', 'avengers', 'star wars', 'marvel', 'disney', 'netflix'];
            const results = [];
            
            for (const term of popularSearches) {
                try {
                    const searchResults = await this.altAPIs.searchOMDb(term, this.apiKey);
                    results.push(...searchResults.slice(0, 2)); // Take 2 from each search
                    if (results.length >= 12) break;
                } catch (error) {
                    console.warn(`Failed to search for ${term}:`, error);
                }
            }
            
            // Distribute results across sections
            const movies = results.filter(item => item.media_type === 'movie').slice(0, 6);
            const tvShows = results.filter(item => item.media_type === 'tv').slice(0, 6);
            
            this.populateSection('trending-grid', results.slice(0, 6));
            this.populateSection('new-releases-grid', movies);
            this.populateSection('top-rated-grid', results.slice(6, 12));
            this.populateSection('binge-series-grid', tvShows);
            
        } else if (this.apiProvider === 'tvmaze') {
            // TVMaze for TV shows - search popular shows
            const popularShows = ['breaking bad', 'stranger things', 'game of thrones', 'the office', 'friends', 'wednesday'];
            const results = [];
            
            for (const show of popularShows) {
                try {
                    const searchResults = await this.altAPIs.searchTVMaze(show);
                    results.push(...searchResults.slice(0, 1)); // Take 1 from each search
                } catch (error) {
                    console.warn(`Failed to search for ${show}:`, error);
                }
            }
            
            this.populateSection('trending-grid', results.slice(0, 6));
            this.populateSection('binge-series-grid', results);
            this.populateSection('new-releases-grid', results.slice(3, 9));
            this.populateSection('top-rated-grid', results.slice(0, 6));
        } else {
            throw new Error('No API key provided');
        }
    }

    populateSection(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container || !items || items.length === 0) return;

        container.innerHTML = '';
        items.forEach(item => {
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
                    
                    if (!response.ok) {
                        throw new Error('Failed to load details');
                    }
                    
                    details = await response.json();
                    break;
            }
            
            this.displayDetails(details, isMovie);
            document.getElementById('detail-modal').style.display = 'block';
        } catch (error) {
            console.error('Details error:', error);
            this.showNotification('Failed to load details - ' + error.message, 'error');
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

        // If switching back to home (search-results), show homepage
        if (tabName === 'search-results') {
            // Clear search input and show homepage if no active search
            const searchInput = document.getElementById('search-input');
            if (!searchInput.value.trim()) {
                this.populateHomepage();
            }
        }
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