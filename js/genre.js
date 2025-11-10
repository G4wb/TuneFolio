// ===== Audio Playback Functionality =====
document.addEventListener("DOMContentLoaded", () => {
    // Initialize audio playback for genre songs
    document.querySelectorAll('.genre-song-img-container').forEach(container => {
        const audio = container.querySelector('audio');
        const playBtn = container.querySelector('.genre-play-btn i');
        const btnWrapper = container.querySelector('.genre-play-btn');
        const progress = container.querySelector('.genre-audio-progress');

        // Play/Pause toggle
        btnWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Pause all other audios
            document.querySelectorAll('audio').forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                    const otherPlayBtn = otherAudio.parentElement.querySelector('.genre-play-btn i');
                    if (otherPlayBtn) {
                        otherPlayBtn.classList.remove('bi-pause-fill');
                        otherPlayBtn.classList.add('bi-play-fill');
                    }
                }
            });

            if (audio.paused) {
                audio.play();
                playBtn.classList.remove('bi-play-fill');
                playBtn.classList.add('bi-pause-fill');
            } else {
                audio.pause();
                playBtn.classList.remove('bi-pause-fill');
                playBtn.classList.add('bi-play-fill');
            }
        });

        // Update progress bar
        audio.addEventListener('timeupdate', () => {
            if (!isNaN(audio.duration)) {
                progress.value = (audio.currentTime / audio.duration) * 100;
            }
        });

        // Scrub audio with progress bar
        progress.addEventListener('input', () => {
            if (!isNaN(audio.duration)) {
                audio.currentTime = (progress.value / 100) * audio.duration;
            }
        });

        // Reset when song ends
        audio.addEventListener('ended', () => {
            playBtn.classList.remove('bi-pause-fill');
            playBtn.classList.add('bi-play-fill');
        });
    });

    // Initialize playlist functionality
    initializePlaylistFunctionality();
});

// ===== Scroll Functionality =====
function scrollGenre(btn, direction) {
    const box = btn.parentElement.querySelector(".genre-row");
    const scrollAmount = box.clientWidth * 0.8;
    box.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}

// ===== Arrow Visibility Logic =====
document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".genre-box");
    boxes.forEach((box) => {
        const row = box.querySelector(".genre-row");
        const leftBtn = box.querySelector(".genre-scroll-btn.left");
        const rightBtn = box.querySelector(".genre-scroll-btn.right");

        const updateArrows = () => {
            leftBtn.style.display = row.scrollLeft > 5 ? "flex" : "none";
            rightBtn.style.display =
                row.scrollWidth - row.clientWidth - row.scrollLeft > 5 ? "flex" : "none";
        };

        row.addEventListener("scroll", updateArrows);
        window.addEventListener("resize", updateArrows);
        updateArrows();
    });
});

// ===== Playlist Management System =====
class GenrePlaylistManager {
    constructor() {
        this.playlists = JSON.parse(localStorage.getItem('playlists')) || {};
        this.likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        this.init();
    }

    init() {
        // Only ensure Liked Songs exists
        if (!this.playlists['Liked Songs']) {
            this.playlists['Liked Songs'] = this.likedSongs;
            this.saveToStorage();
        }
    }

