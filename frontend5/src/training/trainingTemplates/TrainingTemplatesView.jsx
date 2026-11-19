import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import REST from '../../utils/REST';

import {
  Box,
  Card,
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
  useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore, ListAlt } from '@mui/icons-material';

import ErrorAlert from '../../component/error/ErrorAlert';
import PageLoader from '../../component/loader/PageLoader';
import InformationComponent from '../../component/InformationComponent';

// "Siłowy#1-A" -> "Siłowy"; names without '#' fall into their own group
const groupOf = (name) => name.split('#')[0].trim() || name;

function groupTemplates(templates) {
  const groups = new Map();
  for (const template of templates) {
    const key = groupOf(template.name);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(template);
  }
  return [...groups.entries()];
}

export default function TrainingTemplatesView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openIds, setOpenIds] = useState(() => new Set());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-templates'],
    queryFn: () => REST.getAllTrainingTemplates(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const templates = useMemo(() => data?.content ?? [], [data]);
  const groups = useMemo(() => groupTemplates(templates), [templates]);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (isLoading) return <PageLoader text={t('training.loadingTemplates')} />;
  if (isError) return <ErrorAlert error={error} />;

  return (
    <Box sx={{ py: 4, maxWidth: 900, mx: 'auto', px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <ListAlt sx={{ fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('training.templates')}
        </Typography>
        <Chip
          size="small"
          label={`${t('training.templatesCount')}: ${templates.length}`}
          sx={{ ml: 'auto' }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {t('training.templatesDesc')}
      </Typography>

      {templates.length === 0 ? (
        <InformationComponent>{t('training.noTemplates')}</InformationComponent>
      ) : (
        <Card
          elevation={1}
          sx={{ borderRadius: 2, border: theme.palette.card?.border, overflow: 'hidden' }}
        >
          <List dense disablePadding>
            {groups.map(([group, items]) => (
              <li key={group}>
                <ul style={{ padding: 0 }}>
                  <ListSubheader
                    sx={{ lineHeight: '32px', fontWeight: 600, bgcolor: 'background.surface' }}
                  >
                    {group}
                  </ListSubheader>
                  {items.map((template) => {
                    const isOpen = openIds.has(template.id);
                    return (
                      <Box key={template.id}>
                        <ListItemButton
                          onClick={() => toggle(template.id)}
                          selected={isOpen}
                          aria-expanded={isOpen}
                        >
                          <ListItemText
                            primary={template.name}
                            slotProps={{ primary: { sx: { fontWeight: 500 } } }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                            {t('training.exercisesInTemplate', {
                              count: template.exercises.length,
                            })}
                          </Typography>
                          {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box component="ol" sx={{ m: 0, py: 1, pl: 6, pr: 2 }}>
                            {template.exercises.map((exercise, index) => (
                              <Typography
                                key={`${exercise}-${index}`}
                                component="li"
                                variant="body2"
                                sx={{ py: 0.25 }}
                              >
                                {exercise}
                              </Typography>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </ul>
              </li>
            ))}
          </List>
        </Card>
      )}
    </Box>
  );
}
