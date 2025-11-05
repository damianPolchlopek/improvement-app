import CenteredContainer from '../../../component/CenteredContainer';
import MealsTable from './MealsTable';
import MealsDaySummary from './MealsDaySummary';
import Grid from '@mui/material/Unstable_Grid2';

export default function DietDaySummaryForm({ children }) {

  return (
    <CenteredContainer>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <MealsDaySummary />
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