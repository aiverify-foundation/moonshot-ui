// export const chatWindowWidth = 400;
// export const chatWindowHeight = 450;
// export const chatWindowGap = 20;

export function getChatWindowDimensions() {
  // Default values
  let chatWindowWidth = 400;
  let chatWindowHeight = 450;
  let chatWindowGap = 20;

  // Media query for large screens (e.g., more than 1180px)
  if (window.matchMedia('(min-width: 1180px)').matches) {
    chatWindowWidth = 300; // Smaller width for small screens
    chatWindowHeight = 350; // Smaller height for small screens
    chatWindowGap = 15; // Smaller gap for small screens
  }

  // Media query for medium screens (e.g., less than 992px)
  if (window.matchMedia('(max-width: 992px)').matches) {
    chatWindowWidth = 300; // Smaller width for small screens
    chatWindowHeight = 350; // Smaller height for small screens
    chatWindowGap = 15; // Smaller gap for small screens
  }

  // Media query for small screens (e.g., less than 768px)
  if (window.matchMedia('(max-width: 768px)').matches) {
    chatWindowWidth = 300; // Smaller width for small screens
    chatWindowHeight = 350; // Smaller height for small screens
    chatWindowGap = 15; // Smaller gap for small screens
  }

  // Media query for very small screens (e.g., less than 480px)
  if (window.matchMedia('(max-width: 480px)').matches) {
    chatWindowWidth = 280; // Even smaller width for very small screens
    chatWindowHeight = 300; // Even smaller height for very small screens
    chatWindowGap = 10; // Even smaller gap for very small screens
  }

  // Return updated values
  return { chatWindowWidth, chatWindowHeight, chatWindowGap };
}
