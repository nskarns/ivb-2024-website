document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.company-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            buttons.forEach(btn => btn.classList.remove('company-button-active'));

            // Add active state to the clicked button
            button.classList.add('company-button-active');
        });
    });
});