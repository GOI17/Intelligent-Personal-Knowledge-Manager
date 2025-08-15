import * as React from "react";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, header, sidebar, showSidebar = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("min-h-screen bg-background", className)} {...props}>
        {header && <Header>{header}</Header>}
        <div className="flex">
          {showSidebar && sidebar && (
            <Sidebar>{sidebar}</Sidebar>
          )}
          <main 
            className={cn(
              "flex-1 p-6",
              showSidebar && sidebar ? "lg:ml-0" : ""
            )}
          >
            {children}
          </main>
        </div>
      </div>
    );
  }
);
Layout.displayName = "Layout";

export { Layout };
