// INITIALIZE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', function() {
    initPlatformButtons();
    initVideoPlayer();
    initAppButtons();
    initNewsletterForm();
    
    console.log('Keidan Music page initialized successfully!');
});

// ========== PLATFORM BUTTONS (SPOTIFY/APPLE MUSIC) ==========
function initPlatformButtons() {
    const platformButtons = document.querySelectorAll('.platform-btn');
    
    platformButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const platform = this.getAttribute('data-platform');
            const link = this.getAttribute('data-link');
            
            // Get platform name for notification
            const platformName = platform === 'spotify' ? 'Spotify' : 'Apple Music';
            
            // Show notification
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Opening ${platformName}...`,
                    'info'
                );
            }
            
            // Open link after short delay
            setTimeout(() => {
                window.open(link, '_blank');
            }, 1000);
        });
    });
}

// ========== VIDEO PLAYER ==========
function initVideoPlayer() {
    const videoContainer = document.getElementById('videoContainer');
    const playButton = document.getElementById('playButton');
    const videoPlayer = document.getElementById('videoPlayer');
    const mainVideo = document.getElementById('mainVideo');
    const closeVideo = document.getElementById('closeVideo');
    const videoThumbnail = videoContainer.querySelector('.video-thumbnail');
    
    // Play button click
    if (playButton) {
        playButton.addEventListener('click', function() {
            playVideo();
        });
    }
    
    // Thumbnail click
    if (videoThumbnail) {
        videoThumbnail.addEventListener('click', function() {
            playVideo();
        });
    }
    
    // Close button click
    if (closeVideo) {
        closeVideo.addEventListener('click', function() {
            stopVideo();
        });
    }
    
    // Play video function
    function playVideo() {
        if (videoThumbnail) videoThumbnail.style.display = 'none';
        if (videoPlayer) videoPlayer.style.display = 'block';
        if (mainVideo) {
            mainVideo.play();
        }
    }
    
    // Stop video function
    function stopVideo() {
        if (videoPlayer) videoPlayer.style.display = 'none';
        if (videoThumbnail) videoThumbnail.style.display = 'block';
        if (mainVideo) {
            mainVideo.pause();
            mainVideo.currentTime = 0;
        }
    }
    
    // Video ended event
    if (mainVideo) {
        mainVideo.addEventListener('ended', function() {
            stopVideo();
        });
    }
}

// ========== APP BUTTONS ==========
function initAppButtons() {
    const appButtons = document.querySelectorAll('.btn-app');
    
    appButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (window.KeidanUtils) {
                window.KeidanUtils.showNotification(
                    `Opening ${buttonText}...`,
                    'info'
                );
            }
            
            // You can add actual app store links here
            console.log(`${buttonText} clicked`);
        });
    });
}

// ========== NEWSLETTER FORM ==========
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('.email-input');
    const joinButton = document.querySelector('.btn-join');
    
    if (joinButton) {
        joinButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (emailInput && emailInput.value.trim() !== '') {
                const email = emailInput.value.trim();
                
                // Basic email validation
                if (validateEmail(email)) {
                    if (window.KeidanUtils) {
                        window.KeidanUtils.showNotification(
                            'Successfully subscribed to newsletter!',
                            'success'
                        );
                    }
                    emailInput.value = '';
                } else {
                    if (window.KeidanUtils) {
                        window.KeidanUtils.showNotification(
                            'Please enter a valid email address',
                            'error'
                        );
                    }
                }
            } else {
                if (window.KeidanUtils) {
                    window.KeidanUtils.showNotification(
                        'Please enter your email address',
                        'error'
                    );
                }
            }
        });
    }
}

// ========== EMAIL VALIDATION ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== EXPORT FUNCTIONS ==========
window.KeidanMusic = {
    playVideo: function() {
        const playButton = document.getElementById('playButton');
        if (playButton) playButton.click();
    }
};

console.log('Keidan Music JS loaded successfully!');