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
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M15 11L12 14L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M8.33333 6.66667L11.6667 10L8.33333 13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function UndoLeft(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M5.83333 4.16667L2.5 7.5L5.83333 10.8333M2.5 7.5H13.3333C15.6345 7.5 17.5 9.36548 17.5 11.6667C17.5 13.9679 15.6345 15.8333 13.3333 15.8333H9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function UndoRight(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M14.1667 4.16667L17.5 7.5L14.1667 10.8333M17.5 7.5H6.66667C4.36548 7.5 2.5 9.36548 2.5 11.6667C2.5 13.9679 4.36548 15.8333 6.66667 15.8333H10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M10 5.83333V14.1667M6.66667 10.8333L10 14.1667L13.3333 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M6 12H12M12 12H18M12 12V18M12 12V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function Minus(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function TextBlock(props: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M9.16667 17.4167H11M11 17.4167H12.8333M11 17.4167V4.58333M11 4.58333H5.5V5.5M11 4.58333H16.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function ListBlock(props: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M8.25 15.5833H17.4167M8.25 11H17.4167M8.25 6.41667H17.4167M4.58512 15.5833V15.5852L4.58333 15.5851V15.5833H4.58512ZM4.58512 11V11.0018L4.58333 11.0018V11H4.58512ZM4.58512 6.41667V6.4185L4.58333 6.41846V6.41667H4.58512Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function EyeShow(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><g><path d="M3.5868 13.7788C5.36623 15.5478 8.46953 17.9999 12.0002 17.9999C15.5308 17.9999 18.6335 15.5478 20.413 13.7788C20.8823 13.3123 21.1177 13.0782 21.2671 12.6201C21.3738 12.2933 21.3738 11.7067 21.2671 11.3799C21.1177 10.9218 20.8823 10.6877 20.413 10.2211C18.6335 8.45208 15.5308 6 12.0002 6C8.46953 6 5.36623 8.45208 3.5868 10.2211C3.11714 10.688 2.88229 10.9216 2.7328 11.3799C2.62618 11.7067 2.62618 12.2933 2.7328 12.6201C2.88229 13.0784 3.11714 13.3119 3.5868 13.7788Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g></g>
    </svg>
  );
}

export function CloseMd(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g>
    </svg>
  );
}

export function TypeCase(props: IconProps) {
  return (
    <svg
      width="21.5002"
      height="11.4978"
      viewBox="0 0 21.5002 11.4978"
      fill="none" stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M0.750196 10.7476L4.7892 1.0576C4.82717 0.966504 4.89126 0.888685 4.97339 0.833947C5.05551 0.779209 5.152 0.75 5.2507 0.75C5.34939 0.75 5.44588 0.779209 5.528 0.833947C5.61013 0.888685 5.67422 0.966504 5.7122 1.0576L9.7502 10.7476M20.7502 3.7476V10.7476M2.0542 7.7476H8.4462M20.7502 7.2476C20.7502 9.1806 19.1832 10.7476 17.2502 10.7476C15.3172 10.7476 13.7502 9.1806 13.7502 7.2476C13.7502 5.3146 15.3172 3.7476 17.2502 3.7476C19.1832 3.7476 20.7502 5.3146 20.7502 7.2476Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function EtemasMark(props: IconProps) {
  return (
    <svg
      width="27.4035"
      height="24"
      viewBox="0 0 27.4035 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g><path d="M13.6676 0.000615348C13.6908 -0.000207998 13.6849 -0.000737061 13.7133 0.00264454C14.0675 0.0450763 27.147 7.45612 27.3127 7.68195C27.1485 7.99571 24.1467 9.53728 23.5805 9.85118C24.3173 10.247 26.9901 11.5805 27.4035 12.0425C26.5839 12.6607 24.5599 13.6496 23.5777 14.1639C24.2518 14.5748 26.9906 15.912 27.3129 16.3562C27.049 16.7505 15.3465 23.0665 13.7739 23.9829C13.7408 23.9877 13.69 24.0024 13.6581 23.9997C13.4842 23.9847 1.42578 17.1225 0 16.3461C1.21765 15.5267 2.58072 14.8768 3.8566 14.1476C2.56978 13.4535 1.24401 12.763 0.0150947 11.9719C1.25494 11.2018 2.56936 10.5306 3.85169 9.83309C2.57362 9.10218 1.28972 8.3815 1.46632e-05 7.67107C1.46369 6.66412 3.16296 5.85359 4.71796 4.98793L13.6676 0.000615348Z" fill="black"/><path d="M13.6221 0.684961C14.8413 1.30394 25.4435 7.20794 25.7319 7.55389C25.6108 7.76811 14.7967 13.7015 13.5823 14.3777C12.3104 13.5579 10.8917 12.8564 9.56915 12.113L1.37007 7.50772C5.49049 5.31309 9.54757 2.96443 13.6221 0.684961Z" fill="#0096FE"/><path d="M4.48923 10.2879C4.9736 10.2779 12.5998 14.7181 13.6916 15.3315L22.84 10.2533C23.4303 10.5963 25.4954 11.5451 25.8295 12.0247C25.5869 12.3599 23.481 13.3901 22.9642 13.6714L13.6993 18.8373C9.6187 16.5681 5.52017 14.3046 1.48799 11.9524C2.49591 11.4109 3.49632 10.8561 4.48923 10.2879Z" fill="#6BCFF8"/><path d="M4.57235 14.6209C5.10637 14.7008 12.5303 19.0179 13.678 19.6627C14.6101 19.2449 15.5244 18.6531 16.4213 18.1544C18.549 16.9711 20.6642 15.7502 22.8183 14.6156C23.5295 15.0073 25.314 15.8517 25.8285 16.3561C25.5538 16.7268 23.3508 17.8054 22.8088 18.1123C21.7667 18.6321 20.7551 19.2459 19.7377 19.8133L13.6911 23.1733L1.52534 16.3208C2.51209 15.7177 3.56084 15.1845 4.57235 14.6209Z" fill="#C5E6FD"/></g>
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
      <g><path d="M26.839 0H24.1775V11.7653H26.839V0Z" fill="#141414"/><path d="M31.857 8.78024V11.8209L24.1912 7.40683V4.36707L31.857 8.78024Z" fill="#141414"/><path d="M24.1775 7.3121V10.464L31.9053 6.04995V2.89893L24.1775 7.3121Z" fill="#C505F2"/><path d="M10.6135 2.52869L9.22374 7.54599L7.84672 2.57476L7.85947 2.52869H7.83313H5.3195H5.29401L5.30675 2.57476L3.92973 7.54599L2.53997 2.52869H0L1.1672 6.77757L1.17909 6.73759L2.55866 11.7653H2.79906H2.80926H5.17168H5.18188H5.29996L6.58268 7.13744L7.85267 11.7653H8.09307H8.10242H10.4657H10.4759H10.594L13.1526 2.52869H10.6135Z" fill="#141414"/><path d="M16.3179 8.87592C16.7639 9.34879 17.3084 9.58523 17.9854 9.58523C18.6625 9.58523 19.207 9.34879 19.6521 8.85854C20.0981 8.36915 20.3292 7.79458 20.3292 7.11917C20.3292 6.44377 20.0981 5.8692 19.6521 5.39633C19.207 4.92345 18.6616 4.68702 17.9854 4.68702C17.3084 4.68702 16.7639 4.92345 16.3179 5.39633C15.8889 5.8692 15.674 6.44377 15.674 7.11917C15.6731 7.81196 15.888 8.38654 16.3179 8.87592ZM20.3292 2.53476H22.7723V11.7644H20.3292V10.8178C19.5536 11.6123 18.6285 12 17.5394 12C16.2516 12 15.1787 11.5271 14.3369 10.5979C13.495 9.65216 13.0822 8.4865 13.0822 7.0844C13.0822 5.69882 13.5112 4.55055 14.3539 3.63871C15.1957 2.72687 16.2686 2.27051 17.5394 2.27051C18.6293 2.27051 19.5536 2.67645 20.3292 3.48659V2.53476Z" fill="#141414"/><path d="M35.1207 6.15693H39.38C39.1319 5.09297 38.3725 4.43408 37.2996 4.43408C36.2437 4.43408 35.4018 5.07558 35.1207 6.15693ZM41.79 8.04841H35.1376C35.4511 9.21407 36.2768 9.78864 37.5969 9.78864C38.6205 9.78864 39.5609 9.48528 40.4198 8.89332L41.4434 10.7005C40.3374 11.5619 39.0173 11.9844 37.4822 11.9844C35.8809 11.9844 34.6594 11.5115 33.8005 10.5823C32.9587 9.65304 32.5297 8.50476 32.5297 7.13657C32.5297 5.73447 32.9748 4.5862 33.8507 3.67349C34.7256 2.74426 35.8809 2.28791 37.3004 2.28791C38.6375 2.28791 39.7274 2.71036 40.5854 3.53788C41.4434 4.36541 41.8732 5.49717 41.8732 6.93317C41.8724 7.25479 41.8401 7.62682 41.79 8.04841Z" fill="#141414"/></g>
    </svg>
  );
}

