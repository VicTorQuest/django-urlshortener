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
      let initialText = this.innerHTML
      navigator.clipboard.writeText(link).then(() => {
        this.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        showAlert('success', 'Link copied to clipboard!');
        setTimeout(() => {
          this.innerHTML = initialText;
        }, 2000);
      });
    });
  });

document.addEventListener("DOMContentLoaded", function () {
    const consentBanner = document.getElementById("cookieConsent");
    const acceptBtn = document.getElementById("acceptCookies");

    if (!localStorage.getItem("shortenerCookieAccepted")) {
      consentBanner.classList.remove("d-none");
    }

    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("shortenerCookieAccepted", "true");
      consentBanner.classList.add("d-none");
    });
  });

function showAlert(type = 'success', message = 'Action completed') {
    const toastEl = document.getElementById('globalToast');
    const toastBody = document.getElementById('globalToastBody');

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl);

    // background color class based on type
    const bgClassMap = {
      success: 'bg-success',
      warning: 'bg-dark',
      error: 'bg-danger',
      danger: 'bg-danger', // alias
      info: 'bg-info',
    };

    // Reset previous classes and content
    toastEl.className = 'toast align-items-center text-white border-0';
    toastEl.classList.add(bgClassMap[type] || 'bg-success');

    toastBody.innerText = message;

    toast.show();
  }