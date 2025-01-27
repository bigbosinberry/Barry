const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: 'leaderboard',
    description: 'Show the top 5 users by XP.',
    execute(message) {
        const db = new sqlite3.Database('./database/xp.db');
        db.all("SELECT * FROM users ORDER BY xp DESC LIMIT 5", (err, rows) => {
            if (rows.length) {
                const leaderboard = rows
                    .map((user, index) => `${index + 1}. <@${user.id}> - Level ${user.level}, ${user.xp} XP`)
                    .join('\n');
                message.channel.send(`🏆 **Leaderboard**:\n${leaderboard}`);
            } else {
                message.channel.send("No data available yet.");
            }
        });
        db.close();
    },
};
