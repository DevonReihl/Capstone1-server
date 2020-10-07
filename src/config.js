module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DATABASE_URL: process.env.Database_url || 'postgresql://Devon@localhost/gish_literacy_bandits', 
  TEST_DATABASE_URL: process.envTEST_DATABASE_URL || 'postgresql://Devon@localhost/gish_literacy_bandits-test'
}