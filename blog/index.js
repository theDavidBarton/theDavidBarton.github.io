function responsiveImgs() {
  const img = document.querySelectorAll('img')
  img.forEach(el => el.classList.add('img-fluid'))
}
responsiveImgs()
