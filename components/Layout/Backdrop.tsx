import React from 'react';
import styles from '@/styles/components/backdrop.module.scss';

type BackdropProps = {
  open: boolean
}
const Backdrop = ({ open }: BackdropProps) => {
  return (
    <div className={`${styles.overlay} ${open ? styles['overlay_open']: ''}`}/>
  );
};

export default Backdrop;