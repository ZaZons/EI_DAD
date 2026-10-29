#!/usr/bin/env node
// Loads one src/*.html page in a real headless browser and prints what
// actually happens (console output, uncaught errors, an optional click)
// as JSON. This is for an agent's own grounding before it coaches a
// student through DevTools — it is NOT meant to be pasted verbatim to the
// student. No assertions, no diagnosis, just ground truth.
//
// Usage:
//   node capture.mjs <page.html> [--click "<css selector>"] [--wait <ms>] [--screenshot <path>]
//
// Example:
//   node capture.mjs playground.html
//   node capture.mjs dom.html --click "td.grade" --screenshot /tmp/dom-after-click.png

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.resolve(__dirname, '../../../../src')

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' }

function parseArgs(argv) {
  const [page, ...rest] = argv
  if (!page) {
    console.error('Usage: node capture.mjs <page.html> [--click "<selector>"] [--wait <ms>] [--screenshot <path>]')
    process.exit(1)
  }
  const opts = { page, wait: 1500 }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--click') opts.click = rest[++i]
    else if (rest[i] === '--wait') opts.wait = Number(rest[++i])
    else if (rest[i] === '--screenshot') opts.screenshot = rest[++i]
  }
  return opts
}

function startStaticServer(rootDir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const filePath = path.join(rootDir, decodeURIComponent(req.url.split('?')[0]))
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' })
        res.end(data)
      })
    })
    server.listen(0, () => resolve(server))
  })
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const pagePath = path.join(SRC_DIR, opts.page)
  if (!fs.existsSync(pagePath)) {
    console.error(JSON.stringify({ error: `${opts.page} not found under src/` }))
    process.exit(1)
  }

  const server = await startStaticServer(SRC_DIR)
  const { port } = server.address()
  const url = `http://localhost:${port}/${opts.page}`

  const browser = await chromium.launch()
  const browserPage = await browser.newPage()

  const consoleMessages = []
  const pageErrors = []
  browserPage.on('console', (msg) => consoleMessages.push({ type: msg.type(), text: msg.text() }))
  browserPage.on('pageerror', (err) => pageErrors.push(String(err)))

  await browserPage.goto(url, { waitUntil: 'load' })
  await browserPage.waitForTimeout(opts.wait)

  let clickResult = null
  if (opts.click) {
    const locator = browserPage.locator(opts.click).first()
    const count = await browserPage.locator(opts.click).count()
    if (count === 0) {
      clickResult = { selector: opts.click, found: false }
    } else {
      await locator.click()
      await browserPage.waitForTimeout(opts.wait)
      clickResult = { selector: opts.click, found: true, matches: count }
    }
  }

  let screenshotPath = null
  if (opts.screenshot) {
    screenshotPath = path.resolve(opts.screenshot)
    await browserPage.screenshot({ path: screenshotPath, fullPage: true })
  }

  await browser.close()
  server.close()

  console.log(JSON.stringify({ url: opts.page, consoleMessages, pageErrors, clickResult, screenshotPath }, null, 2))
}

main()
