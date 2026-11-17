# Interactions and motion

- Button hover: 120 ms ease-out; pressed 80 ms.
- Menu/dialog: 160 ms opacity + 4 px translate; ease-out.
- Sidebar collapse: 180 ms width; no content reflow animation beyond panel.
- Artifact sheet: 220 ms slide; respect reduced motion.
- Focus: 2 px accent ring, 2 px offset.
- Loading: small rotating/opacity indicator; no fake percentage or stage-by-stage progress.
- Toast: 180 ms enter, 160 ms exit; auto-dismiss 4.5 s; persistent for critical errors.
- Reduced motion: disable transforms/shimmer/ambient animation; preserve state feedback.

Keyboard interactions: Cmd/Ctrl+K palette; Cmd/Ctrl+N new task; Escape closes topmost overlay; Enter sends; Shift+Enter newline. Ensure IME composition does not trigger send and focus is restored to invoking control after dialogs close.
