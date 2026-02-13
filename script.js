document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  // Check if the elements actually exist to avoid errors
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    const links = document.querySelectorAll(".nav-links a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  } else {
    console.error("Navigation elements not found. Check your HTML IDs!");
  }
});
