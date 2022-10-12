import React from "react";
import IconProps from "../types/icon-type";

const CartIcon: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.5 3C0.5 2.44772 0.947715 2 1.5 2H3.25C3.70887 2 4.10885 2.3123 4.22014 2.75746L4.78078 5H22C22.3079 5 22.5987 5.14187 22.7882 5.38459C22.9777 5.6273 23.0448 5.94379 22.9701 6.24254L20.4701 16.2425C20.3589 16.6877 19.9589 17 19.5 17H6.5C6.04113 17 5.64115 16.6877 5.52986 16.2425L2.46922 4H1.5C0.947715 4 0.5 3.55228 0.5 3ZM5.28078 7L7.28078 15H18.7192L20.7192 7H5.28078Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 17C7.88071 17 9 18.1193 9 19.5C9 20.8807 7.88071 22 6.5 22C5.11929 22 4 20.8807 4 19.5C4 18.1193 5.11929 17 6.5 17ZM6.5 19C6.22386 19 6 19.2239 6 19.5C6 19.7761 6.22386 20 6.5 20C6.77614 20 7 19.7761 7 19.5C7 19.2239 6.77614 19 6.5 19Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 17C20.8807 17 22 18.1193 22 19.5C22 20.8807 20.8807 22 19.5 22C18.1193 22 17 20.8807 17 19.5C17 18.1193 18.1193 17 19.5 17ZM19 19.5C19 19.2239 19.2239 19 19.5 19C19.7761 19 20 19.2239 20 19.5C20 19.7761 19.7761 20 19.5 20C19.2239 20 19 19.7761 19 19.5Z"
        fill={color}
        fillOpacity="0.85"
      />
    </svg>
  );
};

export default CartIcon;
