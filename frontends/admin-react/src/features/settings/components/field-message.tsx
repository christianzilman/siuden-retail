

export function FieldMessage({ message }: { message?: string }) {
  return message ? (
    <p className="text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  ) : null;
}
