const mediaFiles = [
    "images/gallery/ivb_photo_one.jpg",
    "images/gallery/ivb_photo_two.png",
    "images/gallery/ivb_video_one.mp4",
    "images/gallery/ivb_video_two.mp4",
    "images/gallery/ivb_photo_three.png",
    "images/gallery/ivb_photo_four.jpg",
    "images/gallery/ivb_photo_five.jpg",
    "images/gallery/ivb_photo_six.jpg",
    "images/gallery/ivb_photo_seven.jpg",
    "images/gallery/ivb_photo_eight.jpg",
];

const itemsPerPage = 6;
let currentPage = 1;

function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Grabbing the correct images and showing them on the screen
function renderPage(page) {
    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = '';

    if (mediaFiles.length === 0) {
        mediaContainer.innerHTML = 'No Media Found';
    } else {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = mediaFiles.slice(start, end);

        const itemsPerRow = isMobileDevice() ? 1 : 3;

        for (let i = 0; i < pageItems.length; i += itemsPerRow) {
            const mediaRow = document.createElement('div');
            mediaRow.className = 'media';

            pageItems.slice(i, i + itemsPerRow).forEach(file => {
                const mediaElement = file.endsWith('.mp4') ? document.createElement('video') : document.createElement('img');
                mediaElement.src = file;
                if (mediaElement.tagName === 'VIDEO') {
                    mediaElement.className = 'media-video';
                    mediaElement.controls = true;
                } else {
                    mediaElement.className = 'media-image';
                    mediaElement.loading = 'lazy';
                }

                mediaRow.appendChild(mediaElement);
            });

            mediaContainer.appendChild(mediaRow);
        }

        attachClickEventToImages();
        renderPagination();
    }
}

// Determing the page number
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(mediaFiles.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentPage);
        });
        paginationContainer.appendChild(button);
    }
}

// Placing the click listener event on the images so that they enlarge when selected
function attachClickEventToImages() {
    document.querySelectorAll('.media img').forEach(media => {
        media.addEventListener('click', function() {
            const enlargedMediaContainer = document.getElementById('enlarged-media-container');
            const enlargedImage = document.getElementById('enlarged-image');
            
            // Hide both enlarged elements initially
            enlargedImage.style.display = 'none';
            
            // Setting enlarged image to that image
            enlargedImage.src = this.src;
            enlargedImage.style.display = 'block';
            
            enlargedMediaContainer.style.display = 'flex';
            enlargedMediaContainer.style.position = 'fixed';
            enlargedMediaContainer.style.top = '0';
            enlargedMediaContainer.style.left = '0';
            enlargedMediaContainer.style.width = '100%';
            enlargedMediaContainer.style.height = '100%';
            enlargedMediaContainer.style.justifyContent = 'center';
            enlargedMediaContainer.style.alignItems = 'center';
            enlargedMediaContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        });
    });
}

// When an image is clicked, make that image enlarged
document.addEventListener('click', function(event) {
    const enlargedMediaContainer = document.getElementById('enlarged-media-container');
    if (!event.target.closest('.media img') && !event.target.closest('#enlarged-image')) {
        enlargedMediaContainer.style.display = 'none';
    }
});

renderPage(currentPage);