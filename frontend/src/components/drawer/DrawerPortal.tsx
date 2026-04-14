import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
};

export default function DrawerPortal({ children }: PortalProps) {
  return createPortal(children, document.body);
}
