export default function EmptyState({ title, text }) {
  return (
    <section className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </section>
  );
}
