function responsiveImgs() {
  const element = document.querySelectorAll('img')
  element.forEach(el => el.classList.add('img-fluid'))
}
responsiveImgs()
