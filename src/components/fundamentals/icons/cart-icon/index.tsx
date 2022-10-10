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
        d="M14.8442 18.6031C14.7171 18.9003 14.6505 19.222 14.6508 19.5492L14.8442 18.6031ZM14.8442 18.6031H15.1336V18.1031L14.7341 17.8024C14.6615 17.8988 14.5953 17.9993 14.5357 18.1031H11.9544C11.8954 17.9998 11.83 17.8999 11.7586 17.8042L11.3578 18.1031V18.6031H11.6457C11.7726 18.8999 11.8406 19.2218 11.8406 19.5492C11.8406 20.8758 10.7625 21.9539 9.43594 21.9539C8.10938 21.9539 7.03125 20.8758 7.03125 19.5492L14.8442 18.6031ZM7.22461 16.2304L6.87094 16.9508H7.67344H21.6302C21.7174 16.9508 21.801 16.9854 21.8628 17.0468C21.9243 17.1079 21.9592 17.1907 21.9602 17.2773C21.9593 17.4566 21.8118 17.6031 21.6328 17.6031H18.9773H17.9807L18.5765 18.402C18.823 18.7325 18.9602 19.1367 18.9602 19.5492C18.9602 20.5996 18.1059 21.4539 17.0555 21.4539C16.005 21.4539 15.1508 20.5996 15.1508 19.5492V19.5488C15.1504 19.1357 15.2846 18.7338 15.533 18.4039L16.1359 17.6031H15.1336H11.3578H10.3612L10.957 18.402C11.2035 18.7325 11.3406 19.1367 11.3406 19.5492C11.3406 20.5996 10.4864 21.4539 9.43594 21.4539C8.38552 21.4539 7.53125 20.5996 7.53125 19.5492V19.5488C7.53089 19.1357 7.66507 18.7338 7.91351 18.4039L8.51638 17.6031H7.51406H6.04219C5.91762 17.6031 5.80632 17.5343 5.75037 17.4233L5.75038 17.4233L5.74856 17.4198C5.7213 17.3668 5.70942 17.3072 5.71426 17.2478C5.7191 17.1884 5.74048 17.1315 5.77597 17.0836L5.78907 17.0659L5.80058 17.0471L7.5537 14.1854L7.65701 14.0168L7.61701 13.8231L6.25529 7.23011L6.25492 7.22833L5.70179 4.59865L5.61827 4.20156H5.2125H2.26172C2.1749 4.20156 2.09164 4.16707 2.03025 4.10569C1.96886 4.0443 1.93438 3.96104 1.93438 3.87422C1.93438 3.7874 1.96886 3.70414 2.03025 3.64275C2.09164 3.58136 2.1749 3.54688 2.26172 3.54688H5.88281C6.03685 3.54688 6.17363 3.65916 6.20441 3.80583L6.20468 3.8071L6.33124 4.40241L6.41515 4.79709L6.81865 4.79843L21.6299 4.84765C21.63 4.84765 21.6302 4.84765 21.6304 4.84765C21.6766 4.84799 21.7223 4.85836 21.7641 4.87803C21.806 4.8977 21.8431 4.9262 21.8728 4.96156C21.9313 5.03176 21.9564 5.12543 21.9398 5.21852L20.3275 14.2431C20.3275 14.2433 20.3274 14.2434 20.3274 14.2436C20.2999 14.3944 20.1698 14.5023 20.018 14.5023L20.0171 14.5023L8.37331 14.5234L8.06241 14.524L7.9254 14.8031L7.22461 16.2304ZM7.16649 5.42969L6.5481 5.42765L6.67558 6.03276L8.24824 13.4976L8.33201 13.8952L8.73838 13.8945L19.3392 13.8758L19.757 13.875L19.8305 13.4637L21.1524 6.06212L21.257 5.47619L20.6618 5.47422L7.16649 5.42969ZM8.19531 19.5492C8.19531 20.2332 8.75198 20.7898 9.43594 20.7898C9.76497 20.7898 10.0805 20.6591 10.3132 20.4265C10.5459 20.1938 10.6766 19.8783 10.6766 19.5492C10.6766 18.8653 10.1199 18.3086 9.43594 18.3086C8.75198 18.3086 8.19531 18.8653 8.19531 19.5492ZM15.8148 19.5492C15.8148 20.2332 16.3715 20.7898 17.0555 20.7898C17.3845 20.7898 17.7001 20.6591 17.9327 20.4265C18.1654 20.1938 18.2961 19.8783 18.2961 19.5492C18.2961 18.8653 17.7394 18.3086 17.0555 18.3086C16.3715 18.3086 15.8148 18.8653 15.8148 19.5492Z"
        stroke={color}
      />
    </svg>
  );
};

export default CartIcon;