interface FileInputButtonProps {
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onFiles: (files: FileList | null) => void;
  children: React.ReactNode;
}

/** A styled label wrapping a hidden file input; resets so the same file can be re-picked. */
export default function FileInputButton({
  accept,
  multiple,
  disabled,
  icon,
  onFiles,
  children,
}: FileInputButtonProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-brand focus-within:ring-2 focus-within:ring-brand-accent/30 hover:bg-canvas has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
      {icon}
      {children}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          onFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}
