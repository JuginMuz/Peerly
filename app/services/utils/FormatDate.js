// utils/formatDate.js

// Export a function called formatDate that takes a date string as input.
module.exports = function formatDate(dateString) {
  // If no date string is provided, return "N/A" as a placeholder.
  if (!dateString) return "N/A";
  
  // Create a new Date object using the provided date string.
  const date = new Date(dateString);
  
  // Convert the Date object to a localized string in "en-US" format.
  // The options specify that the output should include the full year,
  // the full month name, and the numeric day.
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
