const featuresLink = document.getElementById("featureLink");
const featuresDropDown = document.getElementById("featuresDropDown");
const muUrlsToggle = document.getElementById("muUrlsToggle");
const myUrlsModal = new bootstrap.Modal(document.getElementById("myUrlsModal"));

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function enableFeaturHover() {
  if (window.innerWidth >= 992) {
    featuresLink.addEventListener("mouseenter", showFeatureDropdown);
    featuresDropDown.addEventListener("mouseenter", showFeatureDropdown);
    featuresLink.addEventListener("mouseleave", hideFeatureDropDown);
    featuresDropDown.addEventListener("mouseleave", hideFeatureDropDown);
  }
}

function showFeatureDropdown() {
  featuresDropDown.classList.add("show");
}

function hideFeatureDropDown() {
  if (!featuresDropDown.matches(":hover") && !featuresLink.matches(":hover")) {
    featuresDropDown.classList.remove("show");
  }
}

enableFeaturHover();
window.addEventListener("resize", enableFeaturHover);

muUrlsToggle.addEventListener("click", () => {
  myUrlsModal.show();
});


// Copy to clipboard logic
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const link = this.getAttribute('data-link');
      navigator.clipboard.writeText(link).then(() => {
        this.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        setTimeout(() => {
          this.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 2000);
      });
    });
  });

