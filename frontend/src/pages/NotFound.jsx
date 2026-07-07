import { navigate } from '../routes/router';

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <button className="primary" onClick={() => navigate('/')}>Go home</button>
    </main>
  );
}