    saveToStorage() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
    }

    getSongInfo(songContainer) {
        const songCard = songContainer.closest('.genre-song-card');
        const title = songCard.querySelector('.genre-song-title').textContent;
        const artist = songCard.querySelector('.genre-artist-name').textContent;
        const audioSrc = songCard.querySelector("audio").src;
        const imageSrc = songCard.querySelector("img").src;
        
        return { 
            artist: artist || 'Unknown Artist', 
            title: title || 'Unknown Title', 
            src: audioSrc, 
            image: imageSrc 
        };
    }

    toggleLike(songContainer) {
        const song = this.getSongInfo(songContainer);
        const likeIndex = this.likedSongs.findIndex(s => 
            s.title === song.title && s.artist === song.artist
        );

        if (likeIndex === -1) {
            this.likedSongs.push(song);
            this.playlists['Liked Songs'] = this.likedSongs;
            this.saveToStorage();
            this.showNotification(`❤️ Added "${song.title}" to Liked Songs`);
            return true;
        } else {
            this.likedSongs.splice(likeIndex, 1);
            this.playlists['Liked Songs'] = this.likedSongs;
            this.saveToStorage();
            this.showNotification(`💔 Removed "${song.title}" from Liked Songs`);
            return false;
        }
    }

    addToPlaylist(songContainer, playlistName) {
        const song = this.getSongInfo(songContainer);
        
        // If playlist doesn't exist, create it
        if (!this.playlists[playlistName]) {
            this.playlists[playlistName] = [];
        }

        // Check if song already exists in playlist
        const exists = this.playlists[playlistName].some(s => 
            s.title === song.title && s.artist === song.artist
        );

        if (!exists) {
            this.playlists[playlistName].push(song);
            this.saveToStorage();
            this.showNotification(`✅ Added "${song.title}" to ${playlistName}`);
            return true;
        } else {
            this.showNotification(`ℹ️ "${song.title}" is already in ${playlistName}`);
            return false;
        }
    }

    createNewPlaylist(songContainer) {
        const playlistName = prompt('Enter name for new playlist:');
        if (!playlistName) return null;

        if (this.playlists[playlistName]) {
            alert('Playlist already exists!');
            return null;
        }

        this.playlists[playlistName] = [];
        const song = this.getSongInfo(songContainer);
        this.playlists[playlistName].push(song);
        this.saveToStorage();
        
        this.showNotification(`🎵 Created "${playlistName}" and added "${song.title}"`);
        return playlistName;
    }

    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.playlist-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'playlist-notification';
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

    getPlaylistNames() {
        return Object.keys(this.playlists).filter(name => name !== 'Liked Songs');
    }

    isSongLiked(songContainer) {
        const song = this.getSongInfo(songContainer);
        return this.likedSongs.some(s => 
            s.title === song.title && s.artist === song.artist
        );
    }
}

// ===== Initialize Playlist Manager =====
let genrePlaylistManager;

function initializePlaylistFunctionality() {
    genrePlaylistManager = new GenrePlaylistManager();

    // ===== Enhanced Add to Playlist Functionality =====
    document.querySelectorAll(".add-playlist-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const songContainer = btn.closest(".genre-song-img-container");
            showGenrePlaylistDropdown(btn, songContainer);
        });
    });
}

function showGenrePlaylistDropdown(button, songContainer) {
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.playlist-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'playlist-dropdown';
    
    const isLiked = genrePlaylistManager.isSongLiked(songContainer);

    dropdown.innerHTML = `
        <div class="playlist-dropdown-header">
            <strong>Add to Playlist</strong>
        </div>
        <div class="playlist-dropdown-item like-item" data-action="like">
            <i class="bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
            ${isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
        </div>
        <div class="playlist-dropdown-divider"></div>
        <div class="playlist-dropdown-subheader">Your Library Playlists</div>
        ${genrePlaylistManager.getPlaylistNames().map(playlistName => `
            <div class="playlist-dropdown-item" data-action="add-to" data-playlist="${playlistName}">
                <i class="bi bi-music-note-list"></i>
                ${playlistName}
            </div>
        `).join('')}
        <div class="playlist-dropdown-divider"></div>
        <div class="playlist-dropdown-item" data-action="create-new">
            <i class="bi bi-plus-circle"></i>
            Create New Playlist
        </div>
    `;

    // Position dropdown near the button
    const rect = button.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.zIndex = '1000';

    document.body.appendChild(dropdown);

    // Handle dropdown clicks
    dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.playlist-dropdown-item');
        if (!item) return;

        const action = item.dataset.action;
        
        switch (action) {
            case 'like':
                genrePlaylistManager.toggleLike(songContainer);
                dropdown.remove();
                break;
            case 'add-to':
                genrePlaylistManager.addToPlaylist(songContainer, item.dataset.playlist);
                dropdown.remove();
                break;
            case 'create-new':
                genrePlaylistManager.createNewPlaylist(songContainer);
                dropdown.remove();
                break;
        }
    });

    // Close dropdown when clicking outside
    setTimeout(() => {
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target) && e.target !== button) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };
        document.addEventListener('click', closeDropdown);
    }, 100);
}