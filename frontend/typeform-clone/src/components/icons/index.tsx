// =============================================================================
// TYPEFORM CLONE — ICON COMPONENTS
// =============================================================================
// Inline SVG components extracted from references/typeform-icons-home/ and
// references/typeform-icons-form/
//
// Where a matching custom SVG was NOT found, lucide-react is used as fallback.
// These are marked with /* ASSUMED_ICON: Replace with custom SVG later */
//
// All icons accept className for sizing/coloring overrides.
// =============================================================================

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 16) => ({
  width: size,
  height: size,
  viewBox: '0 0 16 16',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

// ─── home/svgexport-1 — User/Person icon ─────────────────────────────────────
export function IconUser({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g clipPath="url(#icon-user-clip)" fill="none">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 4c0-2.194 1.806-4 4-4s4 1.806 4 4v3c0 2.195-1.807 3.996-4 3.996S4 9.196 4 7zm4-2.5A2.52 2.52 0 0 0 5.5 4v3A2.517 2.517 0 0 0 8 9.497c1.366 0 2.5-1.133 2.5-2.497V4A2.52 2.52 0 0 0 8 1.5M1.842 9.787a.75.75 0 0 1 1.037.221c.832 1.282 2.502 2.88 5.12 2.88 2.62 0 4.29-1.598 5.122-2.88a.75.75 0 1 1 1.258.817c-.915 1.41-2.755 3.25-5.63 3.528v.897a.75.75 0 0 1-1.5 0v-.897c-2.874-.278-4.713-2.117-5.628-3.528a.75.75 0 0 1 .22-1.038"
        />
      </g>
      <defs>
        <clipPath id="icon-user-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── home/svgexport-5 — Chevron Down ─────────────────────────────────────────
export function IconChevronDown({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.116 10.847a1.25 1.25 0 0 0 1.768 0L12.78 6.95a.75.75 0 0 0-1.06-1.06L8 9.61 4.28 5.89a.75.75 0 0 0-1.06 1.06z"
      />
    </svg>
  );
}

// ─── home/svgexport-6 — Workspaces (grid squares) ───────────────────────────
export function IconWorkspaces({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g clipPath="url(#icon-ws-clip)" fill="none">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 .75a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5h-1.75V6.5a.75.75 0 0 1-1.5 0V4.75H9.5a.75.75 0 0 1 0-1.5h1.75V1.5A.75.75 0 0 1 12 .75M1 2.25C1 1.56 1.56 1 2.25 1h3.5C6.44 1 7 1.56 7 2.25v3.5C7 6.44 6.44 7 5.75 7h-3.5C1.56 7 1 6.44 1 5.75zm1.5.25v3h3v-3zM.75 12a3.25 3.25 0 1 1 6.5 0 3.25 3.25 0 0 1-6.5 0M4 10.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5m5 0C9 9.56 9.56 9 10.25 9h3.5c.69 0 1.25.56 1.25 1.25v3.5c0 .69-.56 1.25-1.25 1.25h-3.5C9.56 15 9 14.44 9 13.75zm1.5.25v3h3v-3z"
        />
      </g>
      <defs>
        <clipPath id="icon-ws-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── home/svgexport-9 — Forms (page layout with sidebar) ────────────────────
export function IconForms({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g clipPath="url(#icon-forms-clip)" fill="none">
        <path
          fill="currentColor"
          d="M14.499 3.75a.25.25 0 0 0-.25-.25h-2.25v9h2.25a.25.25 0 0 0 .25-.25zM6.249 8.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5zm2-2.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5zm-6.75 6.25c0 .138.113.25.25.25h8.75v-9h-8.75a.25.25 0 0 0-.25.25zm14.5 0a1.75 1.75 0 0 1-1.75 1.75h-12.5A1.75 1.75 0 0 1 0 12.25v-8.5c0-.966.783-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75z"
        />
      </g>
      <defs>
        <clipPath id="icon-forms-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── home/svgexport-10 — Contacts (two people) ───────────────────────────────
export function IconContacts({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.242 2.5a1.546 1.546 0 1 0 0 3.092 1.546 1.546 0 0 0 0-3.092M2.196 4.046a3.046 3.046 0 1 1 6.092 0 3.046 3.046 0 0 1-6.092 0M11.5 3.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M9 4.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0m5.49 7.866c-.478-1.988-1.955-2.802-3.258-2.771a.75.75 0 1 1-.035-1.5c1.988-.046 4.103 1.225 4.752 3.92.27 1.125-.674 1.985-1.642 1.985h-1.955a.75.75 0 0 1 0-1.5h1.955a.22.22 0 0 0 .164-.066.1.1 0 0 0 .02-.035.1.1 0 0 0 0-.033M5.242 9.643c-1.53 0-3.207 1.122-3.716 3.686-.007.036 0 .068.03.101.034.038.093.07.167.07H8.76a.22.22 0 0 0 .166-.07c.03-.033.037-.065.03-.101-.508-2.564-2.185-3.686-3.715-3.686m0-1.5c2.353 0 4.56 1.738 5.187 4.894C10.646 14.133 9.747 15 8.76 15H1.723c-.987 0-1.885-.867-1.668-1.963.626-3.156 2.833-4.894 5.187-4.894"
      />
    </svg>
  );
}

// ─── home/svgexport-11 — Integrations (share nodes) ─────────────────────────
export function IconIntegrations({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g fill="currentColor" fillRule="evenodd" clipPath="url(#icon-integr-clip)" clipRule="evenodd">
        <path d="M11.335 10.51a2.5 2.5 0 1 1 1.151 3.534A6.9 6.9 0 0 1 6.814 15.6a.75.75 0 0 1 .256-1.478 5.41 5.41 0 0 0 4.28-1.087 2.5 2.5 0 0 1-.015-2.525m2.665.384a1 1 0 1 0-1 1.733 1 1 0 0 0 1-1.733M2.75 4.304a.75.75 0 0 1 1.146.956l-.046.061a5.41 5.41 0 0 0-1.236 3.942 2.5 2.5 0 1 1-1.468.396A6.92 6.92 0 0 1 2.698 4.36zm.25 6.59a1 1 0 1 0-1 1.733 1 1 0 0 0 1-1.733M8 0a2.5 2.5 0 0 1 2.489 2.71c1.74.71 3.06 2.12 3.685 3.821a.75.75 0 0 1-1.409.518 5.08 5.08 0 0 0-2.842-2.952A2.5 2.5 0 1 1 8 0m0 1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
      </g>
      <defs>
        <clipPath id="icon-integr-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── home/svgexport-12 — AI Spark/Star ───────────────────────────────────────
export function IconSpark({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        d="M12 8a.75.75 0 0 0 .75-.75c0-1.037.23-1.613.559-1.941.328-.33.904-.559 1.941-.559a.75.75 0 0 0 0-1.5c-1.037 0-1.613-.23-1.941-.559-.33-.328-.559-.904-.559-1.941a.75.75 0 0 0-1.5 0c0 1.037-.23 1.613-.559 1.941-.328.33-.904.559-1.941.559a.75.75 0 0 0 0 1.5c1.037 0 1.613.23 1.941.559.33.328.559.904.559 1.941 0 .414.336.75.75.75m1.25 6A1.75 1.75 0 0 0 15 12.25v-3.5a.75.75 0 0 0-1.5 0v3.5a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25v-8.5a.25.25 0 0 1 .25-.25h4.5l.077-.004a.75.75 0 0 0 0-1.492L6.25 2h-4.5A1.75 1.75 0 0 0 0 3.75v8.5C0 13.216.784 14 1.75 14zm-5.5-6.5a.75.75 0 0 0 0-1.5h-4a.75.75 0 0 0 0 1.5zM6.25 10a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 0 0 1.5z"
      />
    </svg>
  );
}

// ─── home/svgexport-13 — Plus ─────────────────────────────────────────────────
export function IconPlus({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2"
      />
    </svg>
  );
}

// ─── home/svgexport-14 — Search (magnifier) ──────────────────────────────────
export function IconSearch({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.219 2.5a4.719 4.719 0 1 0 0 9.438 4.719 4.719 0 0 0 0-9.438M1 7.219a6.219 6.219 0 1 1 11.115 3.835l2.665 2.666a.75.75 0 1 1-1.06 1.06l-2.666-2.665A6.219 6.219 0 0 1 1 7.219"
      />
    </svg>
  );
}

// ─── home/svgexport-8 — Question mark circle ─────────────────────────────────
export function IconHelp({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g clipPath="url(#icon-help-clip)" fill="none">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.081-2.717c-.267.228-.394.496-.394.736a.75.75 0 0 1-1.5 0c0-.78.405-1.436.919-1.876.512-.438 1.197-.721 1.894-.721s1.382.283 1.894.72c.514.44.918 1.096.918 1.877 0 .63-.176 1.12-.477 1.512-.255.334-.585.568-.817.733l-.05.036c-.265.189-.422.313-.533.471-.094.135-.186.34-.186.729a.75.75 0 1 1-1.5 0c0-.66.166-1.175.459-1.591.275-.391.632-.647.884-.827l.003-.002c.282-.202.438-.316.55-.462.086-.111.168-.274.168-.6 0-.24-.127-.507-.394-.735A1.47 1.47 0 0 0 8 4.922c-.304 0-.65.13-.919.36m.918 5.842a.75.75 0 0 1 .75.75v.032a.75.75 0 0 1-1.5 0v-.032a.75.75 0 0 1 .75-.75"
        />
      </g>
      <defs>
        <clipPath id="icon-help-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── form/svgexport-9 — Drag Handle (list with handles) ──────────────────────
export function IconDragHandle({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.75 2A1.75 1.75 0 0 0 5 3.75v1.5C5 6.216 5.784 7 6.75 7h7.5A1.75 1.75 0 0 0 16 5.25v-1.5A1.75 1.75 0 0 0 14.25 2zM6.5 3.75a.25.25 0 0 1 .25-.25h7.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-7.5a.25.25 0 0 1-.25-.25zM6.75 9A1.75 1.75 0 0 0 5 10.75v1.5c0 .966.784 1.75 1.75 1.75h7.5A1.75 1.75 0 0 0 16 12.25v-1.5A1.75 1.75 0 0 0 14.25 9zm-.25 1.75a.25.25 0 0 1 .25-.25h7.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-7.5a.25.25 0 0 1-.25-.25zM.75 3a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 4a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5z"
      />
    </svg>
  );
}

// ─── form/svgexport-11 — Three dots vertical ─────────────────────────────────
export function IconDotsVertical({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m0 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m0 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"
      />
    </svg>
  );
}

// ─── form/svgexport-12 — Short Text (two lines) ──────────────────────────────
export function IconShortText({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 6.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 6.25m0 4a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75"
      />
    </svg>
  );
}

// ─── form/svgexport-13 — Multiple Choice (A= B= lines) ───────────────────────
export function IconMultipleChoice({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <g clipPath="url(#icon-mc-clip)" fill="none">
        <path
          fill="currentColor"
          d="M14.499 3.75a.25.25 0 0 0-.25-.25h-2.25v9h2.25a.25.25 0 0 0 .25-.25zM6.249 8.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5zm2-2.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5zm-6.75 6.25c0 .138.113.25.25.25h8.75v-9h-8.75a.25.25 0 0 0-.25.25zm14.5 0a1.75 1.75 0 0 1-1.75 1.75h-12.5A1.75 1.75 0 0 1 0 12.25v-8.5c0-.966.783-1.75 1.75-1.75h12.5c.966 0 1.75.784 1.75 1.75z"
        />
      </g>
      <defs>
        <clipPath id="icon-mc-clip">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── form/svgexport-6 — Link icon ────────────────────────────────────────────
export function IconLink({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.56 3.44c-1.319-1.317-3.358-1.236-4.751.157l-.525.525a.75.75 0 1 1-1.06-1.061l.524-.525C8.651.634 11.642.403 13.62 2.38s1.746 4.97-.156 6.872l-.525.524a.75.75 0 0 1-1.06-1.06l.524-.525c1.393-1.393 1.474-3.432.156-4.75M4.121 6.224a.75.75 0 0 1 0 1.061l-.525.525c-1.393 1.393-1.474 3.432-.156 4.75s3.357 1.237 4.75-.156l.525-.525a.75.75 0 1 1 1.06 1.061l-.524.525c-1.903 1.902-4.894 2.133-6.872.156s-1.746-4.97.156-6.872l.525-.525a.75.75 0 0 1 1.06 0m5.654 0a.75.75 0 0 1 0 1.061L7.284 9.776a.75.75 0 0 1-1.06-1.06l2.492-2.493a.75.75 0 0 1 1.06 0"
      />
    </svg>
  );
}

// ─── form/svgexport-7 — Header/Columns (builder toolbar) ─────────────────────
export function IconColumns({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 7H2.75A1.75 1.75 0 0 1 1 5.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zM1 10.75C1 9.784 1.784 9 2.75 9h10.5c.966 0 1.75.784 1.75 1.75v2.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25z"
      />
    </svg>
  );
}

// ─── form/svgexport-5 — Send/Publish arrow ───────────────────────────────────
export function IconSend({ size = 16, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.55 4.041c-.363-1.45 1.143-2.658 2.48-1.99l8.766 4.384c1.29.645 1.29 2.485 0 3.13L5.03 13.95c-1.337.668-2.843-.54-2.48-1.99L3.54 8zM4.898 8.75l-.893 3.573a.25.25 0 0 0 .354.284l8.767-4.383a.25.25 0 0 0 0-.448L4.359 3.393a.25.25 0 0 0-.354.284l.893 3.573h1.758a.75.75 0 0 1 0 1.5z"
      />
    </svg>
  );
}

// ─── form/svgexport-4 — Chevron Right ────────────────────────────────────────
export function IconChevronRight({ size = 8, ...props }: IconProps) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 5 8" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.22 0.72a.75.75 0 0 1 1.06 0L4.015 3.455a.999.999 0 0 1 0 1.09L1.28 7.78a.75.75 0 1 1-1.06-1.06L2.69 4.25.22 1.78a.75.75 0 0 1 0-1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

// ─── Fallback icons using lucide-react ───────────────────────────────────────
// These are used where no matching custom SVG was found in the references folder.

export {
  Trash2 as IconTrash,       /* ASSUMED_ICON: Replace with custom SVG later */
  Copy as IconDuplicate,     /* ASSUMED_ICON: Replace with custom SVG later */
  Pencil as IconRename,      /* ASSUMED_ICON: Replace with custom SVG later */
  Globe as IconPublish,      /* ASSUMED_ICON: Replace with custom SVG later */
  EyeOff as IconUnpublish,   /* ASSUMED_ICON: Replace with custom SVG later */
  Star as IconRating,        /* ASSUMED_ICON: Replace with custom SVG later */
  Hash as IconNumber,        /* ASSUMED_ICON: Replace with custom SVG later */
  Mail as IconEmail,         /* ASSUMED_ICON: Replace with custom SVG later */
  ToggleLeft as IconYesNo,   /* ASSUMED_ICON: Replace with custom SVG later */
  AlignLeft as IconLongText, /* ASSUMED_ICON: Replace with custom SVG later */
  ChevronDown as IconDropdownType, /* ASSUMED_ICON: Replace with custom SVG later */
  Play as IconPreview,       /* ASSUMED_ICON: Replace with custom SVG later */
  Smartphone as IconMobile,  /* ASSUMED_ICON: Replace with custom SVG later */
  Settings as IconSettings,  /* ASSUMED_ICON: Replace with custom SVG later */
  ChevronUp as IconChevronUp,
  Cpu as IconAI,             /* ASSUMED_ICON: Replace with custom SVG later */
  RefreshCw as IconLogic,    /* ASSUMED_ICON: Replace with custom SVG later */
  Calendar as IconDate,      /* ASSUMED_ICON: Replace with custom SVG later */
  LayoutGrid as IconGrid,    /* ASSUMED_ICON: Replace with custom SVG later */
  List as IconList,          /* ASSUMED_ICON: Replace with custom SVG later */
  SlidersHorizontal as IconFilter, /* ASSUMED_ICON: Replace with custom SVG later */
  Mic as IconMic,            /* ASSUMED_ICON: Replace with custom SVG later */
  Diamond as IconPro,        /* ASSUMED_ICON: Replace with custom SVG later */
  X as IconClose,            /* ASSUMED_ICON: Replace with custom SVG later */
  Check as IconCheck,        /* ASSUMED_ICON: Replace with custom SVG later */
} from 'lucide-react';
