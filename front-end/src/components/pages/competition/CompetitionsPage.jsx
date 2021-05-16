import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCompetitions } from '../../../utils/useCompetitions.js';
import { formatDate } from '../../common/formatting.js';

const useStyles = makeStyles({
  page: {
    paddingTop: 20,
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  table: {
    minWidth: 650,
  },
  accepting: {
    backgroundColor: '#a2beb5',
    cursor: 'pointer',
  },
  inprogress: {
    backgroundColor: '#e8a994',
    cursor: 'pointer',
  },
  finished: {
    cursor: 'pointer',
  },
});
const CompetitionsPage = () => {
  const [competitions] = useCompetitions([], []);
  const history = useHistory();
  const styles = useStyles();

  const now = new Date();
  const acceptingSubmissions = competitions
    .filter((comp) => {
      const compStart = new Date(comp.startDate);
      const compSubmissionClose = new Date(comp.submissionClose);
      return compStart <= now && now <= compSubmissionClose;
    })
    .map((comp) => {
      return {
        ...comp,
        status: 'ACCEPTING',
      };
    });
  const inProgress = competitions
    .filter((comp) => {
      const compSubmissionClose = new Date(comp.submissionClose);
      const compEnd = new Date(comp.endDate);
      return compSubmissionClose < now && now < compEnd;
    })
    .map((comp) => {
      return {
        ...comp,
        status: 'INPROGRESS',
      };
    });
  const finished = competitions
    .filter((comp) => {
      const compEnd = new Date(comp.endDate);
      return compEnd <= now;
    })
    .map((comp) => {
      return {
        ...comp,
        status: 'FINISHED',
      };
    });

  const competitionRows = [...acceptingSubmissions, ...inProgress, ...finished];

  return (
    <Box className={styles.page}>
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h1" className={styles.heading}>
            Competitions
          </Typography>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Start</TableCell>
              <TableCell align="center">End</TableCell>
              <TableCell align="center">Subission Deadline</TableCell>
              <TableCell align="center">Starting Value Limit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitionRows.map((row) => {
              const style =
                row.status === 'ACCEPTING'
                  ? styles.accepting
                  : row.status === 'INPROGRESS'
                  ? styles.inprogress
                  : styles.finished;
              return (
                <TableRow
                  key={row.id}
                  className={style}
                  onClick={() => history.push(`/competition/${row.id}`)}
                >
                  <TableCell align="center">
                    {formatDate(row.startDate, 'DD-MM-YYYY hh:mm:ss')}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(row.endDate, 'DD-MM-YYYY hh:mm:ss')}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(row.submissionClose, 'DD-MM-YYYY hh:mm:ss')}
                  </TableCell>
                  <TableCell align="center">{'$' + row.maxStartingValue}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CompetitionsPage;
