import React, { useState, createContext } from 'react';
import { Modal, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CloseIconButton from '../common/icon-buttons/CloseIconButton';

const ModalContext = createContext(null);

const useStyles = makeStyles({
  centered: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 15,
    outline: 'none',
  },
});

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const classes = useStyles();

  return (
    <ModalContext.Provider value={{ showModal: (component) => setModal(component) }}>
      {children}
      {modal && (
        <Modal open onClose={() => setModal(null)}>
          <Paper className={classes.centered} elevation={0}>
            <CloseIconButton onClick={() => setModal(null)} />
            {modal}
          </Paper>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export default ModalContext;
