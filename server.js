const {
  syncAndSeed,
  models: { People, Places, Things, Purchases },
} = require('./db');
const express = require('express');
const app = express();
const html = require('html-template-tag');

app.use(require('method-override')('_method'));
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res, next) => {
  try {
    const [peoplepop, placespop, thingspop, purchasespop] = await Promise.all([
      People.findAll(),
      Places.findAll(),
      Things.findAll(),
      Purchases.findAll(),
    ]);
    res.send(html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>acme test</title>
          <link href="main.css" rel="stylesheet" />
        </head>
        <body>
          <h1>People, Places, and Things w/Dates!</h1>
          <div class="box">
            <div class="left-col">
              <h2>People (${peoplepop.length})</h2>
              <ul>
                ${peoplepop.map((ppl) => html`<li>${ppl.name}</li>`)}
              </ul>
              <h2>Places (${placespop.length})</h2>
              <ul>
                ${placespop.map((elem) => html`<li>${elem.name}</li>`)}
              </ul>
              <h2>Things (${thingspop.length})</h2>
              <ul>
                ${thingspop.map((elem) => html`<li>${elem.name}</li>`)}
              </ul>
            </div>
            <div class="right-col">
              <p>Form below</p>
              <form method="POST" action="/purchases?_method=PUT">
                <select name="people">
                  ${peoplepop.map((ppl) => html`<option>${ppl.name}</option>`)}
                </select>
                <select name="place">
                  ${placespop.map(
                    (elem) => html`<option>${elem.name}</option>`
                  )}
                </select>
                <select name="thing">
                  ${thingspop.map(
                    (elem) => html`<option>${elem.name}</option>`
                  )}
                </select>
                <input type="text" name="count" />
                <input type="date" name="date" />
                <button>Create Purchase</button>
                <div class="purchases">
                  <ul>
                    ${purchasespop.map(
                      (purchase) =>
                        html`<li>
                          ${purchase.people} purchased ${purchase.count} in
                          ${purchase.place} on ${purchase.date}
                        </li>`
                    )}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (ex) {
    next(ex);
  }
});

app.put('/purchases', async (req, res, next) => {
  //   console.log(req.body);
  const data = req.body;
  //   console.log(data.people);

  try {
    const newpurch = await Purchases.create({
      people: data.people,
      count: data.count,
      place: data.place,
      thing: data.thing,
      date: data.date,
    });
  } catch (ex) {
    next(ex);
  }

  res.redirect('/');
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
  console.log('ready');
};

init();
