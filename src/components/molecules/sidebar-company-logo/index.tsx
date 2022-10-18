import React, { useContext } from "react";
import { AccountContext } from "src/context/account";

type SidebarCompanyLogoProps = {};

const SidebarCompanyLogo: React.FC<SidebarCompanyLogoProps> = () => {
  const { name } = useContext(AccountContext);

  return (
    <div className="flex items-center bg-grey-0 px-2.5 pb-6 w-full mb-4">
      <div className="w-[32px] h-[32px] flex items-center justify-center bg-grey-90 text-grey-0 rounded">
        <div>{name?.slice(0, 1) || "R"}</div>
      </div>
      <span className="font-semibold ml-2.5">
        {(name?.length > 13 ? `${name.slice(0, 13)}...` : name) ?? "RGB"}
      </span>
    </div>
  );
};

export default SidebarCompanyLogo;
