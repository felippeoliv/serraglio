// Shared data store for the application
// In production, this would be replaced with a real database

// Authorized emails (users who purchased access)
export const authorizedEmails = new Set([
  "felpsrdz@gmail.com",
  "dvncopy@gmail.com",
  "teste@email.com",
  "exemplo@gmail.com",
]);

// Completed forms storage
export const completedForms = new Map<string, any>();
