/** @format */

export default function ColorPalette(props) {
  const color = "var(--" + props.color + ")";
  return (
    <div
      className="w-12 h-12 rounded-sm m-12"
      style={{ backgroundColor: color }}
    ></div>
  );
}
