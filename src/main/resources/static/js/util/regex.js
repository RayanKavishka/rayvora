// Validation regex
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidContact = (contact) => /^07[0-9]{8}$/.test(contact);


export {isValidContact, isValidEmail};