// When the page loads run the code
window.addEventListener("load", function() {
    function hideNCOSectionIfActiveIsZero() {
        const activeButton = document.querySelector('.company-button-active');
        const ncoSection = document.querySelector('.hierarchy-section-nco');

        if (activeButton && activeButton.id === '0') {
            ncoSection.style.display = 'none';
            adjustOnlineMembersHeight();
        } else {
            ncoSection.style.display = 'flex';
        }
    }

    function adjustOnlineMembersHeight() {
        const hierarchy = document.querySelector('.hierarchy');
        const onlineMembers = document.querySelector('.online-members');
        
        if (hierarchy && onlineMembers) {
            const hierarchyHeight = hierarchy.offsetHeight;
            onlineMembers.style.maxHeight = `${hierarchyHeight}px`;
        }
    }

    // Call hideNCOSectionIfActiveIsZero on page load
    hideNCOSectionIfActiveIsZero();

    // Adjust height after hiding NCO section
    adjustOnlineMembersHeight();

    // Adjust height on window resize
    window.addEventListener('resize', adjustOnlineMembersHeight);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                hideNCOSectionIfActiveIsZero();
                adjustOnlineMembersHeight();
            }
        });
    });

    const companyButtons = document.querySelectorAll('.company-button');
    companyButtons.forEach(button => {
        observer.observe(button, { attributes: true });
        button.addEventListener('click', function() {
            companyButtons.forEach(btn => btn.classList.remove('company-button-active'));
            void button.offsetHeight;
            button.classList.add('company-button-active');
            
            requestAnimationFrame(() => {
                hideNCOSectionIfActiveIsZero();
                adjustOnlineMembersHeight();
            });
        });
    });

    // Run function when page loads to make initial online member list adjust height
    setTimeout(function() {
        const activeButton = document.querySelector('.company-button-active');
        if (activeButton) {
            console.log('Active button found:', activeButton);
            activeButton.click();
        } else {
            console.error('Active button not found');
        }
    }, 100);
});