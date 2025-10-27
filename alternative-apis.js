// Alternative API integrations for OTT Tracker
class AlternativeAPIs {
    constructor(tracker) {
        this.tracker = tracker;
        this.omdbBaseURL = 'https://www.omdbapi.com/';
        this.tvmazeBaseURL = 'https://api.tvmaze.com';
    }

    // OMDb API Integration
    async searchOMDb(query, apiKey) {
        try {
            const response = await fetch(`${this.omdbBaseURL}?apikey=${apiKey}&s=${encodeURIComponent(query)}&type=movie`);
            const data = await response.json();
            
            if (data.Response === "True") {
                return this.formatOMDbResults(data.Search);
            } else {
                throw new Error(data.Error || 'No results found');
            }
        } catch (error) {
            console.error('OMDb search error:', error);
            throw error;
        }
    }

    async getOMDbDetails(imdbID, apiKey) {
        try {
            const response = await fetch(`${this.omdbBaseURL}?apikey=${apiKey}&i=${imdbID}&plot=full`);
            const data = await response.json();
            
            if (data.Response === "True") {
                return this.formatOMDbDetails(data);
            } else {
                throw new Error(data.Error || 'Details not found');
            }
        } catch (error) {
            console.error('OMDb details error:', error);
            throw error;
        }
    }

    formatOMDbResults(results) {
        return results.map(item => ({
            id: item.imdbID,
            title: item.Title,
            overview: `${item.Type} released in ${item.Year}`,
            poster_path: item.Poster !== 'N/A' ? item.Poster : null,
            release_date: item.Year,
            vote_average: 0, // OMDb doesn't provide ratings in search
            media_type: item.Type === 'series' ? 'tv' : 'movie'
        }));
    }

    formatOMDbDetails(data) {
        return {
            id: data.imdbID,
            title: data.Title,
            name: data.Title, // For TV shows
            overview: data.Plot !== 'N/A' ? data.Plot : 'No plot available',
            poster_path: data.Poster !== 'N/A' ? data.Poster : null,
            backdrop_path: data.Poster !== 'N/A' ? data.Poster : null,
            release_date: data.Released !== 'N/A' ? data.Released : data.Year,
            first_air_date: data.Released !== 'N/A' ? data.Released : data.Year,
            vote_average: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0,
            runtime: data.Runtime !== 'N/A' ? data.Runtime : 'N/A',
            number_of_seasons: data.totalSeasons !== 'N/A' ? `${data.totalSeasons} seasons` : 'N/A',
            genres: data.Genre !== 'N/A' ? data.Genre.split(', ').map(g => ({name: g})) : [],
            credits: {
                crew: data.Director !== 'N/A' ? [{job: 'Director', name: data.Director}] : [],
                cast: data.Actors !== 'N/A' ? data.Actors.split(', ').map(name => ({name})) : []
            }
        };
    }

    // TVMaze API Integration (No API key required!)
    async searchTVMaze(query) {
        try {
            const response = await fetch(`${this.tvmazeBaseURL}/search/shows?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            return this.formatTVMazeResults(data);
        } catch (error) {
            console.error('TVMaze search error:', error);
            throw error;
        }
    }

    async getTVMazeDetails(showId) {
        try {
            const response = await fetch(`${this.tvmazeBaseURL}/shows/${showId}`);
            const data = await response.json();
            
            return this.formatTVMazeDetails(data);
        } catch (error) {
            console.error('TVMaze details error:', error);
            throw error;
        }
    }

    formatTVMazeResults(results) {
        return results.map(item => ({
            id: item.show.id,
            name: item.show.name,
            overview: item.show.summary ? item.show.summary.replace(/<[^>]*>/g, '') : 'No summary available',
            poster_path: item.show.image ? item.show.image.medium : null,
            first_air_date: item.show.premiered,
            vote_average: item.show.rating ? item.show.rating.average || 0 : 0,
            media_type: 'tv'
        }));
    }

    formatTVMazeDetails(data) {
        return {
            id: data.id,
            name: data.name,
            overview: data.summary ? data.summary.replace(/<[^>]*>/g, '') : 'No summary available',
            poster_path: data.image ? data.image.medium : null,
            backdrop_path: data.image ? data.image.original : null,
            first_air_date: data.premiered,
            vote_average: data.rating ? data.rating.average || 0 : 0,
            number_of_seasons: `${data.ended ? 'Ended' : 'Ongoing'} - ${data.network ? data.network.name : 'Network unknown'}`,
            genres: data.genres ? data.genres.map(g => ({name: g})) : [],
            credits: {
                crew: [],
                cast: [] // TVMaze has cast info but requires separate API call
            }
        };
    }
}

// Make available globally
window.AlternativeAPIs = AlternativeAPIs;