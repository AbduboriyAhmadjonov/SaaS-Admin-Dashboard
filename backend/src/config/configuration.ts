export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI!,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION!,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION!,
    jwtConstants: process.env.JWT_CONSTANTS!,
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS!),
  },
});
