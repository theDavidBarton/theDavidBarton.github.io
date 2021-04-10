const marked = require('marked')
const fs = require('fs')
const articles = require('./articleMetas.json') // it will be re-generated with build but historical file is accurate for this job

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
const linksTemplate = fs.readFileSync(__dirname + '/../links/links.template', 'utf-8')
const top = homeMarkup.split('<main>')
// const bottom = homeMarkup.split('</main>') the homepage footer's markup is not in use at the moment
const blogMain = blogTemplate.split('<!-- content goes here -->')
const linksMain = linksTemplate.split('<!-- content goes here -->')
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
  const metaMarkup = `<div>${meta.date}, <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><image href="/assets/clock.svg" width="16" height="16"></image></svg> <span id="readTime">${readTime(md)}</span>, In: ${meta.category}</div>`
  const sourceMarkup = meta['originally-published']
    ? `<div class="author-info">Originally published on: <a target="_blank" rel="noopener noreferrer" href="${meta['canonical-href']}">${meta['originally-published']}</a></div>`
    : '<div class="author-info">by David Barton</div>'
  const sourceMarkupSimple = meta['originally-published']
    ? `<span>Originally published on: <a target="_blank" rel="noopener noreferrer" href="${meta['canonical-href']}">${meta['originally-published']}</a></span>`
    : '<span>by David Barton</span>'
  const leadMd = `- [${meta.title}](/blog/${folder}) ${meta.date}\n`
  const nextPrevMarkup = `<aside class="next-prev-grid">${
    articles[meta.id - 1]
      ? `<a class="prev-article" href="/blog/${articles[meta.id - 1].slug}">Previous post: <wbr>${
          articles[meta.id - 1].title
        }</a>`
      : ''
  }${
    articles[meta.id + 1]
      ? `<a class="next-article" href="/blog/${articles[meta.id + 1].slug}">Next post: <wbr>${articles[meta.id + 1].title}</a>`
      : ''
  }</aside>`
  /* prettier-ignore */
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
    nextPrevMarkup +
    blogMain[1]
  fs.writeFileSync(`${__dirname}/${folder}/index.html`, finalMarkup)
  meta.published
    ? console.log(`html file succesfully created for: ${folder} [${meta.id}]`)
    : console.log(`[UNPUBLISHED] html file succesfully created for: ${folder} [${meta.id}]`)
}

// blogroll
const blogLeadsUnited = marked(leads.reverse().join(''))
const finalBlogLeads =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>Blog - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  blogMain[0] +
  '<h1>Blog</h1>' +
  blogLeadsUnited +
  blogMain[1]
fs.writeFileSync(__dirname + '/index.html', finalBlogLeads)
console.log('html file succesfully created for: united blog leads')

// 404
const error404 =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>404 - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  error404Template +
  blogMain[1]
fs.writeFileSync(__dirname + '/../404.html', error404)
console.log('html file succesfully created for: 404')

// links
const linksMarkdown = fs.readFileSync(__dirname + '/../links/links.MD', 'utf-8')
const links =
  top[0]
    .replace(/<title(.*)<\/title>/, '<title>Links - theDavidBarton.github.io</title>')
    .replace(/<link rel="canonical" href=(.*)\s\/>/, '') +
  linksMain[0] +
  '<h1>Links</h1>' +
  marked(linksMarkdown) +
  linksMain[1] +
  blogMain[1]
fs.writeFileSync(__dirname + '/../links/index.html', links)
console.log('html file succesfully created for: links')

// latest article JSON and articleMetas JSON
const latestArticle = articleMetas[articleMetas.length - 1]
fs.writeFileSync(__dirname + '/../header/latestArticle.json', JSON.stringify(latestArticle))
fs.writeFileSync(__dirname + '/articleMetas.json', JSON.stringify(articleMetas))
console.log('json file succesfully created for: latest article, articleMetas')

// RSS
const escapeInvalidChars = string => string.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace(/'-'/, '&apos;').replace(/"/, '&quot;')
const rssItems = articleMetas
  .map(
    el =>
      `<item><title>${escapeInvalidChars(el.title)}</title><link>https://theDavidBarton.github.io/${el.slug}</link><pubDate>${new Date(
        el.date
      ).toUTCString()}</pubDate><guid>https://theDavidBarton.github.io/${el.slug}</guid><description>${
        escapeInvalidChars(el.lead)
      }</description></item>`
  )
  .reverse()
  .join('\n')
const finalRSS = rss[0] + rssItems + rss[1]
fs.writeFileSync(__dirname + '/rss.xml', finalRSS)
console.log('xml file succesfully created for: RSS feed')
console.log('\n!!! on brand new articles: make sure to run the build at least twice to create "next" "prev" links !!!')
