import CenteredContainer from '../../../component/CenteredContainer';
import { useMealSelection } from '../../../context/MealSelectionContext';
import MealsTable from './MealsTable';
import DaySummary from './MealsDaySummary';
import Grid from '@mui/material/Unstable_Grid2';

export default function DietDaySummaryForm({ children }) {
  const { dietSummary } = useMealSelection();

  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <DaySummary dietSummary={dietSummary} />
        </Grid>

        <Grid xs={12}>
          {children}
        </Grid>

        <Grid xs={12}>
          <MealsTable />
        </Grid>
      </Grid>
    </CenteredContainer>
  );
}