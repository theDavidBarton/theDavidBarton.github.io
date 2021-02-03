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

// process existing templates and main HTML
const homeMarkup = fs.readFileSync(__dirname + '/../index.html', 'utf-8')
const blogTemplate = fs.readFileSync(__dirname + '/blogContainer.template', 'utf-8')
const rssTemplate = fs.readFileSync(__dirname + '/RSS.template', 'utf-8')
const error404Template = fs.readFileSync(__dirname + '/../404/404.template', 'utf-8')
const top = homeMarkup.split('<main>')
// const bottom = homeMarkup.split('</main>') the homepage footer's markup is not in use at the moment
const blogMain = blogTemplate.split('<!-- content goes here -->')
const rss = rssTemplate.split('<!-- content goes here -->')
const folders = getFolders()
const articleMetas = []
const leads = []

// blog posts
for (const folder of folders) {
  const meta = require(`${__dirname}/${folder}/meta.json`)
  const md = fs.readFileSync(`${__dirname}/${folder}/${folder}.md`, 'utf-8')
  const canonicalMarkup = meta.canonical ? `<link rel="canonical" href="${meta['canonical-href']}" />` : ''
  const descriptionMarkup = meta.lead ? `content="${meta.lead}"` : 'content="Github page of David Barton (theDavidBarton)"'
  const titleMarkup = `<title>${meta.title} - theDavidBarton.github.io</title>`
  /* prettier-ignore */
  const metaMarkup = `<div class="pt-3">${meta.date}, <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><image href="/assets/clock.svg" width="16" height="16"></image></svg> <span id="readTime">${readTime(md)}</span>, In: ${meta.category}</div>`
  const sourceMarkup = meta['originally-published']
    ? `<div class="pb-3">Originally published on: <a target="_blank" rel="noopener noreferrer" href="${meta['canonical-href']}">${meta['originally-published']}</a></div>`
    : '<div class="pb-3">by David Barton</div>'
  const sourceMarkupSimple = meta['originally-published']
    ? `<span>Originally published on: <a target="_blank" rel="noopener noreferrer" href="${meta['canonical-href']}">${meta['originally-published']}</a></span>`
    : '<span>by David Barton</span>'
  const readmoreMarkup = `<span class="toggle-lead-${meta.id}" title="toggle summary" onclick="toggleLead(${meta.id})">summary\u00A0»</span> <span class="lead-${meta.id}"><span class="font-weight-bold font-italic">Summary:</span> ${meta.lead} <a href="/blog/${folder}">Read more...</a></span>`
  /* prettier-ignore */
  const leadMd = `- ${meta.date}: [${meta.title}](/blog/${folder}) [${meta.category}] _${sourceMarkupSimple}_, ${readmoreMarkup}\n`
  if (meta.published) {
    leads[meta.id] = leadMd
    articleMetas[meta.id] = meta
  }
  const articleMarkup = marked(md)

  // blog main
  const finalMarkup =
    top[0]
      .replace(/<title(.*)<\/title>/, titleMarkup)
      .replace(/<link rel="canonical" href=(.*)\s\/>/, canonicalMarkup)
      .replace(/content="(.*)"/, descriptionMarkup) +
    blogMain[0] +
    metaMarkup +
    sourceMarkup +
    articleMarkup +
    blogMain[1]
  fs.writeFileSync(`${__dirname}/${folder}/index.html`, finalMarkup)
  meta.published
    ? console.log('html file succesfully created for: ' + folder)
    : console.log('[UNPUBLISHED] html file succesfully created for: ' + folder)
}

// blogroll
const blogLeadsUnited = marked(leads.reverse().join(''))
const finalBlogLeads =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>Blog - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  blogMain[0] +
  '<h1 class="py-2">Blog</h1>' +
  blogLeadsUnited +
  blogMain[1]
fs.writeFileSync(__dirname + '/index.html', finalBlogLeads)
console.log('html file succesfully created for: united blog leads')

// 404
const error404 =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>404 - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') + error404Template
fs.writeFileSync(__dirname + '/../404.html', error404)
console.log('html file succesfully created for: 404')

// latest article JSON and articleMetas JSON
const latestArticle = articleMetas[articleMetas.length - 1]
fs.writeFileSync(__dirname + '/../header/latestArticle.json', JSON.stringify(latestArticle))
fs.writeFileSync(__dirname + '/articleMetas.json', JSON.stringify(articleMetas))
console.log('json file succesfully created for: latest article, articleMetas')

// RSS
const rssItems = articleMetas
  .map(
    el =>
      `<title>${el.title}</title><link>https://theDavidBarton.github.io/${el.slug}</link><pubDate>${new Date(
        el.date
      ).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}</pubDate><description>${el.lead}</description>`
  )
  .reverse()
  .join('\n')
const finalRSS = rss[0] + rssItems + rss[1]
fs.writeFileSync(__dirname + '/rss.xml', finalRSS)
console.log('xml file succesfully created for: RSS feed')
