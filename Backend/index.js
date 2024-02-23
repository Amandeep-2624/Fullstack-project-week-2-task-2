const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//backend logic to convert web to pdf.
app.post('/convert', async (req, res) => {
  const { url } = req.body;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for images to load
        await page.waitForSelector('img', { timeout: 10000 }); // 10 seconds timeout

        // Disable lazy loading for images
        await page.evaluate(() => {
          document.querySelectorAll('img').forEach(img => {
            img.setAttribute('loading', 'eager');
          });
        });

     // logic for displaying pdf logic   
    const pdfBuffer = await page.pdf({
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px'},
      landscape:true
    });
    await browser.close();
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  }
  // error handling for invalid webite url. 
  catch (error) {
    res.status(500).json({ error: error.message});
  }
});


// listening on port 4000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
