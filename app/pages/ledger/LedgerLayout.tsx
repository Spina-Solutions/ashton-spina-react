import "./styles.css";
import { useEffect, type ReactNode } from "react";

export default function LedgerLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("ledger-active");
    return () => { document.body.classList.remove("ledger-active"); };
  }, []);

  return <div className="ledger-layout-escape">{children}</div>;
}
