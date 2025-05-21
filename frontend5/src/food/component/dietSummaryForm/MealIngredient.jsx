import StyledTableCell from '../../../component/table/StyledTableCell';
import StyledTableRow from '../../../component/table/StyledTableRow';

import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableHead } from '@mui/material';

export default function MealTableRow({ ingredients }) {
    const { t } = useTranslation();
    

    return (
        <StyledTableRow>
          <StyledTableCell colSpan={8}>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>{t('food.name')}</StyledTableCell>
                  <StyledTableCell>{t('food.amount')}</StyledTableCell>
                  <StyledTableCell>{t('food.unit')}</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {ingredients.map((ingredient, idx) => (
                  <StyledTableRow key={idx}>
                  <StyledTableCell>{ingredient.name}</StyledTableCell>
                  <StyledTableCell>{ingredient.amount}</StyledTableCell>
                  <StyledTableCell>{ingredient.unit}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableCell>
        </StyledTableRow>
    );
}