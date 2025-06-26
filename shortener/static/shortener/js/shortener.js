const tryItNow = document.getElementById('tryItNow')
const urlInput = document.getElementById('urlInput')
const shortenBtn = document.getElementById('shortenBtn')
const urlShortener = document.getElementById('urlShortener')
const resultCard = document.getElementById("shortenedResult");
const container = document.getElementById("ShortenerContainer");
const shortenAnotherBtn = document.getElementById("shortenAnother");


tryItNow.addEventListener('click', ()=> {
    urlInput.scrollIntoView({behavior: 'smooth'})
    urlInput.focus()
})

urlShortener.addEventListener('submit', (e)=> {
    e.preventDefault()
    console.log('url submitted')

    if (urlInput.value == "" || urlInput.value == null) {
        showAlert('warning', 'Please enter a valid URL.');
        return
    }

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