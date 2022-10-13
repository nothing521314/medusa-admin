import React, { useMemo } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";

type AvatarProps = {
  user?: {
    img?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    email: string;
  };
  font?: string;
  color?: string;
};

const Avatar = ({
  user,
  font = "inter-small-semibold",
  color = "bg-violet-60",
}: AvatarProps) => {
  const username = useMemo(() => {
    if (user?.first_name && user?.last_name) {
      return user.first_name + " " + user.last_name;
    }
    if (user?.name) return user.name;

    if (user?.email) {
      return user.email;
    } else {
      return "Medusa user";
    }
  }, [user?.email, user?.first_name, user?.last_name, user?.name]);

  return (
    <RadixAvatar.Root
      className={clsx(
        "w-full h-full items-center justify-center overflow-hidden select-none rounded-circle",
        color
      )}
    >
      <RadixAvatar.Image
        src={user?.img}
        alt={username}
        className="w-full h-full object-cover rounded-circle"
      />
      <RadixAvatar.Fallback
        className={clsx(
          "w-full h-full flex items-center justify-center bg-inherit text-grey-0 rounded-circle",
          font
        )}
      >
        {username.slice(0, 1).toUpperCase()}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
};

export default Avatar;
