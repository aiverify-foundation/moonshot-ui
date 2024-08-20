export type SlideChatBoxDimensions = {
  width: number;
  height: number;
  gap: number;
};

export function getDefaultChatBoxSizes() {
  // IMPORTANT: Also align the values of --chatwindow-width and --gap-width css variables in global.css

  // Default values
  let width = 420;
  let height = 550;
  let gap = 16;

  if (typeof window === 'undefined') {
    return { width: 0, height: 0, gap: 0 };
  }

  // Media query for large screens (e.g., more than 1180px)
  if (window.matchMedia('(min-width: 1180px)').matches) {
    console.log('1180px');
    width = 420; // Smaller width for small screens
    height = 500; // Smaller height for small screens
    gap = 50; // Smaller gap for small screens
  }

  // Media query for medium screens (e.g., less than 992px)
  if (window.matchMedia('(max-width: 992px)').matches) {
    console.log('992px');
    width = 420; // Smaller width for small screens
    height = 450; // Smaller height for small screens
    gap = 15; // Smaller gap for small screens
  }

  // Media query for small screens (e.g., less than 768px)
  if (window.matchMedia('(max-width: 768px)').matches) {
    console.log('768px');
    width = 300; // Smaller width for small screens
    height = 350; // Smaller height for small screens
    gap = 15; // Smaller gap for small screens
  }

  // Media query for very small screens (e.g., less than 480px)
  if (window.matchMedia('(max-width: 480px)').matches) {
    console.log('480px');
    width = 280; // Even smaller width for very small screens
    height = 300; // Even smaller height for very small screens
    gap = 10; // Even smaller gap for very small screens
  }

  // Return updated values
  return { width, height, gap };
}
