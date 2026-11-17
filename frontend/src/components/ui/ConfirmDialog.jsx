import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-lg border flex-shrink-0 ${
            variant === "danger"
              ? "bg-[var(--forge-red)]/15 border-[var(--forge-red)]/30 text-[var(--forge-red)]"
              : "bg-[var(--forge-amber)]/15 border-[var(--forge-amber)]/30 text-[var(--forge-amber)]"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--forge-text)]">
            {title}
          </h4>
          <p className="text-xs text-[var(--forge-text-secondary)] mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-[var(--forge-border)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
