import type { MouseEventHandler } from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
};

export const ModalOverlay = ({ onClick }: TModalOverlayProps): React.JSX.Element => (
  <div className={styles.overlay} onClick={onClick} aria-hidden="true" />
);
