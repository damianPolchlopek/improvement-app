import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import {
  Collapse,
  Typography,
  Box
} from '@mui/material';

import REST from '../../utils/REST';
import DataTable from '../../component/table/DataTable';

export default function SingleTraining({ trainingName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState(null);
  const { t } = useTranslation();

  const modifiedTrainingName = trainingName?.replace(/ /g, '_');

  const { data, isLoading, isError, error } = useQuery({
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
    enabled: isOpen,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10
  });

  const handleClick = () => {
    setIsOpen(open => !open);
  };

  const handleCellClick = (row, column, value) => {
    if (column.key === 'date') {
      setFilter({ type: 'date', value: row.date });
    } else if (column.key === 'name') {
      setFilter({ type: 'name', value: row.name });
    }
  };

  const exerciseColumns = [
    {
      key: 'date',
      label: t('exercise.date'),
      accessor: 'date',
      align: 'right'
    },
    {
      key: 'name',
      label: t('exercise.name'),
      accessor: 'name'
    },
    {
      key: 'reps',
      label: t('exercise.reps'),
      accessor: 'reps',
      align: 'right'
    },
    {
      key: 'weight',
      label: t('exercise.weight'),
      accessor: 'weight',
      align: 'right'
    }
  ];

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
        <DataTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          error={error}
          columns={exerciseColumns}
          onCellClick={handleCellClick}
          loadingMessage="Ładowanie ćwiczeń..."
          emptyMessage="Brak ćwiczeń do wyświetlenia"
        />
      </Collapse>
    </>
  );
}