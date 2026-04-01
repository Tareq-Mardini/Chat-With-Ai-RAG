export default function MainContent({ children }) {
  return (
    <main className="main-content">
      <div className="welcome-card">{children}</div>
    </main>
  );
}
