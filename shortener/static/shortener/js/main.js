const featuresLink = document.getElementById('featureLink') 
const featuresDropDown = document.getElementById('featuresDropDown')



function enableFeaturHover() {
    if (window.innerWidth >= 992 ) {
        featuresLink.addEventListener('mouseenter', showFeatureDropdown);
        featuresDropDown.addEventListener('mouseenter', showFeatureDropdown);
        featuresLink.addEventListener('mouseleave', hideFeatureDropDown);
        featuresDropDown.addEventListener('mouseleave', hideFeatureDropDown);
    } 
}

function showFeatureDropdown() {
    featuresDropDown.classList.add('show')
}

function hideFeatureDropDown() {
    if (!featuresDropDown.matches(':hover') && !featuresLink.matches(':hover')) {
        featuresDropDown.classList.remove('show')
    }
}




enableFeaturHover();
window.addEventListener('resize', enableFeaturHover);