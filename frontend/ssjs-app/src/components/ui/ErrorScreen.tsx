import Button from "./Button";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
  icon?: React.ReactNode;
}

export default function ErrorScreen({ message, onRetry, icon }: ErrorScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {icon}
        <p role="alert" className={icon ? "mt-4 text-sm text-red-600" : "text-red-600"}>
          {message}
        </p>
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </main>
  );
}
