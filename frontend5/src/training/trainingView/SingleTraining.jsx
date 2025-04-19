import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import {
  Collapse,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  CircularProgress,
} from '@mui/material';

import StyledTableRow from '../../component/table/StyledTableRow';
import StyledTableCell from '../../component/table/StyledTableCell';
import REST from '../../utils/REST';

export default function SingleTraining({ trainingName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState(null); // null | { type: 'date' | 'name', value: string }
  const { t } = useTranslation();

  const modifiedTrainingName = trainingName?.replace(/ /g, '_');

  const { data, isLoading, error } = useQuery({
    queryKey: ['exercises', modifiedTrainingName, filter],
    queryFn: async () => {
      if (filter?.type === 'date') {
        const res = await REST.getExercisesByDate(filter.value);
        return res.content;
      } else if (filter?.type === 'name') {
        const res = await REST.getExercisesByName(filter.value);
        return res.content;
      } else {
        const res = await REST.getExercises(modifiedTrainingName);
        return res.content;
      }
    },
    enabled: isOpen, // tylko gdy komponent się otworzy
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minut - zmień na ile chcesz
    cacheTime: 1000 * 60 * 10 // trzymanie danych w cache przez 10 minut
  });
  

  const handleClick = () => {
    setIsOpen(open => !open);
  };

  const handleFilterByDate = (date) => {
    setFilter({ type: 'date', value: date });
  };

  const handleFilterByName = (name) => {
    setFilter({ type: 'name', value: name });
  };

  return (
    <>
      <Box
        key={trainingName}
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography>{trainingName}</Typography>
      </Box>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {isLoading ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{t('messages.errorLoading')}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="exercise table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="right">{t('exercise.date')}</StyledTableCell>
                  <StyledTableCell>{t('exercise.name')}</StyledTableCell>
                  <StyledTableCell align="right">{t('exercise.reps')}</StyledTableCell>
                  <StyledTableCell align="right">{t('exercise.weight')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>

              <TableBody>
                {data?.map((exercise) => (
                  <StyledTableRow
                    key={exercise.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell align="right" onClick={() => handleFilterByDate(exercise.date)}>
                      {exercise.date}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleFilterByName(exercise.name)}>
                      {exercise.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{exercise.reps}</StyledTableCell>
                    <StyledTableCell align="right">{exercise.weight}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Collapse>
    </>
  );
}
