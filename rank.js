module.exports = {
    name: 'rank',
    description: 'Check your rank and XP.',
    cooldown: 5, // 5-second cooldown
    execute(message) {
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database('./database/xp.db');
        db.get("SELECT * FROM users WHERE id = ?", [message.author.id], (err, row) => {
            if (row) {
                message.reply(`🌟 You are Level ${row.level} with ${row.xp} XP.`);
            } else {
                message.reply("You haven't gained any XP yet!");
            }
        });
        db.close();
    },
};
