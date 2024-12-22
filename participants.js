import axios from 'axios';
import inquirer from 'inquirer';

/*
Funktionen registerParticipant() används för att registrera en deltagare till ett event.
Alla användare och events hämtas från databasen 
Först listar man ut användarna som val i en lista med map().
När man valt en användare, visas alla events som val i en lista.
När man valt ett event, skapas en ny deltagarregistrering genom en POST-anrop till API:et.

Det är userid och eventid som skickas i POST-anropet.
*/

export const registerParticipant = async () => {
	try {
		const usersResponse = await axios.get('http://localhost:5000/api/users');
		const users = usersResponse.data;

		const userChoices = users.map((user) => ({
			name: user.name,
			value: user._id,
		}));

		const { userId } = await inquirer.prompt([
			{
				type: 'list',
				name: 'userId',
				message: 'Välj en användare att registrera:',
				choices: userChoices,
			},
		]);

		const eventsResponse = await axios.get(
			'http://localhost:5000/api/events/public'
		);
		const events = eventsResponse.data;

		const eventChoices = events.map((event) => ({
			name: event.title,
			value: event._id,
		}));

		const { eventId } = await inquirer.prompt([
			{
				type: 'list',
				name: 'eventId',
				message: 'Välj ett event:',
				choices: eventChoices,
			},
		]);

		const response = await axios.post(
			'http://localhost:5000/api/participants/',
			{
				userId,
				eventId,
			}
		);

		console.log('Registrerat deltagare:');
	} catch (error) {
		console.error(
			'Error registering participant:',
			error.response?.data || error.message
		);
	}
};

/*
Funktionen unregisterParticipant() tar bort en deltagare från ett event.
När man har valt denna funktion ska man ange ett "participant ID".
Då skickas en DELETE-anrop till API:et för att ta bort deltagaren med det angivna IDt.
Ett meddelande skickas att deltagaren har tagits bort.
*/

export const unregisterParticipant = async () => {
	try {
		const { participantId } = await inquirer.prompt([
			{
				type: 'input',
				name: 'participantId',
				message: 'Skriv in "participant ID" för att ta bort deltagare:',
				validate: (input) => (input ? true : 'Fyll i "participant ID"'),
			},
		]);

		await axios.delete(
			`http://localhost:5000/api/participants/${participantId}`
		);
		console.log('Deltagare bortagen.');
	} catch (error) {
		console.error(
			'Error removing participant:',
			error.response?.data || error.message
		);
	}
};
