// Demo data for OTT Tracker - Works without API key
const DEMO_MOVIES = [
    {
        id: 1,
        title: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent, but a psychopathic criminal mastermind known as the Joker threatens to undermine Batman's work and plunge the city into anarchy.",
        poster_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
        release_date: "2008-07-18",
        vote_average: 9.0,
        genre_ids: [28, 80, 18],
        genres: [{id: 28, name: "Action"}, {id: 80, name: "Crime"}, {id: 18, name: "Drama"}],
        runtime: 152,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Christopher Nolan"}],
            cast: [{name: "Christian Bale"}, {name: "Heath Ledger"}, {name: "Aaron Eckhart"}, {name: "Michael Caine"}, {name: "Maggie Gyllenhaal"}]
        }
    },
    {
        id: 2,
        title: "Inception",
        overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious.",
        poster_path: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
        release_date: "2010-07-16",
        vote_average: 8.8,
        genre_ids: [28, 878, 53],
        genres: [{id: 28, name: "Action"}, {id: 878, name: "Science Fiction"}, {id: 53, name: "Thriller"}],
        runtime: 148,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Christopher Nolan"}],
            cast: [{name: "Leonardo DiCaprio"}, {name: "Marion Cotillard"}, {name: "Tom Hardy"}, {name: "Elliot Page"}, {name: "Ken Watanabe"}]
        }
    },
    {
        id: 3,
        name: "Breaking Bad",
        overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
        poster_path: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
        first_air_date: "2008-01-20",
        vote_average: 9.5,
        genre_ids: [18, 80],
        genres: [{id: 18, name: "Drama"}, {id: 80, name: "Crime"}],
        number_of_seasons: 5,
        media_type: "tv",
        credits: {
            crew: [{job: "Director", name: "Vince Gilligan"}],
            cast: [{name: "Bryan Cranston"}, {name: "Aaron Paul"}, {name: "Anna Gunn"}, {name: "RJ Mitte"}, {name: "Dean Norris"}]
        }
    },
    {
        id: 4,
        title: "Interstellar",
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        poster_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        release_date: "2014-11-07",
        vote_average: 8.6,
        genre_ids: [12, 18, 878],
        genres: [{id: 12, name: "Adventure"}, {id: 18, name: "Drama"}, {id: 878, name: "Science Fiction"}],
        runtime: 169,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Christopher Nolan"}],
            cast: [{name: "Matthew McConaughey"}, {name: "Anne Hathaway"}, {name: "Jessica Chastain"}, {name: "Michael Caine"}, {name: "Casey Affleck"}]
        }
    },
    {
        id: 5,
        name: "Stranger Things",
        overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        poster_path: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
        first_air_date: "2016-07-15",
        vote_average: 8.7,
        genre_ids: [18, 9648, 878],
        genres: [{id: 18, name: "Drama"}, {id: 9648, name: "Mystery"}, {id: 878, name: "Science Fiction"}],
        number_of_seasons: 4,
        media_type: "tv",
        credits: {
            crew: [{job: "Director", name: "The Duffer Brothers"}],
            cast: [{name: "Millie Bobby Brown"}, {name: "Finn Wolfhard"}, {name: "David Harbour"}, {name: "Winona Ryder"}, {name: "Noah Schnapp"}]
        }
    },
    {
        id: 6,
        title: "Avengers: Endgame",
        overview: "After the devastating events of Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all.",
        poster_path: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
        release_date: "2019-04-26",
        vote_average: 8.4,
        genre_ids: [12, 878, 28],
        genres: [{id: 12, name: "Adventure"}, {id: 878, name: "Science Fiction"}, {id: 28, name: "Action"}],
        runtime: 181,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Anthony Russo"}, {job: "Director", name: "Joe Russo"}],
            cast: [{name: "Robert Downey Jr."}, {name: "Chris Evans"}, {name: "Mark Ruffalo"}, {name: "Chris Hemsworth"}, {name: "Scarlett Johansson"}]
        }
    },
    {
        id: 7,
        name: "The Office",
        overview: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        poster_path: "https://image.tmdb.org/t/p/w500/7DJKHzAi83LmQFpA7gTK8sI3Qmm.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/4E7d7Gtbf2ZOKhsT8jDBjocPZdN.jpg",
        first_air_date: "2005-03-24",
        vote_average: 8.9,
        genre_ids: [35],
        genres: [{id: 35, name: "Comedy"}],
        number_of_seasons: 9,
        media_type: "tv",
        credits: {
            crew: [{job: "Director", name: "Greg Daniels"}],
            cast: [{name: "Steve Carell"}, {name: "John Krasinski"}, {name: "Jenna Fischer"}, {name: "Rainn Wilson"}, {name: "Mindy Kaling"}]
        }
    },
    {
        id: 8,
        title: "Pulp Fiction",
        overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
        poster_path: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
        release_date: "1994-09-10",
        vote_average: 8.9,
        genre_ids: [53, 80],
        genres: [{id: 53, name: "Thriller"}, {id: 80, name: "Crime"}],
        runtime: 154,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Quentin Tarantino"}],
            cast: [{name: "John Travolta"}, {name: "Samuel L. Jackson"}, {name: "Uma Thurman"}, {name: "Bruce Willis"}, {name: "Ving Rhames"}]
        }
    },
    {
        id: 9,
        name: "Game of Thrones",
        overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
        poster_path: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/suopoADq0k8YHr9hrjQ2wkf3wKw.jpg",
        first_air_date: "2011-04-17",
        vote_average: 9.3,
        genre_ids: [10765, 18, 10759],
        genres: [{id: 10765, name: "Sci-Fi & Fantasy"}, {id: 18, name: "Drama"}, {id: 10759, name: "Action & Adventure"}],
        number_of_seasons: 8,
        media_type: "tv",
        credits: {
            crew: [{job: "Director", name: "David Benioff"}, {job: "Director", name: "D.B. Weiss"}],
            cast: [{name: "Peter Dinklage"}, {name: "Lena Headey"}, {name: "Emilia Clarke"}, {name: "Kit Harington"}, {name: "Sophie Turner"}]
        }
    },
    {
        id: 10,
        title: "The Shawshank Redemption",
        overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.",
        poster_path: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg",
        release_date: "1994-09-23",
        vote_average: 9.3,
        genre_ids: [18, 80],
        genres: [{id: 18, name: "Drama"}, {id: 80, name: "Crime"}],
        runtime: 142,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Frank Darabont"}],
            cast: [{name: "Tim Robbins"}, {name: "Morgan Freeman"}, {name: "Bob Gunton"}, {name: "William Sadler"}, {name: "Clancy Brown"}]
        }
    },
    {
        id: 11,
        title: "Spider-Man: Into the Spider-Verse",
        overview: "Miles Morales is juggling his life between being a high school student and being a spider-man. When Wilson 'Kingpin' Fisk uses a super collider, others from across the Spider-Verse are transported to his dimension.",
        poster_path: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/7d6EY00g1c39SGZOoCJ5Py9nNth.jpg",
        release_date: "2018-12-14",
        vote_average: 8.4,
        genre_ids: [16, 28, 12],
        genres: [{id: 16, name: "Animation"}, {id: 28, name: "Action"}, {id: 12, name: "Adventure"}],
        runtime: 117,
        media_type: "movie",
        credits: {
            crew: [{job: "Director", name: "Bob Persichetti"}, {job: "Director", name: "Peter Ramsey"}],
            cast: [{name: "Shameik Moore"}, {name: "Jake Johnson"}, {name: "Hailee Steinfeld"}, {name: "Mahershala Ali"}, {name: "Brian Tyree Henry"}]
        }
    },
    {
        id: 12,
        name: "The Mandalorian",
        overview: "After the fall of the Galactic Empire, lawlessness has spread throughout the galaxy. A lone gunfighter makes his way through the outer reaches, earning his keep as a bounty hunter.",
        poster_path: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
        backdrop_path: "https://image.tmdb.org/t/p/w1280/o7qi7v4dGpM9Z8kx5QpcNkHIOPz.jpg",
        first_air_date: "2019-11-12",
        vote_average: 8.7,
        genre_ids: [10765, 37],
        genres: [{id: 10765, name: "Sci-Fi & Fantasy"}, {id: 37, name: "Western"}],
        number_of_seasons: 3,
        media_type: "tv",
        credits: {
            crew: [{job: "Director", name: "Jon Favreau"}],
            cast: [{name: "Pedro Pascal"}, {name: "Gina Carano"}, {name: "Carl Weathers"}, {name: "Giancarlo Esposito"}, {name: "Werner Herzog"}]
        }
    }
];

