document.addEventListener("DOMContentLoaded", function() {
    let submitted = false;

    // Function to handle form submission
    function handleFormSubmission(contactForm) {
        contactForm.addEventListener("submit", function(e) {
            if (!submitted) {
                e.preventDefault();
                contactForm.querySelectorAll("*").forEach(element => element.style.display = "none");

                const thanksMessage = document.createElement("p");
                thanksMessage.textContent = "Thanks. We’ll be in touch.";
                contactForm.insertBefore(thanksMessage, contactForm.firstChild);

                submitted = true;
                setTimeout(() => contactForm.submit(), 1000);
            }
        });

        document.getElementById("hidden_iframe").onload = () => {
            submitted = false;
        };
    }

    // Initial check for the contact form and handle its submission
    const contentContainer = document.getElementById("dynamic-content");
    const contactForm = document.getElementById("contactForm");
    if (contactForm) handleFormSubmission(contactForm);

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

                // Update the page title if title information is in the loaded content
                const titleMatch = content.match(/<title>(.*?)<\/title>/);
                if (titleMatch) {
                    document.title = `${titleMatch[1]} - WSF`; // Add site title as suffix
                }

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
