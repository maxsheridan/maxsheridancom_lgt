document.addEventListener("DOMContentLoaded", function() {
    let submitted = false;

    // Function to handle form submission
    function handleFormSubmission(contactForm) {
        contactForm.addEventListener("submit", function(e) {
            if (!submitted) {
                e.preventDefault(); // Prevent normal submission
                contactForm.querySelectorAll("*").forEach(element => element.style.display = "none"); // Hide all form elements

                const thanksMessage = document.createElement("p");
                thanksMessage.textContent = "Thanks. We’ll be in touch.";
                contactForm.insertBefore(thanksMessage, contactForm.firstChild); // Prepend the message

                submitted = true;
                setTimeout(() => contactForm.submit(), 1000); // Submit the form after a delay
            }
        });

        document.getElementById("hidden_iframe").onload = () => {
            submitted = false; // Reset the variable if needed
        };
    }

    // Initial check for the contact form and handle its submission
    const contentContainer = document.getElementById("dynamic-content");
    const contactForm = document.getElementById("contactForm");
    if (contactForm) handleFormSubmission(contactForm); // Attach handler to existing form

    // Dynamic content loading
    document.addEventListener("click", async (event) => {
        const link = event.target.closest("a[data-page]");
        if (link) {
            event.preventDefault();
            const page = link.getAttribute("data-page");

            const response = await fetch(`${page}.html`);
            if (response.ok) {
                const content = await response.text();
                contentContainer.innerHTML = content;

                // Reattach the form submission handler if a new form is loaded
                const newContactForm = document.getElementById("contactForm");
                if (newContactForm) handleFormSubmission(newContactForm);

                // Remove any previous audio player instance before reinitializing
                if (typeof Essential_Audio !== "undefined" && typeof Essential_Audio.destroy === "function") {
                    Essential_Audio.destroy();
                }

                // Directly initialize the audio player after new content is loaded
                if (typeof Essential_Audio !== "undefined" && typeof Essential_Audio.init === "function") {
                    Essential_Audio.init();
                }
            }
        }
    });
});