// Additional search data for different queries
const SEARCH_RESULTS = {
    "batman": [
        DEMO_MOVIES[0], // The Dark Knight
        {
            id: 13,
            title: "Batman Begins",
            overview: "Driven by tragedy, billionaire Bruce Wayne dedicates his life to uncovering and defeating the corruption that plagues his home, Gotham City.",
            poster_path: "https://image.tmdb.org/t/p/w500/8RW2runSEc34NlIee5od3YItTXh.jpg",
            release_date: "2005-06-15",
            vote_average: 8.2,
            media_type: "movie"
        }
    ],
    "spider": [
        DEMO_MOVIES[10], // Spider-Man: Into the Spider-Verse
        {
            id: 14,
            title: "Spider-Man: No Way Home",
            overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
            poster_path: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            release_date: "2021-12-17",
            vote_average: 8.4,
            media_type: "movie"
        }
    ],
    "star wars": [
        DEMO_MOVIES[11], // The Mandalorian
        {
            id: 15,
            title: "Star Wars: The Force Awakens",
            overview: "Thirty years after defeating the Galactic Empire, Han Solo and his allies face a new threat from the evil First Order.",
            poster_path: "https://image.tmdb.org/t/p/w500/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg",
            release_date: "2015-12-18",
            vote_average: 7.4,
            media_type: "movie"
        }
    ],
    "marvel": [
        DEMO_MOVIES[5], // Avengers: Endgame
        {
            id: 16,
            title: "Black Panther",
            overview: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.",
            poster_path: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
            release_date: "2018-02-16",
            vote_average: 7.3,
            media_type: "movie"
        }
    ],
    "comedy": [
        DEMO_MOVIES[6], // The Office
        {
            id: 17,
            name: "Brooklyn Nine-Nine",
            overview: "A single-camera ensemble comedy following the lives of an eclectic group of detectives in a Brooklyn precinct.",
            poster_path: "https://image.tmdb.org/t/p/w500/hgRMSOt7a1b8qyQR68vUixJPang.jpg",
            first_air_date: "2013-09-17",
            vote_average: 8.4,
            media_type: "tv"
        }
    ]
};

// Make data available globally
window.DEMO_MOVIES = DEMO_MOVIES;
window.SEARCH_RESULTS = SEARCH_RESULTS;