import { getWindowId } from '@/app/lib/window-utils';
import { updateWindows, useAppDispatch, useAppSelector } from '@/lib/redux';

type ChatboxesPositionsUtils = {
  resetChatboxPositions: (overrideCachedPositions?: boolean) => void;
};

export default function useChatboxesPositionsUtils(
  chatSession: SessionData
): ChatboxesPositionsUtils {
  const windowsMap = useAppSelector((state) => state.windows.map);
  const dispatch = useAppDispatch();
  let chatboxesMap: Record<string, WindowData> | null = null;

  function calculateChatboxPositions(
    overrideCachedPositions = false
  ): Record<string, WindowData> | null {
    if (!chatSession.session.endpoints.length) return chatboxesMap;

    chatboxesMap = {};
    const numberOfChats = chatSession.session.endpoints.length;
    const viewportWidth = window.innerWidth; // Get the viewport width
    const margin = 20; // Left and right margin
    const adjustedViewportWidth = viewportWidth - margin * 2; // Adjust viewport width for margins
    const chatBoxWidth = 400; // Fixed width for each ChatBox
    const chatBoxHeight = 450; // Fixed height for each ChatBox
    const spacing =
      (adjustedViewportWidth - chatBoxWidth) / Math.max(numberOfChats - 1, 1); // Calculate spacing, avoid division by zero

    //These 3 are for layout calculation where number of chats is 4 or less
    //Centralize them side by side
    const gap = 10; // Gap between ChatBoxes
    const totalWidthNeeded =
      chatBoxWidth * numberOfChats + gap * (numberOfChats - 1); // Total width needed for all ChatBoxes and gaps
    const startX = (adjustedViewportWidth - totalWidthNeeded) / 2 + margin; // Calculate starting X position for centralization
    chatSession.session.endpoints.forEach((id, index) => {
      if (windowsMap[getWindowId(id)] && !overrideCachedPositions) return; // if window has size and position in application state from previous launch, skip setting defaults

      let xyPos: [number, number] = [0, 0];
      const xpos =
        numberOfChats > 4
          ? index * spacing + margin // Calculate x position for even spread (more than 4 chats)
          : startX + index * (chatBoxWidth + gap); // Calculate x position for centralization (4 or less chats)
      const ypos = index % 2 === 0 ? 150 : 200; // Alternate y position
      xyPos = [xpos, ypos];
      if (chatboxesMap) {
        chatboxesMap[getWindowId(id)] = [
          ...xyPos,
          chatBoxWidth,
          chatBoxHeight,
          0,
        ];
      }
    });

    return chatboxesMap;
  }

  function resetChatboxPositions(overrideCachedPositions = false) {
    const defaults = calculateChatboxPositions(overrideCachedPositions);
    if (defaults) {
      dispatch(updateWindows(defaults));
    }
  }

  return { resetChatboxPositions };
}
