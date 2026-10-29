#!/usr/bin/env node
// Loads a page from the student's running dev server(s) in a real headless
// browser and prints what actually happens (console output, uncaught
// errors, network failures, an optional click) as JSON. This is for an
// agent's own grounding before it coaches a student through DevTools — it
// is NOT meant to be pasted verbatim to the student. No assertions, no
// diagnosis, just ground truth.
//
// This lab's app is a Vite-served Vue SPA (frontend, default port 5173)
// that talks to a Laravel API (default port 8000) and a Socket.IO server
// (default port 3000). Those must already be running — this script does
// not start them. If the student hasn't started `npm run dev` in
// frontend/ (and, depending on the exercise, `php artisan serve` in api/
// and `npm run dev` in websockets/), tell them to start those first.
//
// Usage:
//   node capture.mjs [url] [--click "<css selector>"] [--wait <ms>] [--screenshot <path>]
//
// Examples:
//   node capture.mjs                          # http://localhost:5173/
//   node capture.mjs http://localhost:5173/
//   node capture.mjs --click "button:has-text('Increase')"
//   node capture.mjs --click "text=Send" --wait 2000

import path from 'node:path'
import { chromium } from 'playwright'

const DEFAULT_URL = 'http://localhost:5173/'

function parseArgs(argv) {
  const opts = { url: DEFAULT_URL, wait: 1500 }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--click') opts.click = argv[++i]
    else if (argv[i] === '--wait') opts.wait = Number(argv[++i])
    else if (argv[i] === '--screenshot') opts.screenshot = argv[++i]
    else rest.push(argv[i])
  }
  if (rest[0]) opts.url = rest[0]
  return opts
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))

  const browser = await chromium.launch()
  const browserPage = await browser.newPage()

  const consoleMessages = []
  const pageErrors = []
  const failedRequests = []
  browserPage.on('console', (msg) => consoleMessages.push({ type: msg.type(), text: msg.text() }))
  browserPage.on('pageerror', (err) => pageErrors.push(String(err)))
  browserPage.on('requestfailed', (req) =>
    failedRequests.push({ url: req.url(), method: req.method(), failure: req.failure()?.errorText })
  )
  browserPage.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push({ url: res.url(), status: res.status() })
    }
  })

  let navigationError = null
  try {
    await browserPage.goto(opts.url, { waitUntil: 'load', timeout: 10000 })
  } catch (err) {
    navigationError = String(err)
  }
  await browserPage.waitForTimeout(opts.wait)

  let clickResult = null
  if (opts.click && !navigationError) {
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
  if (opts.screenshot && !navigationError) {
    screenshotPath = path.resolve(opts.screenshot)
    await browserPage.screenshot({ path: screenshotPath, fullPage: true })
  }

  await browser.close()

  console.log(
    JSON.stringify(
      { url: opts.url, navigationError, consoleMessages, pageErrors, failedRequests, clickResult, screenshotPath },
      null,
      2
    )
  )
}

main()
