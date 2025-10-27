# Alternative Free Movie & TV APIs

Since TMDb registration might be temporarily unavailable, here are several **free alternatives** you can use with the OTT Tracker:

## 🎬 Free Movie & TV APIs

### 1. **OMDb API** (Open Movie Database)
- **Website**: http://www.omdbapi.com/
- **Registration**: Simple email registration
- **Free Tier**: 1,000 requests per day
- **Features**: Movies, TV series, episodes, ratings
- **API Key Required**: Yes
- **CORS**: Supported

**Example Usage:**
```javascript
// Search for movies
fetch(`http://www.omdbapi.com/?apikey=YOUR_KEY&s=batman&type=movie`)

// Get movie details
fetch(`http://www.omdbapi.com/?apikey=YOUR_KEY&i=tt0468569`)
```

### 2. **TVMaze API**
- **Website**: https://www.tvmaze.com/api
- **Registration**: No API key required!
- **Free Tier**: Unlimited (with rate limiting)
- **Features**: TV shows, episodes, cast, schedule
- **API Key Required**: No
- **CORS**: Supported

**Example Usage:**
```javascript
// Search for TV shows
fetch(`https://api.tvmaze.com/search/shows?q=breaking bad`)

// Get show details
fetch(`https://api.tvmaze.com/shows/169`)
```

### 3. **JustWatch API** (Unofficial)
- **Website**: No official documentation
- **Registration**: None
- **Free Tier**: Unlimited
- **Features**: Streaming availability, movies, TV shows
- **API Key Required**: No
- **Note**: Unofficial, may change

### 4. **MovieDB Alternative - TMDB Proxy**
- Some developers create proxy services for TMDB
- Search GitHub for "tmdb-proxy" or "movie-api"
- Use with caution as these are unofficial

## 🔧 How to Switch APIs

### For OMDb API:
```javascript
// Replace the TMDb search function with:
async performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apiKey}&s=${query}&type=movie`);
    const data = await response.json();
    // Process OMDb response format
}
```

### For TVMaze API (TV Shows only):
```javascript
async performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await response.json();
    // Process TVMaze response format
}
```

## 📊 API Comparison

| API | Registration | Free Requests | Movies | TV Shows | Images | Ratings |
|-----|-------------|---------------|---------|----------|--------|---------|
| **TMDb** | Required | 1000/day | ✅ | ✅ | ✅ | ✅ |
| **OMDb** | Email only | 1000/day | ✅ | ✅ | ❌ | ✅ |
| **TVMaze** | None | Unlimited* | ❌ | ✅ | ✅ | ❌ |

*Rate limited but generous

## 🚀 Quick Start Alternatives

### Option 1: Use Demo Mode
The OTT Tracker now includes a **Demo Mode** with popular movies and TV shows. No API key required!

1. Open the app
2. Click "Try Demo Mode" instead of entering an API key
3. Start searching immediately

### Option 2: Switch to OMDb
1. Go to http://www.omdbapi.com/
2. Enter your email to get an API key (usually instant)
3. Modify the JavaScript to use OMDb endpoints

### Option 3: Use TVMaze for TV Shows
1. No registration needed
2. Modify the app to use TVMaze API
3. Focus on TV series tracking only

## 🔧 Implementation Guide

### Converting to OMDb API

1. **Update the base URL:**
```javascript
this.baseURL = 'http://www.omdbapi.com/';
```

2. **Modify search function:**
```javascript
async performSearch() {
    const query = document.getElementById('search-input').value.trim();
    const response = await fetch(`${this.baseURL}?apikey=${this.apiKey}&s=${query}`);
    const data = await response.json();
    
    if (data.Response === "True") {
        this.displaySearchResults(data.Search);
    }
}
```

3. **Update card creation for OMDb format:**
```javascript
createContentCard(item) {
    // OMDb uses different field names:
    // item.Title instead of item.title
    // item.Year instead of release_date
    // item.Poster instead of poster_path
}
```

## 🎯 Recommendation

**For immediate use**: Use the **Demo Mode** - it's ready to go!

**For full functionality**: Try **OMDb API** - it's reliable and has simple registration.

**For TV shows only**: Use **TVMaze API** - no registration required.

## 🔄 Future Updates

We're working on making the OTT Tracker API-agnostic, so you can easily switch between different APIs without code changes. Stay tuned!

---

**Need help?** Check the main README.md for setup instructions or create an issue if you encounter problems.