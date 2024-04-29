import { JSDOM } from 'jsdom';

function normalizeURL(url){
    const urlOBJ = new URL(url)
    let fullPath = `${urlOBJ.host}${urlOBJ.pathname}`
    if (fullPath.slice(-1) === "/"){
        fullPath = fullPath.slice(0,-1)
    }
    return fullPath
}

function getURLsFromHTML(html, baseURL) {
    const urls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
        let href = anchor.getAttribute('href')

        try {
          // convert any relative URLs to absolute URLs
            href = new URL(href, baseURL).href
            urls.push(href)
        } catch(err) {
            console.log(`${err.message}: ${href}`)
        }
    }
    }

    return urls
}


async function fetchHTML(url) {
    let res
    try {
        res = await fetch(url)
    } catch (err) {
        throw new Error(`Got Network error: ${err.message}`)
    }

    if (res.status > 399) {
        throw new Error(`Got HTTP error: ${res.status} ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
        throw new Error(`Got non-HTML response: ${contentType}`)
    }

    return res.text()
}

async function crawlPage (baseURL,currentURL = baseURL, pages = {}){
    console.log(`Currently crawling at: ${currentURL}`)
    const currentURLObj = new URL(currentURL)
    const baseURLObj = new URL(baseURL)
    if (currentURLObj.hostname !== baseURLObj.hostname) {
        return pages
    }
    const normalizedURL = normalizeURL(currentURL)
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++
        return pages
    }
    
    pages[normalizedURL] = 1
    let html = ''
    try {
        html = await fetchHTML(currentURL)
    }catch (err){
        console.log(err.message)
        return pages
    }
    const urls = getURLsFromHTML(html, baseURL)

    for (const url of urls){
        pages =  await crawlPage(baseURL,url,pages)
    }
    return pages
    
}



export {normalizeURL, getURLsFromHTML, crawlPage};
