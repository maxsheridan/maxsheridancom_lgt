document.addEventListener("DOMContentLoaded", function() {
    let submitted = false;

    // Handle form submission
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

    // Initial check for contact form and submission handling
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

                // Update page title
                const titleMatch = content.match(/<title>(.*?)<\/title>/);
                if (titleMatch) {
                    document.title = titleMatch[1]; // Directly set the title without adding a suffix
                }

                // Reattach form submission handler
                const newContactForm = document.getElementById("contactForm");
                if (newContactForm) handleFormSubmission(newContactForm);

                // Remove previous audio player instance before reinitializing
                if (typeof Essential_Audio !== "undefined" && typeof Essential_Audio.destroy === "function") {
                    Essential_Audio.destroy();
                }

                // Initialize audio player after new content is loaded
                if (typeof Essential_Audio !== "undefined" && typeof Essential_Audio.init === "function") {
                    Essential_Audio.init();
                }
            }
        }
    });
});
