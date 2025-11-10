// Enhanced Library Management System
class LibraryManager {
    constructor() {
        this.playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        this.likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        this.defaultPlaylists = ['Band-aid for the Soul', 'Emo in Echoes', 'Hugot Sa Jeep'];
        this.container = document.getElementById('library-playlists-container');
        this.init();
    }

    init() {
        this.initializeDefaultPlaylists();
        this.renderAllPlaylists();
        this.setupSearch();
        this.setupEventListeners();
    }

    initializeDefaultPlaylists() {
        let needsUpdate = false;

        // Initialize default playlists with their static songs if they don't exist or are empty
        this.defaultPlaylists.forEach(playlistName => {
            if (!this.playlists[playlistName] || this.playlists[playlistName].length === 0) {
                this.playlists[playlistName] = this.getStaticPlaylistSongs(playlistName);
                needsUpdate = true;
            }
        });

        // Ensure Liked Songs exists
        if (!this.playlists['Liked Songs']) {
            this.playlists['Liked Songs'] = this.likedSongs;
            needsUpdate = true;
        }

        if (needsUpdate) {
            this.saveToStorage();
        }
    }

    getStaticPlaylistSongs(playlistName) {
        // Define the static songs for each playlist
        const staticSongs = {
            'Band-aid for the Soul': [
                { title: 'Akap', artist: 'Imago', image: 'assets/img/library/Band-aid for the Soul/akap.jpg', src: 'assets/audio/library/Band-aid for the Soul/Akap - Imago.mp3' },
                { title: 'First of Summer', artist: 'Urbandub', image: 'assets/img/library/Band-aid for the Soul/first of summer.jpg', src: 'assets/audio/library/Band-aid for the Soul/Urbandub - First Of Summer.mp3' },
                { title: 'Same Ground', artist: 'Kitchie Nadal', image: 'assets/img/library/Band-aid for the Soul/same ground.jpg', src: 'assets/audio/library/Band-aid for the Soul/Same Ground - Kitchie Nadal.mp3' },
                { title: 'Soul Searching', artist: 'Urbandub', image: 'assets/img/library/Band-aid for the Soul/soul searching.png', src: 'assets/audio/library/Band-aid for the Soul/Urbandub - Soul Searching.mp3' },
                { title: 'Stars', artist: 'Callalily', image: 'assets/img/library/Band-aid for the Soul/stars.jpg', src: 'assets/audio/library/Band-aid for the Soul/Stars - Callalily.mp3' },
                { title: 'Sunday Driving', artist: 'Rico Blanco', image: 'assets/img/library/Band-aid for the Soul/sunday driving.jpg', src: 'assets/audio/library/Band-aid for the Soul/Sunday Driving - rico blanco.mp3' },
                { title: 'Tagpuan', artist: 'Kamikazee', image: 'assets/img/library/Band-aid for the Soul/tagpuan.jpg', src: 'assets/audio/library/Band-aid for the Soul/Tagpuan - Kamikazee.mp3' },
                { title: 'These Days', artist: 'Bamboo', image: 'assets/img/library/Band-aid for the Soul/these days.jpg', src: 'assets/audio/library/Band-aid for the Soul/These Days - Bamboo.mp3' },
                { title: 'Torres', artist: 'Mayonnaise', image: 'assets/img/library/Band-aid for the Soul/torres.jpg', src: 'assets/audio/library/Band-aid for the Soul/mayonnaise - torres.mp3' },
                { title: 'Tulad ng Dati', artist: 'The Dawn', image: 'assets/img/library/Band-aid for the Soul/tulad ng dati.jpg', src: 'assets/audio/library/Band-aid for the Soul/The Dawn - Tulad Ng Dati.mp3' }
            ],
            'Emo in Echoes': [
                { title: 'Brick by Boring Brick', artist: 'Paramore', image: 'assets/img/library/Emo in Echoes/brick by boring - paramore.jpg', src: 'assets/audio/library/Emo in Echoes/brick by boring - paramore.mp3' },
                { title: 'Sugar, We\'re Going Down', artist: 'Fall Out Boy', image: 'assets/img/library/Emo in Echoes/Sugar, We\'re Goin Down.jpg', src: 'assets/audio/library/Emo in Echoes/Sugar, We\'re Goin Down.mp3' },
                { title: 'Swing Swing', artist: 'All American Rejects', image: 'assets/img/library/Emo in Echoes/Swing, Swing.png', src: 'assets/audio/library/Emo in Echoes/Swing, Swing.mp3' },
                { title: 'Boston Drama', artist: 'Typecast', image: 'assets/img/library/Emo in Echoes/Typecast Boston Drama.jpg', src: 'assets/audio/library/Emo in Echoes/Typecast Boston Drama Lyrics.mp3' },
                { title: 'Until the Day I Die', artist: 'Story of the Year', image: 'assets/img/library/Emo in Echoes/Until the Day I Die.jpg', src: 'assets/audio/library/Emo in Echoes/Until the Day I Die.mp3' },
                { title: 'Vindicated', artist: 'Dashboard Confessional', image: 'assets/img/library/Emo in Echoes/vindicated.jpg', src: 'assets/audio/library/Emo in Echoes/Vindicated.mp3' },
                { title: 'Voices', artist: 'Saosin', image: 'assets/img/library/Emo in Echoes/voices.jpg', src: 'assets/audio/library/Emo in Echoes/Voices.mp3' },
                { title: 'You Found Me', artist: 'The Fray', image: 'assets/img/library/Emo in Echoes/You Found Me.jpg', src: 'assets/audio/library/Emo in Echoes/You Found Me.mp3' }
            ],
            'Hugot Sa Jeep': [
                { title: 'Clarity', artist: 'Zedd', image: 'assets/img/library/Hugot Sa Jeep/Clarity.jpg', src: 'assets/audio/library/Hugot Sa Jeep/Clarity.mp3' },
                { title: 'Saan', artist: 'Maki', image: 'assets/img/library/Hugot Sa Jeep/Maki - Saan.jpg', src: 'assets/audio/library/Hugot Sa Jeep/Maki - Saan.mp3' },
                { title: 'Roses', artist: 'The Chainsmokers', image: 'assets/img/library/Hugot Sa Jeep/Roses.png', src: 'assets/audio/library/Hugot Sa Jeep/Roses.mp3' },
                { title: 'Señorita', artist: 'Justin Timberlake', image: 'assets/img/library/Hugot Sa Jeep/Señorita.jpg', src: 'assets/audio/library/Hugot Sa Jeep/Señorita.mp3' },
                { title: 'Tattoo', artist: 'Jordin Sparks', image: 'assets/img/library/Hugot Sa Jeep/Tattoo.jpg', src: 'assets/audio/library/Hugot Sa Jeep/Tattoo.mp3' },
                { title: 'What\'s Luv', artist: 'Fat Joe ft. Ashanti', image: 'assets/img/library/Hugot Sa Jeep/What\'s Luv.jpg', src: 'assets/audio/library/Hugot Sa Jeep/What\'s Luv.mp3' },
                { title: 'Where is the Love', artist: 'Black Eyed Peas', image: 'assets/img/library/Hugot Sa Jeep/Where Is the Love.jpg', src: 'assets/audio/library/Hugot Sa Jeep/Where Is the Love.mp3' },
                { title: 'You and I Both', artist: 'Jason Mraz', image: 'assets/img/library/Hugot Sa Jeep/You And I Both.jpg', src: 'assets/audio/library/Hugot Sa Jeep/You And I Both.mp3' }
            ]
        };

        return staticSongs[playlistName] || [];
    }

