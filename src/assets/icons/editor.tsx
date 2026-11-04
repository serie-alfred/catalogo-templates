// Ícones proprietários do design do editor (Figma "Versão Final V4").
// Exportados do Figma e normalizados para `currentColor` — a cor vem do CSS,
// nunca do SVG, para que os estados ativo/inativo do rail funcionem.
// Os ícones nomeados `lucide/*` no Figma NÃO estão aqui: use `lucide-react`.
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function CaretDown(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M15 11L12 14L9 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M8.33333 6.66667L11.6667 10L8.33333 13.3333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function UndoLeft(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M5.83333 4.16667L2.5 7.5L5.83333 10.8333M2.5 7.5H13.3333C15.6345 7.5 17.5 9.36548 17.5 11.6667C17.5 13.9679 15.6345 15.8333 13.3333 15.8333H9.16667"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function UndoRight(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M14.1667 4.16667L17.5 7.5L14.1667 10.8333M17.5 7.5H6.66667C4.36548 7.5 2.5 9.36548 2.5 11.6667C2.5 13.9679 4.36548 15.8333 6.66667 15.8333H10.8333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M10 5.83333V14.1667M6.66667 10.8333L10 14.1667L13.3333 10.8333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M6 12H12M12 12H18M12 12V18M12 12V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function Minus(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M6 12H18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function TextBlock(props: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M9.16667 17.4167H11M11 17.4167H12.8333M11 17.4167V4.58333M11 4.58333H5.5V5.5M11 4.58333H16.5V5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function EyeShow(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <g>
          <path
            d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

export function CloseMd(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function TypeCase(props: IconProps) {
  return (
    <svg
      width="21.5002"
      height="11.4978"
      viewBox="0 0 21.5002 11.4978"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M0.750196 10.7476L4.7892 1.0576C4.82717 0.966504 4.89126 0.888685 4.97339 0.833947C5.05551 0.779209 5.152 0.75 5.2507 0.75C5.34939 0.75 5.44588 0.779209 5.528 0.833947C5.61013 0.888685 5.67422 0.966504 5.7122 1.0576L9.7502 10.7476M20.7502 3.7476V10.7476M2.0542 7.7476H8.4462M20.7502 7.2476C20.7502 9.1806 19.1832 10.7476 17.2502 10.7476C15.3172 10.7476 13.7502 9.1806 13.7502 7.2476C13.7502 5.3146 15.3172 3.7476 17.2502 3.7476C19.1832 3.7476 20.7502 5.3146 20.7502 7.2476Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WakeMark(props: IconProps) {
  return (
    <svg
      width="41.8733"
      height="12"
      viewBox="0 0 41.8733 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path d="M26.839 0H24.1775V11.7653H26.839V0Z" fill="#141414" />
        <path
          d="M31.857 8.78024V11.8209L24.1912 7.40683V4.36707L31.857 8.78024Z"
          fill="#141414"
        />
        <path
          d="M24.1775 7.3121V10.464L31.9053 6.04995V2.89893L24.1775 7.3121Z"
          fill="#C505F2"
        />
        <path
          d="M10.6135 2.52869L9.22374 7.54599L7.84672 2.57476L7.85947 2.52869H7.83313H5.3195H5.29401L5.30675 2.57476L3.92973 7.54599L2.53997 2.52869H0L1.1672 6.77757L1.17909 6.73759L2.55866 11.7653H2.79906H2.80926H5.17168H5.18188H5.29996L6.58268 7.13744L7.85267 11.7653H8.09307H8.10242H10.4657H10.4759H10.594L13.1526 2.52869H10.6135Z"
          fill="#141414"
        />
        <path
          d="M16.3179 8.87592C16.7639 9.34879 17.3084 9.58523 17.9854 9.58523C18.6625 9.58523 19.207 9.34879 19.6521 8.85854C20.0981 8.36915 20.3292 7.79458 20.3292 7.11917C20.3292 6.44377 20.0981 5.8692 19.6521 5.39633C19.207 4.92345 18.6616 4.68702 17.9854 4.68702C17.3084 4.68702 16.7639 4.92345 16.3179 5.39633C15.8889 5.8692 15.674 6.44377 15.674 7.11917C15.6731 7.81196 15.888 8.38654 16.3179 8.87592ZM20.3292 2.53476H22.7723V11.7644H20.3292V10.8178C19.5536 11.6123 18.6285 12 17.5394 12C16.2516 12 15.1787 11.5271 14.3369 10.5979C13.495 9.65216 13.0822 8.4865 13.0822 7.0844C13.0822 5.69882 13.5112 4.55055 14.3539 3.63871C15.1957 2.72687 16.2686 2.27051 17.5394 2.27051C18.6293 2.27051 19.5536 2.67645 20.3292 3.48659V2.53476Z"
          fill="#141414"
        />
        <path
          d="M35.1207 6.15693H39.38C39.1319 5.09297 38.3725 4.43408 37.2996 4.43408C36.2437 4.43408 35.4018 5.07558 35.1207 6.15693ZM41.79 8.04841H35.1376C35.4511 9.21407 36.2768 9.78864 37.5969 9.78864C38.6205 9.78864 39.5609 9.48528 40.4198 8.89332L41.4434 10.7005C40.3374 11.5619 39.0173 11.9844 37.4822 11.9844C35.8809 11.9844 34.6594 11.5115 33.8005 10.5823C32.9587 9.65304 32.5297 8.50476 32.5297 7.13657C32.5297 5.73447 32.9748 4.5862 33.8507 3.67349C34.7256 2.74426 35.8809 2.28791 37.3004 2.28791C38.6375 2.28791 39.7274 2.71036 40.5854 3.53788C41.4434 4.36541 41.8732 5.49717 41.8732 6.93317C41.8724 7.25479 41.8401 7.62682 41.79 8.04841Z"
          fill="#141414"
        />
      </g>
    </svg>
  );
}

export function CaretUpSm(props: IconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M6.25 8.125L3.125 5L6.25 1.875"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function CaretDownSm(props: IconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <path
          d="M3.75 1.875L6.875 5L3.75 8.125"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Modo LP do rail: tela com blocos de layout (arte entregue pelo design).
export function LandingPage(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M20 3H4C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V5C22 3.89543 21.1046 3 20 3Z"
        strokeWidth="1.5"
      />
      <path d="M8 21H16" strokeWidth="1.5" />
      <path d="M12 17V21" strokeWidth="1.5" />
      <path d="M18 5.375H6C5.58579 5.375 5.25 5.5802 5.25 5.83333V8.125C5.25 8.37813 5.58579 8.58333 6 8.58333H18C18.4142 8.58333 18.75 8.37813 18.75 8.125V5.83333C18.75 5.5802 18.4142 5.375 18 5.375Z" />
      <path d="M11.25 10.4167H6C5.58579 10.4167 5.25 10.6219 5.25 10.875V13.1667C5.25 13.4198 5.58579 13.625 6 13.625H11.25C11.6642 13.625 12 13.4198 12 13.1667V10.875C12 10.6219 11.6642 10.4167 11.25 10.4167Z" />
      <path d="M17.8059 10.4167H14.9749C14.4537 10.4167 14.0312 10.6219 14.0312 10.875V13.1667C14.0312 13.4198 14.4537 13.625 14.9749 13.625H17.8059C18.3271 13.625 18.7496 13.4198 18.7496 13.1667V10.875C18.7496 10.6219 18.3271 10.4167 17.8059 10.4167Z" />
    </svg>
  );
}
