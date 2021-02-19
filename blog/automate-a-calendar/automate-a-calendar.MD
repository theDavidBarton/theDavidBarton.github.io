# How to automate date selection with puppeteer?

When it comes to e2e automation of forms: calendars and date pickers are the trickiest to be implemented. Or at least to make a general solution that can automate any calendar UI-s.

# In theory

You can collect the content of the calendar with `page.$eval` and `page.$$eval` methods:

```javascript
const calMonthYear = await page.$eval('.calendar-monthname', month => month.innerText)
// September 2020

const calDays = await page.$$eval('.calendar-grid > ul > li', days => days.map(d => d.innerText))
// ["30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "1", "2", "3"]
```

_Note:_ in the final example I declare them with `let` due to they need to be redeclared once we have to step to the next month on date selection.

Then if you concat the dates you can make every calendar day element a valid JavaScript Date object, e.g.:

```javascript
Date.parse(`${calDays[10]} ${calMonthYear}`) // 9 September 2020
// 1599602400000
```

The current day (today) always has a specific class name, e.g.: `.selected`, we can evaluate its date with puppeteer (let's assume this is the valid "now" and not `Date.now()`)

```javascript
const calToday = await page.$eval('.selected', day => day.innerText)
// 9
```

```javascript
const todayIndex = calDays.indexOf(calToday)
// 10

const todayEpoch = Date.parse(`${calDays[todayIndex]} ${calMonthYear}`) // 9 September 2020
// 1599602400000
```

We can create a date desired to be selected in Epoch format (it should be `Date.parse()`-ed):

```javascript
let today = new Date(todayEpoch)
let sevenDaysLater = new Date()
sevenDaysLater.setDate(today.getDate() + 7)
sevenDaysLater.setHours(0, 0, 0, 0)
// 1600207200000  (Wed Sep 16 2020 00:00:00 GMT+0200 (Central European Summer Time))
```

And finally, you should compose an iteration to select the desired 7 days later element, something like this:

```javascript
[...]

let calendarGridItemCount =  await page.$$eval('.calendar-grid > ul > li', el => el.length)
let calMonthYear = await page.$eval('.calendar-monthname', month => month.innerText)
let calDays = await page.$$eval('.calendar-grid > ul > li', days => days.map(d => d.innerText))

const wantedDate = Date.parse(sevenDaysLater)

  for (let i = 0; i < calendarGridItemCount; i++) {
    let examinedCalendarGridItem = Date.parse(`${calDays[i]} ${calMonthYear}`)
    if (examinedCalendarGridItem == wantedDate) {
      const dayFound = (await page.$$('.calendar-grid > ul > li'))[i]
      await dayFound.click()
      break
    } else if (examinedCalendarGridItem !== wantedDate && i === calendarGridItemCount - 1) {
      await page.click('.calendar-next')
      calendarGridItemCount = await page.$$eval('.calendar-grid > ul > li', el => el.length)
      calMonthYear = await page.$eval('.calendar-monthname', month => month.innerText)
      calDays = await page.$$eval('.calendar-grid > ul > li', days => days.map(d => d.innerText))
      i = 0
      continue
    }
  }
```

## Make sure:

- you handle those cases when the +7 days date is in the next month (step to the next month with the `.calendar-next` button);
- handling of the orphan days (either at the beginning of the month or at the end... if the orphans at the end are selectable, then it is not a problem) e.g.: you can clean the values of the orphans in `calDays` array with keeping their indexes (the indexes are needed in the iteration to identify the selectable dates, slicing the past dates would mess up their order).
