#!/usr/bin/env node

import inquirer from 'inquirer';
import { displayEvents } from './events.js';
import { registerParticipant, unregisterParticipant } from './participants.js';
import { handleError } from './handleError.js';

/*
Huvudmenyn för CLI-appen. Användaren kan välja att visa events, registrera deltagare till eventerna, ta bort deltagare från eventer eller avsluta CLIn.
Ett valt alternativ startar funktionen som är bunden till valet menyn. Dessa funktioner är i events.js eller participants.js.
När kallad funktion är färdig, anropas mainMenu() i slutet av koden för att visa huvudmenyn igen.
*/

const mainMenu = async () => {
	try {
		const mainChoices = [
			{ name: 'Lista ut eventer', value: 'viewEvents' },
			{ name: 'Registrera deltagare till Event', value: 'registerParticipant' },
			{ name: 'Ta bort en deltagare', value: 'unregisterParticipant' },
			{ name: 'Avsluta', value: 'quit' },
		];

		const { action } = await inquirer.prompt([
			{
				type: 'list',
				name: 'action',
				message: 'Välkommen: Vad vill du göra?',
				choices: mainChoices,
			},
		]);

		if (action === 'quit') {
			return;
		}

		if (action === 'viewEvents') {
			await displayEvents();
		} else if (action === 'registerParticipant') {
			await registerParticipant();
		} else if (action === 'unregisterParticipant') {
			await unregisterParticipant();
		}

		await mainMenu();
	} catch (error) {
		handleError('mainMenu', error);
	}
};

mainMenu();
