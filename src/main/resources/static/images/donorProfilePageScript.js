document.addEventListener("DOMContentLoaded", () => {
    const contactButton = document.getElementById("contactButton");

    // Handle contact request button click
    contactButton.addEventListener("click", () => {
        alert("Contact request sent to the donor!");
    });

    // Example of toggling availability (extendable to dynamic data)
    const availability = document.getElementById("availability");
    if (availability.textContent === "Available") {
        availability.classList.add("text-green-600");
    } else {
        availability.classList.add("text-red-600");
        availability.textContent = "Unavailable";
    }

    // Changing profile picture
    const fileInput = document.getElementById("fileInput");
    const changePhotoButton = document.getElementById("changePhotoButton");
    const profileImage = document.getElementById("profileImage");

    // Attach click event to the Change Photo button
    changePhotoButton.addEventListener("click", () => {
        fileInput.click(); // Trigger the hidden file input
    });

    // Listen for file input change
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader();

            // Read the file as a Data URL (Base64)
            reader.onload = function (e) {
                profileImage.src = e.target.result; // Set the uploaded image as the profile picture
            };

            reader.readAsDataURL(file); // Initiate reading of the file
        }
    });

    // JavaScript for Circular Progress Bar
    const progressBar = document.querySelector(".progress-bar");
    const percentageText = document.getElementById("percentage");
    const responseRatioText = document.getElementById("responseRatioText");
    const responseRatio = 80; // Example response ratio (adjust as needed)

    // Calculate circle properties
    const radius = progressBar.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // Set the strokeDasharray and initial offset
    progressBar.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (responseRatio / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;

    // Update the percentage text
    percentageText.textContent = `${responseRatio}%`;
    responseRatioText.textContent = `${responseRatio}%`;
});


// Array of image URLs
const images = [
    './images/ProfilePage/medical-report.jpg',
    './images/ProfilePage/medical-report.jpg',
    './images/ProfilePage/medical-report.jpg',
    './images/ProfilePage/medical-report.jpg',
];

// Slider container
const slider = document.getElementById('slider');

// Initialize the slider with images
images.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "Slider Image";
    img.classList = "w-full h-auto object-cover flex-shrink-0";
    slider.appendChild(img);
});

// Slider control
let currentIndex = 0;

const updateSlider = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
};

// Previous button
document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateSlider();
});

// Next button
document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
});



// JavaScript for toggling mobile menu

const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
mobileMenu.classList.remove('hidden'); // Show menu
});

closeBtn.addEventListener('click', () => {
mobileMenu.classList.add('hidden'); // Hide menu
});

