'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <h1>An error occurred</h1>
      <p>{error.message}</p>
    </div>
  );
}