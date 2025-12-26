export default function AGLogo({ size = 46 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="bg-white rounded-lg flex items-center justify-center shadow-sm"
    >
      <span className="text-[#003646] font-bold text-xl leading-none">
        AG
      </span>
    </div>
  );
}
