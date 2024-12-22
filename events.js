import axios from 'axios';
import inquirer from 'inquirer';

/*
Funktionen displayEvents() hämtar alla events från databasen och visar dem för användaren.
Med map() skapas en ny array med val av alla tillgängliga events för användaren att välja mellan.
Användaren kan välja ett event och med push() så får användaren alternativet att kunna gå tillbaka till huvudmenyn.
*/

export const displayEvents = async () => {
	try {
		const events = await (async () => {
			try {
				const response = await axios.get(
					'http://localhost:5000/api/events/public'
				);
				return response.data;
			} catch (error) {
				throw new Error(`Error fetching events: ${error.message}`);
			}
		})();

		const eventChoices = events.map((event, index) => ({
			name: `${event.title} - ${event.location}`,
			value: index,
		}));

		eventChoices.push({ name: 'Tillbaka till huvudmenyn', value: 'back' });

		const { selectedEvent } = await inquirer.prompt([
			{
				type: 'list',
				name: 'selectedEvent',
				message: 'Välj ett event:',
				choices: eventChoices,
			},
		]);

		if (selectedEvent === 'back') {
			return;
		}

		const event = events[selectedEvent];
		console.log(`\nEvent Details:`);
		console.log(`Title: ${event.title}`);
		console.log(`Location: ${event.location}`);
		console.log(`Date: ${event.date}`);
		console.log(`Description: ${event.description}\n`);
	} catch (error) {
		console.error('Error:', error.message);
	}
};
