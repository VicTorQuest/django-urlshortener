const tryItNow = document.getElementById('tryItNow')
const urlInput = document.getElementById('urlInput')
const shortenBtn = document.getElementById('shortenBtn')
const urlShortener = document.getElementById('urlShortener')


tryItNow.addEventListener('click', ()=> {
    urlInput.scrollIntoView({behavior: 'smooth'})
    urlInput.focus()
})

urlShortener.addEventListener('submit', (e)=> {
    e.preventDefault()
    console.log('url submitted')
})
shortenBtn.addEventListener