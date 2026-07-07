const paths = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  briefcase: 'M9 6V4h6v2h5v14H4V6h5zm2 0h2V5h-2v1zM4 11h16',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  save: 'M5 4h14v17l-7-4-7 4V4z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  users: 'M16 11a4 4 0 10-3.5-6M12 12a4 4 0 100-8 4 4 0 000 8zM3 21a8 8 0 0116 0M17 21a6 6 0 00-3-5.2',
  search: 'M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM16 16l5 5',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 00-1.8-1L14.4 3h-4.8L9.2 6a7 7 0 00-1.8 1L5 6 3 9.5 5 11a7 7 0 000 2l-2 1.5L5 18l2.4-1a7 7 0 001.8 1l.4 3h4.8l.4-3a7 7 0 001.8-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1z',
  shield: 'M12 3l8 4v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4z',
  logout: 'M10 17l5-5-5-5M15 12H3M21 3v18h-8',
  menu: 'M4 6h16M4 12h16M4 18h16',
};

export default function Icon({ name, label }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden={label ? undefined : true} aria-label={label}>
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
