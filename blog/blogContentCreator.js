const marked = require('marked')
const fs = require('fs')

const getFolders = () =>
  /* prettier-ignore */
  fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)

// https://github.com/theDavidBarton/estimate-read-time
function readTime(text) {
  const wordsPerMinute = 265 // WPM - English
  const wordCount = text.split(/\s/g).length
  const minutes = wordCount / wordsPerMinute
  const readTime = Math.ceil(minutes)

  return readTime + ' min read'
}

const homeMarkup = fs.readFileSync(__dirname + '/../index.html', 'utf-8')
const blogTemplate = fs.readFileSync(__dirname + '/blogContainer.template', 'utf-8')
const error404Template = fs.readFileSync(__dirname + '/../404/404.template', 'utf-8')
const top = homeMarkup.split('<main>')
const bottom = homeMarkup.split('</main>')
const blogMain = blogTemplate.split('<!-- content goes here -->')
const folders = getFolders()
const leads = []
for (const folder of folders) {
  const meta = require(`${__dirname}/${folder}/meta.json`)
  const md = fs.readFileSync(`${__dirname}/${folder}/${folder}.md`, 'utf-8')
  const canonicalMarkup = meta.canonical ? `<link rel="canonical" href="${meta['canonical-href']}" />` : ''
  const descriptionMarkup = meta.lead ? `content="${meta.lead}"` : 'content="Github page of David Barton (theDavidBarton)"'
  const titleMarkup = `<title>${meta.title} - theDavidBarton.github.io</title>`
  /* prettier-ignore */
  const metaMarkup = `<div class="pt-3">${meta.date}, &#128368; <span id="readTime">${readTime(md)}</span>, In: ${meta.category}</div>`
  const sourceMarkup = meta['originally-published']
    ? `<div class="pb-3">Originally published on: <a target="_blank" rel="noopener noreferrer" href="${meta['canonical-href']}">${meta['originally-published']}</a></div>`
    : '<div class="pb-3">by David Barton</div>'
  /* prettier-ignore */
  const leadMd = `## [${meta.title}](/blog/${folder})\n\n ${metaMarkup + sourceMarkup}\n\n ${meta.lead}...\n\n [Read more =>](/blog/${folder})\n\n <hr class="bg-cool">`
  const leadMarkup = marked(leadMd)
  leads[meta.id] = leadMarkup
  const articleMarkup = marked(md)

  const finalMarkup =
    top[0]
      .replace(/<title(.*)<\/title>/, titleMarkup)
      .replace(/<link rel="canonical" href=(.*)\s\/>/, canonicalMarkup)
      .replace(/content="(.*)"/, descriptionMarkup) +
    blogMain[0] +
    metaMarkup +
    sourceMarkup +
    articleMarkup +
    blogMain[1] +
    bottom[1]
  fs.writeFileSync(`${__dirname}/${folder}/index.html`, finalMarkup)
  console.log('html file succesfully created for: ' + folder)
}
const blogLeadsUnited = leads.reverse().join('')
const finalBlogLeads =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>Blog - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  blogMain[0] +
  '<h1 class="py-3 display-4">blog</h1>' +
  blogLeadsUnited +
  blogMain[1] +
  bottom[1]
fs.writeFileSync(__dirname + '/index.html', finalBlogLeads)
console.log('html file succesfully created for: united blog leads')

const error404 =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>404 - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  error404Template +
  bottom[1]
fs.writeFileSync(__dirname + '/../404.html', error404)
console.log('html file succesfully created for: 404')
