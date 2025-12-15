export const DarkModeIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Dark mode</title>
      <circle cx="8" cy="8" r="7" stroke="currentcolor" stroke-width="2" />
      <mask
        id="mask0_30_293"
        style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="8"
        y="0"
        width="8"
        height="16"
      >
        <rect x="8" width="8" height="16" fill="currentcolor" />
      </mask>
      <g mask="url(#mask0_30_293)">
        <circle cx="8" cy="8" r="7" fill="currentcolor" stroke="currentcolor" />
      </g>
    </svg>
  );
};

export default DarkModeIcon;
