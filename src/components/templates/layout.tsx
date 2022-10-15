import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../organisms/sidebar";
import Topbar from "../organisms/topbar";
import { PollingProvider } from "../../context/polling";
import clsx from "clsx";

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex w-full h-screen print:h-auto inter-base-regular text-grey-90">
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
        <PollingProvider>
          <Topbar />
        </PollingProvider>
        <div
          className={clsx(
            "large:px-xlarge py-xlarge bg-grey-5 min-h-content overflow-y-auto",
            "print:!p-0"
          )}
        >
          <main
            className={clsx(
              "xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full h-full",
              "print:!m-0 print:!max-w-none print:!w-auto"
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
