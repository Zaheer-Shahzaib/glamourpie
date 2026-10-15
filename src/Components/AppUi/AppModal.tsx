import { ReactNode } from "react";
import { Modal, ModalProps } from "@mantine/core";
import classes from "./AppUi.module.scss";

type AppModalProps = Omit<ModalProps, "title" | "classNames"> & {
  title: ReactNode;
  /** Small muted line under the title */
  subtitle?: ReactNode;
  /** Content aligned to the right of the subtitle line (e.g. a status pill) */
  aside?: ReactNode;
};

/**
 * Mantine <Modal> skinned for the Seller Center modals (Figma "04 Auth & Modals"):
 * title + muted subtitle header, navy 58% overlay, 12px radius.
 */
export const AppModal = ({
  title,
  subtitle,
  aside,
  children,
  ...rest
}: AppModalProps) => (
  <Modal
    centered
    {...rest}
    classNames={{
      content: classes.modalContent,
      header: classes.modalHeader,
      title: classes.modalTitleWrap,
      body: classes.modalBody,
      close: classes.modalClose,
      overlay: classes.modalOverlay,
    }}
    title={
      <>
        <span className={classes.modalTitle}>{title}</span>
        {(subtitle || aside) && (
          <span className={classes.modalSubRow}>
            <span className={classes.modalSubtitle}>{subtitle}</span>
            {aside}
          </span>
        )}
      </>
    }
  >
    {children}
  </Modal>
);

export default AppModal;
