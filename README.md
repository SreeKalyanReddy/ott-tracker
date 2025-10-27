# OTT Tracker - Personal Movie & Series Tracker

A modern, responsive web application to track your favorite movies and TV series using The Movie Database (TMDb) API. Perfect for your personal portfolio!

![OTT Tracker](https://via.placeholder.com/800x400/141414/ffffff?text=OTT+Tracker)

## ✨ Features

- 🔍 **Search Movies & TV Series** - Find any movie or TV show using TMDb's extensive database
- 📚 **Personal Watchlist** - Add movies and series you want to watch later
- ✅ **Watched Tracker** - Mark items as watched and keep track of what you've seen
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark Theme** - Easy on the eyes with a Netflix-inspired dark interface
- 💾 **Local Storage** - All your data is stored locally in your browser
- 🆓 **100% Free** - No paid services required, just a free TMDb API key

## 🚀 Live Demo

Open `index.html` in your browser to see the app in action!

## 🛠️ Setup Instructions

### Option 1: Demo Mode (Instant Start) ⚡

**No API key required!** Perfect for immediate testing and demonstration.

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Click **"Try Demo Mode"** on the setup screen
4. Start searching immediately with pre-loaded popular content!

**Demo Features:**
- 12+ popular movies and TV shows
- Search functionality for "batman", "marvel", "comedy", "star wars", etc.
- Full watchlist and tracking features
- Perfect for portfolio demonstrations

### Option 2: Full API Access

#### Step 1: Get Your Free TMDb API Key

1. Go to [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Create a free account
3. Navigate to [API Settings](https://www.themoviedb.org/settings/api)
4. Request an API key (choose "Developer" option)
5. Fill out the form with basic information about your project
6. Copy your API key once approved (usually instant)

#### Step 2: Run the Application

1. Download or clone this repository
2. Open `index.html` in your web browser
3. Enter your TMDb API key when prompted
4. Start searching for movies and TV series!

### Option 3: Alternative APIs

**TMDb registration not working?** Check out `ALTERNATIVE_APIS.md` for free alternatives:
- **OMDb API** - Simple email registration, 1000 requests/day
- **TVMaze API** - No registration required, TV shows only
- And more options!

## 📁 Project Structure

```
ott-tracker/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🎯 How to Use

### First Time Setup
1. When you first open the app, you'll see an API key setup screen
2. **Quick Start**: Click "Try Demo Mode" for instant access
3. **Full Access**: Enter your TMDb API key and click "Save Key"
4. The key is stored securely in your browser's local storage

### Searching for Content
1. Use the search bar to find movies or TV series
2. Filter by "All", "Movies", or "TV Series" using the dropdown
3. Click on any item to view detailed information

### Managing Your Lists
- **Add to Watchlist**: Click the "+" button on any search result
- **Mark as Watched**: From your watchlist, click "Mark as Watched"
- **Remove Items**: Use the remove buttons to clean up your lists

### Viewing Details
- Click on any movie or series poster to see detailed information
- View ratings, cast, director, genres, and more
- Manage your watchlist status directly from the detail view

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Modern JavaScript with classes and async/await
- **TMDb API** - The Movie Database REST API
- **Local Storage** - Browser storage for user data

### API Integration
The app uses The Movie Database (TMDb) API v3:
- **Search Endpoint**: `/search/multi`, `/search/movie`, `/search/tv`
- **Details Endpoint**: `/movie/{id}`, `/tv/{id}`
- **Image URLs**: `https://image.tmdb.org/t/p/w500/`

### Data Storage
All user data is stored locally using browser Local Storage:
- `tmdb_api_key` - Your API key
- `watchlist` - JSON array of watchlist items
- `watched` - JSON array of watched items

## 🎨 Customization

### Changing Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #e50914;    /* Netflix red */
    --accent-color: #f5c518;     /* IMDb yellow */
    --background-dark: #141414;  /* Dark background */
    /* ... more colors */
}
```

### Adding Features
The code is well-structured and commented. You can easily add features like:
- User ratings
- Personal notes
- Export/import functionality
- More detailed filters
- Recommendations

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## 🔐 Privacy & Security

- **No Data Collection**: Your data never leaves your browser
- **API Key Security**: Keys are stored locally and only sent to TMDb
- **No Tracking**: No analytics or tracking scripts
- **Offline Capable**: Your lists work even without internet

## 🐛 Troubleshooting

### Can't Register for TMDb?
- **Solution**: Use **Demo Mode** for immediate access
- **Alternative**: Check `ALTERNATIVE_APIS.md` for other free APIs
- **OMDb API**: Simple email registration as backup

### API Key Issues
- Make sure your API key is valid and active
- Check that you've accepted TMDb's terms of service
- Try regenerating your API key if needed
- **Fallback**: Switch to demo mode if API fails

### Search Not Working
- **Demo Mode**: Try searching for "batman", "marvel", "comedy"
- Verify your internet connection
- Check browser console for error messages
- Ensure your API key has proper permissions

### Data Not Saving
- Check if Local Storage is enabled in your browser
- Clear browser cache and try again
- Make sure you're not in private/incognito mode

## 🚀 Deployment Options

### GitHub Pages (Free)
1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select your branch and save
4. Your app will be available at `https://yourusername.github.io/repository-name`

### Netlify (Free)
1. Drag and drop your project folder to [Netlify](https://netlify.com)
2. Your app will be deployed instantly with a custom URL

### Vercel (Free)
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Deploy with zero configuration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the [TMDb API documentation](https://developers.themoviedb.org/3)
3. Open an issue in this repository

## 🌟 Show Your Support

If you found this project helpful, please give it a star ⭐ and share it with others!

---

**Happy tracking! 🎬🍿**