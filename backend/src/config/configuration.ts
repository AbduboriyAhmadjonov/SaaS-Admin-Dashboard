export default () => ({
  port: parseInt(process.env.PORT || '8000', 10),
  node_env: process.env.NODE_ENV,
  database: {
    uri: process.env.MONGODB_URI!,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION!,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION!,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS!),
  },
});
