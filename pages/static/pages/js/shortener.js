const tryItNow = document.getElementById('tryItNow')
const urlInput = document.getElementById('urlInput')
const shortenBtn = document.getElementById('shortenBtn')
const urlShortener = document.getElementById('urlShortener')
const resultCard = document.getElementById("shortenedResult");
const container = document.getElementById("ShortenerContainer");
const shortenAnotherBtn = document.getElementById("shortenAnother");
const originalUrl = document.getElementById('originalUrl')
const shortenedURL = document.getElementById('shortenedURL')
const copyShortenedURL = document.getElementById('copyShortenedURL')


tryItNow.addEventListener('click', ()=> {
    urlInput.scrollIntoView({behavior: 'smooth'})
    urlInput.focus()
})


async function shortenURL(url) {
  try {
    const response = await fetch('/api/v1/shorten/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFToken': getCookie('csrftoken')
        // 'Authorization': 'Token your_token_here', // if using token auth
      },
      body: JSON.stringify({
        'url': url
      })
    })

    const raw = await response.text(); // 🔹 read body once as plain text
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      // not valid JSON — could be 500 server HTML or plain text
    }

    if (!response.ok) {
      const msg = data?.error || 'An error occurred. Please try again.';
      throw new Error(msg);
    }

    return data

  } catch (error) {
    console.error('Error:', error.message);
    showAlert('error', error.message)
  }
}


urlShortener.addEventListener('submit', async (e)=> {
    e.preventDefault()

    if (urlInput.value == "" || urlInput.value == null) {
        showAlert('warning', 'Please enter a valid URL.');
        return
    }

    shortenBtn.innerHTML = `<div class="spinner-border text-white" role="status"><span class="visually-hidden">Loading...</span></div>`
    shortenBtn.style.pointerEvents = 'none'
    shortenBtn.style.opacity = "0.8";
    shortenBtn.classList.add('loading');


    const response = await shortenURL(urlInput.value)

    shortenBtn.innerHTML = `Shorten URL`
    shortenBtn.style.pointerEvents = 'auto'
    shortenBtn.style.opacity = "1";
    shortenBtn.classList.remove('loading');
    shortenBtn.innerHTML = '';


    if (!response) return

    originalUrl.innerText = response.link.url
    shortenedURL.innerText = response.link.shortened_url
    shortenedURL.href = response.link.shortened_url
    copyShortenedURL.setAttribute('data-link', `${response.link.shortened_url}`)

    // updating share links

     // Twitter / X
    document.getElementById('shareTritter').href = `https://twitter.com/intent/tweet?url=${response.link.shortened_url}`;

    // WhatsApp
    document.getElementById('shareWhatsapp').href = `https://wa.me/?text=${response.link.shortened_url}`;

    // Facebook
    document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${response.link.shortened_url}`;

    // LinkedIn
    document.getElementById('shareLinkdin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${response.link.shortened_url}`;

    // Threads
    document.getElementById('shareThreads').href = `https://www.threads.com/intent/post?text=${response.link.shortened_url}`;

    // Email
    document.getElementById('shareEmail').href = `mailto:?subject=Check this out&body=${response.link.shortened_url}`;


    urlShortener.classList.add("fade-out");
    setTimeout(() => {
      urlShortener.classList.add("d-none");
      resultCard.classList.remove("d-none");
      resultCard.classList.remove("fade-out");
      resultCard.classList.add("fade-in");
    }, 400);

})

shortenAnotherBtn.addEventListener("click", () => {
    resultCard.classList.add("fade-out");
    setTimeout(() => {
      resultCard.classList.add("d-none");
      urlShortener.classList.remove("d-none");
      urlShortener.classList.remove("fade-out");
      urlShortener.reset()
      urlShortener.classList.add("fade-in");
    }, 400);
  });