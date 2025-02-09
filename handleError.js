export const handleError = (context, error) => {
	const errorMessage = error.response?.data || error.message || error;
	console.error(`Error in ${context}:`, errorMessage);
};
