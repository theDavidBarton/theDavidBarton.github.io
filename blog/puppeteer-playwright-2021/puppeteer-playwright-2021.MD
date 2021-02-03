# When does Puppeteer still beat Playwright?

Let's check while it still worth to choose Google's Puppeteer over Microsoft's Playwright in 2021.

## Main differentiator features released since the junction (January 2020):

| \*                              | Puppeteer | Playwright |
| ------------------------------- | --------- | ---------- |
| Firefox                         | (/)       | (/)        |
| jugglered Firefox               | (x)       | (/)        |
| Webkit (Safari)                 | (x)       | (/)        |
| recordVideo                     | (x)       | (/)        |
| page.emulateVisionDeficiency    | (/)       | (x)        |
| isJavaScriptEnabled()           | (/)       | (x)        |
| Mouse#wheel                     | (/)       | (x)        |
| page.waitForTimeout             | (/)       | (/)        |
| page.emulateIdleState()         | (/)       | (x)        |
| query handler API               | (/)       | (/)        |
| page.emulateNetworkConditions() | (/)       | (x)        |

Puppeteer release notes: https://github.com/puppeteer/puppeteer/releases
Playwright release notes: https://github.com/microsoft/playwright/releases
