/** Decorative illustration for the login hero panel. */
export default function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 420 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      role="img"
      aria-label="Illustration of people connecting through a membership card"
    >
      <ellipse
        cx="210"
        cy="267"
        rx="174"
        ry="15"
        fill="#0D3029"
      />
    
      <circle
        cx="210"
        cy="124"
        r="105"
        fill="#D5E6D7"
        fillOpacity=".08"
      />
      <circle
        cx="210"
        cy="124"
        r="78"
        stroke="#D5E6D7"
        strokeOpacity=".2"
        strokeDasharray="5 8"
      />
    
      {/* Membership card */}
      <rect
        x="107"
        y="75"
        width="206"
        height="137"
        rx="17"
        fill="#F6F5EF"
        transform="rotate(-7 107 75)"
      />
      <rect
        x="126"
        y="98"
        width="42"
        height="42"
        rx="12"
        fill="#D5E6D7"
      />
      <path
        d="M139 120L146 127L157 111"
        stroke="#173F35"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="179"
        y="103"
        width="91"
        height="8"
        rx="4"
        fill="#173F35"
      />
      <rect
        x="179"
        y="119"
        width="65"
        height="5"
        rx="2.5"
        fill="#A6B7A9"
      />
      <rect
        x="126"
        y="158"
        width="139"
        height="6"
        rx="3"
        fill="#D8DED6"
      />
      <rect
        x="126"
        y="171"
        width="93"
        height="6"
        rx="3"
        fill="#D8DED6"
      />
      <circle
        cx="280"
        cy="181"
        r="12"
        fill="#D8A66C"
      />
    
      {/* Person on left */}
      <circle
        cx="74"
        cy="156"
        r="19"
        fill="#D8A66C"
      />
      <path
        d="M54 155C54 130 91 126 94 154L88 149L57 161Z"
        fill="#302D29"
      />
      <path
        d="M45 238C45 199 52 177 74 177C98 177 108 203 108 238"
        fill="#D8A66C"
      />
      <path
        d="M45 238C45 204 55 188 74 188C93 188 105 209 105 238"
        fill="#D5E6D7"
      />
      <path
        d="M101 206L132 186"
        stroke="#D8A66C"
        strokeWidth="12"
        strokeLinecap="round"
      />
    
      {/* Person on right */}
      <circle
        cx="345"
        cy="153"
        r="19"
        fill="#B77E5D"
      />
      <path
        d="M325 153C325 126 364 128 365 151L359 142L329 160Z"
        fill="#252C27"
      />
      <path
        d="M311 238C312 197 325 178 346 178C371 178 380 207 381 238"
        fill="#A9C6AD"
      />
      <path
        d="M317 202L287 184"
        stroke="#B77E5D"
        strokeWidth="12"
        strokeLinecap="round"
      />
    
      {/* Decorative stars */}
      <path
        d="M67 76L71 87L82 91L71 95L67 106L63 95L52 91L63 87L67 76Z"
        fill="#D8A66C"
      />
      <path
        d="M348 65L351 73L359 76L351 79L348 87L345 79L337 76L345 73L348 65Z"
        fill="#D5E6D7"
      />
      <circle
        cx="100"
        cy="105"
        r="4"
        fill="#D5E6D7"
      />
      <circle
        cx="323"
        cy="109"
        r="4"
        fill="#D8A66C"
      />
    </svg>
  );
}
