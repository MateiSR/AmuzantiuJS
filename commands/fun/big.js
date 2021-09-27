module.exports = {
    name: "big",
    description: "turns text into big text",
    async execute(message, args) {
        if (!args.length) return;
        reply = "";
        const latinCheck = /[a-zA-Z]/;
        digits = {
            "0": "zero",
            "1": "one",
            "2": "two",
            "3": "three",
            "4": "four",
            "5": "five",
            "6": "six",
            "7": "seven",
            "8": "eight",
            "9": "nine"
        };
        for (word of args) {
            for (character of word) {
                character = character.toLowerCase();
                // Check if digit
                if (Object.keys(digits).includes(character)) {
                    reply += `:${digits[character]}:`;
                    continue;
                }
                // Else add character
                if (latinCheck.test(character)) reply += `:regional_indicator_${character}:`;
            }
            // Add whitespaces
            reply += "   ";
        }
        await message.channel.send(reply);
    }
}