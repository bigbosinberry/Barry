const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Initialize the bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
const cooldowns = new Map(); // Cooldowns map

// Load commands dynamically
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Database setup
const db = new sqlite3.Database('./database/xp.db');
db.run("CREATE TABLE IF NOT EXISTS users (id TEXT, xp INTEGER, level INTEGER)");

// When the bot is ready
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);

    client.user.setPresence({
        status: 'idle', // Options: 'online', 'idle', 'dnd', 'invisible'
        activities: [
            {
                name: 'Computing Artificial Intelligence',
                type: 'PLAYING', // Options: 'PLAYING', 'LISTENING', 'WATCHING', 'STREAMING'
            },
        ],
    });
});

// Listen for messages
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    // Grant XP
    db.get("SELECT * FROM users WHERE id = ?", [message.author.id], (err, row) => {
        if (!row) {
            db.run("INSERT INTO users (id, xp, level) VALUES (?, ?, ?)", [message.author.id, 1, 1]);
        } else {
            let newXP = row.xp + 1;
            let newLevel = row.level;

            if (newXP >= row.level * 10) {
                newLevel++;
                newXP = 0;
                message.reply(`🎉 You leveled up to **Level ${newLevel}**!`);
            }

            db.run("UPDATE users SET xp = ?, level = ? WHERE id = ?", [newXP, newLevel, message.author.id]);
        }
    });

    // Command handling
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    // Cooldown logic
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000; // Default cooldown is 3 seconds

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
            return message.reply(`⏳ Please wait ${timeLeft} more seconds before using \`${command.name}\` again.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Execute the command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

// Log the bot into Discord
client.login(token);
