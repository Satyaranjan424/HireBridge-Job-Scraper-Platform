export function BarChart({ title, data }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <section className="panel chart-panel">
      <h3>{title}</h3>
      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-row" key={item.label}>
            <span>{item.label}</span>
            <div><i style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} /></div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DonutChart({ title, data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const segments = data.reduce((items, item) => {
    const dash = (item.value / total) * 100;
    const previousOffset = items.length ? items[items.length - 1].nextOffset : 25;
    return [...items, { ...item, dash, offset: previousOffset, nextOffset: previousOffset - dash }];
  }, []);

  return (
    <section className="panel chart-panel">
      <h3>{title}</h3>
      <div className="donut-wrap">
        <svg className="donut" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="15.9" />
          {segments.map((item) => <circle key={item.label} className={item.tone} cx="21" cy="21" r="15.9" strokeDasharray={`${item.dash} ${100 - item.dash}`} strokeDashoffset={item.offset} />)}
        </svg>
        <div className="chart-legend">
          {data.map((item) => <span key={item.label}><i className={item.tone} />{item.label}: {item.value}</span>)}
        </div>
      </div>
    </section>
  );
}
