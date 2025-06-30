const featuresLink = document.getElementById("featureLink");
const featuresDropDown = document.getElementById("featuresDropDown");
const muUrlsToggle = document.getElementById("muUrlsToggle");
const myUrlsModal = new bootstrap.Modal(document.getElementById("myUrlsModal"));
const myUrls = document.getElementById('myUrls')

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function enableTooltips(root) {
  root.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach(el => bootstrap.Tooltip.getOrCreateInstance(el));
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.copy-btn');   // did we click a .copy-btn?
  if (!btn) return;                            // nope → ignore

  const link = btn.dataset.link;               // same as getAttribute('data-link')
  const initial = btn.innerHTML;

  navigator.clipboard.writeText(link).then(() => {
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
    showAlert('success', 'Link copied to clipboard!');
    setTimeout(() => (btn.innerHTML = initial), 2000);
  });
});


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


async function getMyURLs() {
  try {
    const response = await fetch("/api/v1/my-urls/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      }
    })

    if (!response.ok) {
      throw new Error("Problem getting urls")
    }

    let res = await response.json()
    return res

  } catch (error) {
    console.error('Error:', error.message);
    showAlert('error', error.message)
  }
}



async function toggleMyURLs()  {
  myUrlsModal.show();

  myUrls.innerHTML = ""
  myUrls.innerHTML = `<div class="text-center"><div class="spinner-border text-brand" role="status"><span class="visually-hidden">Loading...</span></div></div>`


  const response = await getMyURLs()
  if (!response) return;

  myUrls.innerHTML = ""
  
  

  response.forEach(my_url => {
    let urlCard = `
      <div class="url-card shadow-sm mb-4 p-3 rounded">
        <div class="d-flex justify-content-between flex-wrap">
            <div class="mb-2">
                <p class="mb-1 small text-muted">Original URL:</p>
                <p class="mb-1 text-truncate">${my_url.url}</p>
                <p class="mb-1 small text-muted">Shortened:</p>
                <div class="d-flex align-items-center flex-wrap">
                <a href="${my_url.shortened_url}"target="_blank" class="text-dark fw-semibold me-2">
                  ${domain_name}/${my_url.short_code}
                </a>
                <button class="btn btn-sm btn-outline-dark me-2 copy-btn" data-link="${my_url.shortened_url}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Copy to clipboard">
                    <i class="bi bi-clipboard"></i> 
                </button>
                <a href="#" class="btn btn-sm btn-outline-dark me-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Customize your ${site_name} URL">
                    <i class="bi bi-pencil-square"></i> 
                </a>
                  <a href="#" class="btn btn-sm btn-outline-dark me-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Generate QR Code">
                    <i class="bi bi-qr-code"></i> 
                </a>
                </div>
            </div>

            <div class="d-flex align-items-start flex-wrap mt-3 mt-md-0">
                  <a href="#" class="btn btn-sm btn-outline-dark me-2" title="View analytics">
                <i class="bi bi-graph-up-arrow"></i> Insights
                </a>
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-brand dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-share-fill me-1"></i> Share
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow">
                        <li>
                        <a class="dropdown-item" href="https://twitter.com/intent/tweet?url=${my_url.shortened_url}" target="_blank">
                            <i class="bi bi-twitter-x text-dark me-2"></i> Twitter/X
                        </a>
                        </li>
                        <li>
                        <a class="dropdown-item" href="https://wa.me/?text=${my_url.shortened_url}" target="_blank">
                            <i class="bi bi-whatsapp text-dark me-2"></i> WhatsApp
                        </a>
                        </li>
                        <li>
                        <a class="dropdown-item" href="https://www.facebook.com/sharer/sharer.php?u=${my_url.shortened_url}" target="_blank">
                            <i class="bi bi-facebook text-dark me-2"></i> Facebook
                        </a>
                        </li>
                        <li>
                        <a class="dropdown-item" href="https://www.linkedin.com/sharing/share-offsite/?url=${my_url.shortened_url}" target="_blank">
                            <i class="bi bi-linkedin  me-2"></i> LinkedIn
                        </a>
                        </li>
                        <li>
                        <a class="dropdown-item" href="mailto:?subject=Check this out&body=${my_url.shortened_url}">
                            <i class="bi bi-envelope-fill text-dark me-2"></i> Email
                        </a>
                        </li>
                    </ul>
                    </div>

            </div>
        </div>
    </div>
    `
    myUrls.insertAdjacentHTML('beforeend', urlCard)
  });

  enableTooltips(myUrls);
    
};


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
      error: 'bg-dark',
      danger: 'bg-danger', // alias
      info: 'bg-info',
    };

    // Reset previous classes and content
    toastEl.className = 'toast align-items-center text-white border-0';
    toastEl.classList.add(bgClassMap[type] || 'bg-success');

    toastBody.innerText = message;

    toast.show();
  }

function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
  return cookieValue;
}
