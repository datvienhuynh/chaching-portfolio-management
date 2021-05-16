import React from 'react';
import { Paper, Box, Typography, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  dialogue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 200,
    width: 400,
  },
});

const Dialogue = React.forwardRef(({ prompt, onContinue, onCancel }, ref) => {
  const classes = useStyles();

  return (
    <Paper className={classes.dialogue} ref={ref}>
      <Box height="70%" display="flex" justifyContent="center" alignItems="center">
        <Typography>{prompt}</Typography>
      </Box>
      <Box height="30%">
        <ButtonGroup fullWidth size="large" style={{ height: '100%' }}>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onContinue}>
            Confirm
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>
  );
});

export default Dialogue;
