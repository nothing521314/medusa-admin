import clsx from "clsx";
import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../organisms/sidebar";
import Topbar from "../organisms/topbar";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex w-full h-screen inter-base-regular text-grey-90 print:hidden">
      <Toaster
        containerStyle={{
          top: 74,
          left: 24,
          bottom: 24,
          right: 24,
        }}
      />
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div
          className={clsx(
            "large:px-xlarge py-xlarge bg-grey-5 min-h-content overflow-y-auto"
          )}
        >
          <main
            className={clsx(
              "xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full h-full"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
