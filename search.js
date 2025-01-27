const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'search',
    description: 'Search for a world event and display information.',
    async execute(message, args) {
        // Ensure the user provides input
        if (!args.length) {
            return message.reply('Please provide a search term. Example: `!search World War II`');
        }

        const query = args.join(' '); // Combine the arguments into a single query string

        // Mock data or API call (replace this with actual data fetching logic)
        const eventInfo = getWorldEventInfo(query);

        if (!eventInfo) {
            return message.reply(`No results found for "${query}".`);
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Embed color
            .setTitle(eventInfo.title)
            .setDescription(eventInfo.description)
            .addFields(
                { name: 'Date', value: eventInfo.date, inline: true },
                { name: 'Significance', value: eventInfo.significance, inline: true }
            )
            .setThumbnail(eventInfo.thumbnail)
            .setFooter({ text: 'Powered by YourBot', iconURL: message.client.user.displayAvatarURL() });

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};

// Mock function to simulate searching for world event data
function getWorldEventInfo(query) {
    const mockDatabase = [
        {
            title: 'World War II',
            description: 'A global war that lasted from 1939 to 1945, involving most of the world’s nations.',
            date: '1939–1945',
            significance: 'Shaped the modern world order.',
            thumbnail: 'https://example.com/ww2-image.png',
        },
        {
            title: 'Moon Landing',
            description: 'Apollo 11 was the spaceflight that first landed humans on the Moon.',
            date: 'July 20, 1969',
            significance: 'First human moon landing.',
            thumbnail: 'https://example.com/moon-landing.png',
        },
    ];

    // Search the mock database
    return mockDatabase.find((event) =>
        event.title.toLowerCase().includes(query.toLowerCase())
    );
}
