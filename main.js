import { argv } from 'node:process'
import { printReport } from './report.js'
import {getURLsFromHTML, normalizeURL, crawlPage} from './crawl.js'


async function main() {
    let baseURL 
    if (argv.length < 3){
        return console.log("1")
    }else if(argv.length >3){
        return console.log("1")
    }else{
        baseURL =  argv[2]
        console.log(`Crawler starting at ${baseURL}`)
    }
    
    const pages = await crawlPage(baseURL)
    printReport(pages)


}

main()