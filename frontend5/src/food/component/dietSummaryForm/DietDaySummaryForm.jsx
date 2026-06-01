import CenteredContainer from '../../../component/CenteredContainer';
import MealsTable from './MealsTable';
import MealsDaySummary from './MealsDaySummary';
import Grid from '@mui/material/Grid';

export default function DietDaySummaryForm({ children }) {
  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid size={12}>
          <MealsDaySummary />
        </Grid>

        <Grid size={12}>{children}</Grid>

        <Grid size={12}>
          <MealsTable />
        </Grid>
      </Grid>
    </CenteredContainer>
  );
}
