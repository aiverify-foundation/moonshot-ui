export function FormStateErrorList({
  formErrors,
}: {
  formErrors: Record<string, string[]>;
}) {
  return (
    <ul className="list-disc pl-4 text-[0.9rem]">
      {Object.entries(formErrors).map(([key, value]) => (
        <li
          key={key}
          className="flex gap-2">
          <span className="font-bold">{key}:</span>
          <span>{value.join(', ')}</span>
        </li>
      ))}
    </ul>
  );
}
