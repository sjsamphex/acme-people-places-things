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
    allowNull: false,
    unique: true,
  },
  place: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  thing: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  count: {
    type: INTEGER,
    allowNull: false,
  },
  date: {
    type: DATE,
    allowNull: false,
    unique: true,
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

  // const [foo, bar, bazz, quq] = await Promise.all(
  //   ['foo', 'bar', 'bazz', 'quq'].map((name) => Purchases.create({ things }))
  // );
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
