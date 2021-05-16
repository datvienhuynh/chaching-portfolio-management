import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  useCompetitionSubmissions,
  addCompetitionPortfolio,
  deleteCompetitionPortfolio,
} from '../../../utils/useCompetitions.js';
import { formatDate } from '../../common/formatting.js';
import UserContext from '../../contexts/UserContext';
import ModalContext from '../../contexts/ModalContext';
import CompetitionPortfolioForm from '../../forms/CompetitionPortfolioForm';

const useStyles = makeStyles((theme) => ({
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
  subheading: {
    fontSize: 20,
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginBottom: 40,
  },
  highlightRow: {
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  normalRow: {
    cursor: 'pointer',
  },
  error: {
    color: 'tomato',
  },
}));
const CompetitionPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const styles = useStyles();
  const {
    submissions,
    competition,
    submissionsLoading,
    fetchSubmissions,
  } = useCompetitionSubmissions(id);

  let rows = [];
  let userSubmission = null;
  if (submissions) {
    rows = [
      ...submissions.sort((a, b) => {
        let valueA = a.totalValue;
        let valueB = b.totalValue;
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
        return 0;
      }),
    ];
    let userIndex = submissions.findIndex((el) => el.username === user?.username);
    if (userIndex >= 0) {
      userSubmission = submissions[userIndex];
      userSubmission['rank'] = userIndex + 1;
    }
  }

  const viewPortfolio = (submission) => {
    showModal(<CompetitionPortfolioForm portfolio={submission} competition={competition} />);
  };

  const editPortfolio = (submission) => {
    showModal(
      <CompetitionPortfolioForm
        portfolio={submission}
        competition={competition}
        edit={true}
        fetchSubmissions={fetchSubmissions}
      />,
    );
  };

  const addPortfolio = async () => {
    const portfolio = await addCompetitionPortfolio(competition.id);
    await fetchSubmissions();
    editPortfolio(portfolio);
  };

  const deletePortfolio = async () => {
    await deleteCompetitionPortfolio(userSubmission.id);
    await fetchSubmissions();
  };

  const now = new Date();
  const submissionsOpen =
    !!competition &&
    now >= new Date(competition.startDate) &&
    now <= new Date(competition.submissionClose);

  return (
    <Box className={styles.page}>
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h1" className={styles.heading}>
            Submissions
          </Typography>
        </div>
      </div>
      {user && (
        <div>
          <div className={styles.headingContainer}>
            <div>
              <Typography variant="h1" className={styles.subheading}>
                Your Submission
              </Typography>
            </div>
            {!userSubmission && submissionsOpen && (
              <Button color="primary" variant="contained" onClick={() => addPortfolio()}>
                Add Submission
              </Button>
            )}
            {!!userSubmission && submissionsOpen && (
              <ButtonGroup variant="contained">
                <Button color="primary" onClick={() => editPortfolio(userSubmission)}>
                  Edit Submission
                </Button>
                <Button color="secondary" onClick={() => deletePortfolio()}>
                  Delete Submission
                </Button>
              </ButtonGroup>
            )}
            {!submissionsOpen && (
              <Typography variant="h6" className={styles.error}>
                Submissions Closed
              </Typography>
            )}
          </div>
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">User</TableCell>
                  <TableCell align="center">Last Updated</TableCell>
                  <TableCell align="center">Portfolio Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSubmission && (
                  <TableRow>
                    <TableCell align="center">{userSubmission.rank}</TableCell>
                    <TableCell align="center">{userSubmission.username}</TableCell>
                    <TableCell align="center">
                      {formatDate(userSubmission.updatedAt, 'DD-MM-YYYY hh:mm:ss')}
                    </TableCell>
                    <TableCell align="center">{'$' + userSubmission.totalValue}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {submissionsLoading && <LinearProgress />}
          </TableContainer>
        </div>
      )}
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h1" className={styles.subheading}>
            All Submissions
          </Typography>
        </div>
      </div>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Rank</TableCell>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Last Updated</TableCell>
              <TableCell align="center">Portfolio Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              let className = styles.normalRow;
              if (row.username === user?.username) {
                className = styles.highlightRow;
              }
              return (
                <TableRow key={row.id} className={className} onClick={() => viewPortfolio(row)}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{row.username}</TableCell>
                  <TableCell align="center">
                    {formatDate(row.updatedAt, 'DD-MM-YYYY hh:mm:ss')}
                  </TableCell>
                  <TableCell align="center">{'$' + row.totalValue.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {submissionsLoading && <LinearProgress />}
      </TableContainer>
    </Box>
  );
};

export default CompetitionPage;
