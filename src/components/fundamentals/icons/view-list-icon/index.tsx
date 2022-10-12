import React from "react";
import IconProps from "../types/icon-type";

const ViewListIcon: React.FC<IconProps> = ({
  size = "20",
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
        d="M9.5 7C9.5 6.44772 9.94772 6 10.5 6H16.5C17.0523 6 17.5 6.44772 17.5 7C17.5 7.55228 17.0523 8 16.5 8H10.5C9.94772 8 9.5 7.55228 9.5 7Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        d="M10.5 11C9.94772 11 9.5 11.4477 9.5 12C9.5 12.5523 9.94772 13 10.5 13H16.5C17.0523 13 17.5 12.5523 17.5 12C17.5 11.4477 17.0523 11 16.5 11H10.5Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        d="M9.5 17C9.5 16.4477 9.94772 16 10.5 16H16.5C17.0523 16 17.5 16.4477 17.5 17C17.5 17.5523 17.0523 18 16.5 18H10.5C9.94772 18 9.5 17.5523 9.5 17Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        d="M8.5 7C8.5 7.5523 8.0523 8 7.5 8C6.9477 8 6.5 7.5523 6.5 7C6.5 6.4477 6.9477 6 7.5 6C8.0523 6 8.5 6.4477 8.5 7Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        d="M7.5 13C8.0523 13 8.5 12.5523 8.5 12C8.5 11.4477 8.0523 11 7.5 11C6.9477 11 6.5 11.4477 6.5 12C6.5 12.5523 6.9477 13 7.5 13Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        d="M8.5 17C8.5 17.5523 8.0523 18 7.5 18C6.9477 18 6.5 17.5523 6.5 17C6.5 16.4477 6.9477 16 7.5 16C8.0523 16 8.5 16.4477 8.5 17Z"
        fill={color}
        fill-opacity="0.85"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 3C3 1.89543 3.89543 1 5 1H19C20.1046 1 21 1.89543 21 3V21C21 22.1046 20.1046 23 19 23H5C3.89543 23 3 22.1046 3 21V3ZM19 3H5V21H19V3Z"
        fill={color}
        fill-opacity="0.85"
      />
    </svg>
  );
};

export default ViewListIcon;