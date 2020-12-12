# How to check SSL cert with puppeteer??

Frustrating it is when you miss to renew your SSL cert on any of your domains. And it is hell of a job to check the different expiry dates among sites manually. with the help of puppeteer you can do it automatically.

You can use [`response.securityDetails()`][1] directly on the `page.goto` if you need the following methods:

- securityDetails.issuer()
- securityDetails.protocol()
- securityDetails.subjectAlternativeNames()
- securityDetails.subjectName()
- securityDetails.validFrom()
- securityDetails.validTo()

E.g. `validTo()`:

```javascript
const response = await page.goto(url)
const securityDetails = response.securityDetails()
const expiryDate = securityDetails.validTo() * 1000
console.log(new Date(expiryDate))
```

This method can be used in a for..of loop on a huge array of urls.

Output:

```
Sunday, December 20, 2020
```

[1]: https://pptr.dev/#?product=Puppeteer&show=api-class-securitydetails
