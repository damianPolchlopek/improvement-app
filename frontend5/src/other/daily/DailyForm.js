import React, { useState } from "react";
import REST from "../../utils/REST";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../utils/REST";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "../../component/snackbar/SnackbarProvider";

import Grid from "@mui/material/Unstable_Grid2";
import {
  Typography,
  Card,
  CardContent,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  useTheme,
} from "@mui/material";
import { ChecklistRtl } from "@mui/icons-material";

export default function DailyForm() {
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();

  const [dailyFields, setDailyFields] = useState({
    smoking: false,
    exercise: false,
    book: false,
    work: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => REST.addDaily(dailyFields),
    onSuccess: () => {
      queryClient.invalidateQueries(["daily-list"]);
      showSnackbar(t("common.addedSuccessfully"), "success");
      setDailyFields({ smoking: false, exercise: false, book: false, work: false });
    },
    onError: () => {
      showSnackbar(t("common.addFailed"), "error");
    },
    retry: false,
  });

  const handleFormChange = (event) => {
    setDailyFields((prev) => ({
      ...prev,
      [event.target.name]: !prev[event.target.name],
    }));
  };

  return (
    <Box sx={{ py: 2 }}>
      <Card elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: theme.palette.card.header,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <ChecklistRtl sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="600">
            Daily Schema
          </Typography>
        </Box>

        {/* Form body */}
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormControlLabel
                control={<Checkbox checked={dailyFields.smoking} />}
                name="smoking"
                onChange={handleFormChange}
                label="Palenie papierosów"
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.exercise} />}
                name="exercise"
                onChange={handleFormChange}
                label="Ćwiczenia na postawę"
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.book} />}
                name="book"
                onChange={handleFormChange}
                label="Książka"
              />
              <FormControlLabel
                control={<Checkbox checked={dailyFields.work} />}
                name="work"
                onChange={handleFormChange}
                label="Cloud"
              />
            </Grid>

            <Grid xs={12}>
              <Button
                variant="contained"
                onClick={() => mutate()}
                disabled={isPending}
                sx={{ minWidth: 120 }}
              >
                {isPending ? t("common.saving") : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}