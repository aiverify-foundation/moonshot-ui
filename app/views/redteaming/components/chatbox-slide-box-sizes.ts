export function getDefaultChatBoxSizes() {
  // IMPORTANT: Also align the values of --chatwindow-width and --gap-width css variables in global.css

  // Default values
  let width = 400;
  let height = 550;
  let gap = 16;

  // Media query for large screens (e.g., more than 1180px)
  if (window.matchMedia('(min-width: 1180px)').matches) {
    width = 400; // Smaller width for small screens
    height = 500; // Smaller height for small screens
    gap = 16; // Smaller gap for small screens
  }

  // Media query for medium screens (e.g., less than 992px)
  if (window.matchMedia('(max-width: 992px)').matches) {
    width = 400; // Smaller width for small screens
    height = 450; // Smaller height for small screens
    gap = 15; // Smaller gap for small screens
  }

  // Media query for small screens (e.g., less than 768px)
  if (window.matchMedia('(max-width: 768px)').matches) {
    width = 300; // Smaller width for small screens
    height = 350; // Smaller height for small screens
    gap = 15; // Smaller gap for small screens
  }

  // Media query for very small screens (e.g., less than 480px)
  if (window.matchMedia('(max-width: 480px)').matches) {
    width = 280; // Even smaller width for very small screens
    height = 300; // Even smaller height for very small screens
    gap = 10; // Even smaller gap for very small screens
  }

  // Return updated values
  return { width, height, gap };
}
