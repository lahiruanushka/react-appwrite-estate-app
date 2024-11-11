export function createUsername(fullName) {
  // Split the full name into an array of words
  const nameParts = fullName.trim().split(" ");
  
  // Get the first initial and the last name
  const firstInitial = nameParts[0]?.charAt(0).toLowerCase() || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].toLowerCase() : "";

  // Combine to create base username
  let username = firstInitial + lastName;

  // Remove any special characters from the username
  username = username.replace(/[^a-z0-9]/g, "");

  // Add a random 4-digit number at the end
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
  username += randomNum;

  return username;
}
