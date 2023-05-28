const User = require("../../model/user.js");

module.exports = {
    commandInfo: {
        name: "change-email",
        description: "Change your email.",
        options: [
            {
                name: "email",
                description: "Your new email.",
                required: true,
                type: 3 // string
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true });

        let accessToken = global.accessTokens.find(i => i.accountId == user.accountId);
        if (accessToken) return interaction.editReply({ content: "Failed to change email as you are currently logged in to Fortnite.\nRun the /sign-out-of-all-sessions command to sign out.", ephemeral: true });

        const { options } = interaction;

        let email = options.get("email").value;

		const pattern = /\w*@\./;
		if (!pattern.test(email))
			return interaction.editReply({ content: "Invalid pattern.", ephemeral: true });
        try {
            await user.updateOne({ $set: { email: email } });
        } catch {
            return interaction.editReply({ content: "This email is already in use!", ephemeral: true });
        }

        interaction.editReply({ content: `Successfully changed your email to ${email}`, ephemeral: true });
    }
}