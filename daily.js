const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: 'daily',
    description: 'Claim your daily XP bonus.',
    cooldown: 86400, // 24-hour cooldown
    execute(message) {
        const db = new sqlite3.Database('./database/xp.db');
        db.get("SELECT * FROM users WHERE id = ?", [message.author.id], (err, row) => {
            if (err) throw err;

            if (row) {
                const bonusXP = 50;
                const newXP = row.xp + bonusXP;
                db.run("UPDATE users SET xp = ? WHERE id = ?", [newXP, message.author.id], (err) => {
                    if (err) throw err;
                    message.reply(`🎁 You claimed your daily bonus of ${bonusXP} XP!`);
                });
            } else {
                db.run("INSERT INTO users (id, xp, level) VALUES (?, ?, ?)", [message.author.id, 50, 1], (err) => {
                    if (err) throw err;
                    message.reply("🎁 You claimed your daily bonus of 50 XP!");
                });
            }
        });
        db.close();
    },
};
