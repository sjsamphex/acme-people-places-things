const Sequelize = require('sequelize');
const { INTEGER, STRING, DATE } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://localhost/acme_people_places_things_db'
);

const People = conn.define('people', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Places = conn.define('places', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Things = conn.define('things', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Purchases = conn.define('purchases', {
  people: {
    type: STRING,
  },
  place: {
    type: STRING,
  },
  thing: {
    type: STRING,
  },
  count: {
    type: INTEGER,
  },
  date: {
    type: DATE,
  },
});

//to figure out relationships...
// Department.belongsTo(User);
// User.hasMany(Department);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [lucy, moe, larry] = await Promise.all(
    ['lucy', 'moe', 'larry'].map((name) => People.create({ name }))
  );

  const [NYC, chicago, LA, Dallas] = await Promise.all(
    ['NYC', 'Chicago', 'LA', 'Dallas'].map((name) => Places.create({ name }))
  );

  const [foo, bar, bazz, quq] = await Promise.all(
    ['foo', 'bar', 'bazz', 'quq'].map((name) => Things.create({ name }))
  );

  const purch1 = await Purchases.create({
    people: 'moe',
    count: 3,
    place: 'LA',
    thing: 'foo',
    date: '10/31/2020',
  });
  const purch2 = await Purchases.create({
    people: 'larry',
    count: 1,
    place: 'Chicago',
    thing: 'bar',
    date: '11/6/2020',
  });

  const purch3 = await Purchases.create({
    people: 'lucy',
    count: 11,
    place: 'Chicago',
    thing: 'bazz',
    date: '3/15/2020',
  });

  // [{name: 'moe', count: 3, place: 'LA', }].map((name) => Purchases.create({ things }))
};

module.exports = {
  syncAndSeed,
  models: {
    People,
    Places,
    Things,
    Purchases,
  },
};
