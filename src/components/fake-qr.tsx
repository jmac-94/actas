// QR de ejemplo (visual, no funcional) generado de forma determinista.
export function FakeQR({ size = 160 }: { size?: number }) {
  const cells = 21;
  const cell = size / cells;
  const rng = (i: number) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x) > 0.5;
  };
  const finder = (cx: number, cy: number) => (
    <g key={`f-${cx}-${cy}`}>
      <rect x={cx * cell} y={cy * cell} width={cell * 7} height={cell * 7} fill="currentColor" />
      <rect x={(cx + 1) * cell} y={(cy + 1) * cell} width={cell * 5} height={cell * 5} fill="white" />
      <rect x={(cx + 2) * cell} y={(cy + 2) * cell} width={cell * 3} height={cell * 3} fill="currentColor" />
    </g>
  );
  const inFinder = (r: number, c: number) =>
    (r < 8 && c < 8) || (r < 8 && c > cells - 9) || (r > cells - 9 && c < 8);

  const dots = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if (inFinder(r, c)) continue;
      if (rng(r * cells + c))
        dots.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="currentColor" />);
    }
  }

  return (
    <div className="rounded-xl bg-white p-3 text-primary shadow-inner">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {dots}
        {finder(0, 0)}
        {finder(cells - 7, 0)}
        {finder(0, cells - 7)}
      </svg>
    </div>
  );
}