    saveToStorage() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
    }

    setupEventListeners() {
        // Event delegation for remove buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.remove-song-btn')) {
                const btn = e.target.closest('.remove-song-btn');
                const playlistName = btn.dataset.playlist;
                const songIndex = parseInt(btn.dataset.index);
                this.removeSongFromPlaylist(playlistName, songIndex);
            }
            
            if (e.target.closest('.remove-playlist-btn')) {
                const btn = e.target.closest('.remove-playlist-btn');
                const playlistName = btn.dataset.playlist;
                this.removePlaylist(playlistName);
            }
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.searchbox');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterSongs(e.target.value.toLowerCase());
            });
        }
    }

    filterSongs(searchTerm) {
        const allSongCards = document.querySelectorAll('.song-card');
        
        allSongCards.forEach(card => {
            const title = card.querySelector('strong').textContent.toLowerCase();
            const artist = card.querySelector('.text-light').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    getAllPlaylists() {
        const allPlaylists = { ...this.playlists };
        
        // Ensure Liked Songs is always included and up to date
        allPlaylists['Liked Songs'] = this.likedSongs;
        
        return allPlaylists;
    }

    renderAllPlaylists() {
        const allPlaylists = this.getAllPlaylists();
        this.container.innerHTML = '';

        if (Object.keys(allPlaylists).length === 0) {
            this.showEmptyState();
            return;
        }

        const playlistNames = Object.keys(allPlaylists);
        const rows = this.chunkArray(playlistNames, 3); // 3 playlists per row

        rows.forEach((rowPlaylists, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'library-playlists-row';
            
            rowPlaylists.forEach(playlistName => {
                const playlistBox = this.createPlaylistBox(playlistName, allPlaylists[playlistName]);
                rowDiv.appendChild(playlistBox);
            });

            this.container.appendChild(rowDiv);
        });
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    createPlaylistBox(playlistName, songs) {
        const playlistBox = document.createElement('div');
        playlistBox.className = 'playlist-box';
        
        const isDefault = this.defaultPlaylists.includes(playlistName);
        const isLiked = playlistName === 'Liked Songs';
        
        if (isLiked) {
            playlistBox.classList.add('liked-playlist');
        }
        if (isDefault || isLiked) {
            playlistBox.classList.add('default-playlist');
        }

        const heading = document.createElement('div');
        heading.className = 'playlist-heading';
        
        const titleText = document.createElement('span');
        titleText.className = 'playlist-title-text';
        titleText.textContent = playlistName;
        
        heading.appendChild(titleText);
        
        // Add remove playlist button for non-default playlists
        if (!isDefault && !isLiked) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-playlist-btn';
            removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
            removeBtn.title = `Delete ${playlistName}`;
            removeBtn.dataset.playlist = playlistName;
            heading.appendChild(removeBtn);
        }

        const card = document.createElement('div');
        card.className = 'playlist-card-dark';

        const scroll = document.createElement('div');
        scroll.className = 'playlist-scroll';

        if (songs.length === 0) {
            scroll.innerHTML = this.getEmptyPlaylistHTML(playlistName);
        } else {
            songs.forEach((song, index) => {
                const songCard = this.createSongCard(song, playlistName, index);
                scroll.appendChild(songCard);
            });
        }

        card.appendChild(scroll);
        playlistBox.appendChild(heading);
        playlistBox.appendChild(card);

        return playlistBox;
    }

    createSongCard(song, playlistName, index) {
        const songCard = document.createElement('div');
        songCard.className = 'song-card d-flex align-items-center mb-3';

        songCard.innerHTML = `
            <img src="${song.image}" 
                 alt="Album art" 
                 class="library-album-art rounded me-3">
            <div class="flex-grow-1 position-relative">
                <strong class="d-block">${song.title}</strong>
                <span class="text-light small">${song.artist}</span>
                <audio controls class="w-100 mt-1">
                    <source src="${song.src}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>
                <button class="remove-song-btn" 
                        data-playlist="${playlistName}" 
                        data-index="${index}"
                        title="Remove from ${playlistName}">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;

        return songCard;
    }

    getEmptyPlaylistHTML(playlistName) {
        const icons = {
            'Liked Songs': 'bi-heart',
            'Band-aid for the Soul': 'bi-bandage',
            'Emo in Echoes': 'bi-emoji-frown',
            'Hugot Sa Jeep': 'bi-car-front'
        };

        const icon = icons[playlistName] || 'bi-music-note-beamed';
        
        return `
            <div class="empty-playlist">
                <i class="bi ${icon}"></i>
                <p>No songs in ${playlistName} yet</p>
                <small class="text-muted">Add songs from the homepage to get started</small>
            </div>
        `;
    }

    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-playlist" style="grid-column: 1 / -1;">
                <i class="bi bi-music-note-list" style="font-size: 3rem;"></i>
                <h4 class="mt-3">Your library is empty</h4>
                <p class="text-muted">Start adding songs from the homepage to build your library</p>
                <a href="index.html" class="btn btn-primary mt-3">Explore Homepage</a>
            </div>
        `;
    }

    removeSongFromPlaylist(playlistName, songIndex) {
        if (playlistName === 'Liked Songs') {
            // Remove from liked songs
            if (this.likedSongs[songIndex]) {
                const removedSong = this.likedSongs.splice(songIndex, 1)[0];
                this.playlists['Liked Songs'] = this.likedSongs;
                this.saveToStorage();
                this.showNotification(`💔 Removed "${removedSong.title}" from ${playlistName}`);
            }
        } else {
            // Remove from regular playlist
            if (this.playlists[playlistName] && this.playlists[playlistName][songIndex]) {
                const removedSong = this.playlists[playlistName].splice(songIndex, 1)[0];
                this.saveToStorage();
                this.showNotification(`🗑️ Removed "${removedSong.title}" from ${playlistName}`);
            }
        }

        // Re-render the library
        this.renderAllPlaylists();
    }

    removePlaylist(playlistName) {
        if (this.defaultPlaylists.includes(playlistName) || playlistName === 'Liked Songs') {
            this.showNotification('⚠️ Cannot delete default playlists');
            return;
        }

        if (confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
            delete this.playlists[playlistName];
            this.saveToStorage();
            this.showNotification(`🗑️ Deleted playlist "${playlistName}"`);
            this.renderAllPlaylists();
        }
    }

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.library-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'library-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show and auto-remove
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the library when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LibraryManager();
});

// Add notification styles to the page
const notificationStyles = `
    .library-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4a4a4a;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-size: 0.9rem;
    }
    .library-notification.show {
        transform: translateX(0);
    }
    @media (max-width: 768px) {
        .library-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        .library-notification.show {
            transform: translateY(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);