import { Strategy as TelegramStrategy } from "passport-telegram-official";

//TELEGRAM STRATEGY
// Configure the Telegram strategy
const telegramStrategy = new TelegramStrategy(
  {
    botToken: "BOT_TOKEN",
  },
  function (profile, cb) {
    User.findOrCreate({ telegramId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
);

export default telegramStrategy;
