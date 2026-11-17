# Conversation

Conversation is a state within Main Workspace, not a separate page template. Preserve message chronology and roles. User messages align right only subtly; assistant content is left aligned with compact agent/source metadata only when returned by backend. Markdown/GFM, syntax highlighting and image lightbox remain. Provide Copy message / Copy code / image expand only when supported. Do not invent citations, tool logs, agent attribution or timestamps absent from stored message schema.

**Composer:** selected mode selector, textarea, attach file, mic when SpeechRecognition exists, send. Single-file input; accepted file types should follow backend Multer config. Show filename, size and remove action before send. Disable duplicate submission while typing state is true.

**Errors:** show request failure separately from assistant content where possible; do not append raw infrastructure stack traces.
