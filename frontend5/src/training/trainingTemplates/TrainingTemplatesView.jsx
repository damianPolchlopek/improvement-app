import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, ButtonBase, Collapse, Skeleton, Typography } from '@mui/material';
import { KeyboardArrowDown, ListAlt, SearchOff } from '@mui/icons-material';

import REST from '../../utils/REST';
import ErrorAlert from '../../component/error/ErrorAlert';
import FoodPageHeader from '../../food/component/FoodPageHeader';
import SearchField from '../../food/component/SearchField';
import { surfaceSx, HAIRLINE } from '../../food/component/foodStyles';
import { ROW_LINE } from '../component/trainingTableSx';
import { typeGroup } from '../trainingView/trainingWeeks';

// "Siłowy#1-A" -> "Siłowy"; nazwy bez '#' tworzą własną grupę
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

function TemplateRow({ template, isOpen, onToggle }) {
  const { t } = useTranslation();
  const panelId = `template-${template.id}`;

  return (
    <Box sx={{ borderTop: ROW_LINE }}>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pl: { xs: 2, md: 3 },
          pr: 2,
          py: 1.1,
          textAlign: 'left',
          bgcolor: isOpen ? 'rgba(144, 202, 249, 0.06)' : 'transparent',
          transition: 'background-color 150ms',
          '&:hover': { bgcolor: isOpen ? 'rgba(144, 202, 249, 0.08)' : 'rgba(255,255,255,0.03)' },
        }}
      >
        <Box
          sx={{
            width: 9,
            height: 9,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: typeGroup(template.name).dot,
          }}
        />
        <Typography component="span" sx={{ flex: 1, minWidth: 0, fontWeight: 500 }} noWrap>
          {template.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {t('training.exercisesInTemplate', { count: template.exercises.length })}
        </Typography>
        <KeyboardArrowDown
          sx={{
            color: 'text.secondary',
            transition: 'transform 200ms',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </ButtonBase>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box
          component="ol"
          id={panelId}
          sx={{ m: 0, pl: { xs: 2, md: '53px' }, pr: 2, pb: 1.25, pt: 0.25, listStyle: 'none' }}
        >
          {template.exercises.map((exercise, index) => (
            <Box
              component="li"
              key={`${exercise}-${index}`}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, py: 0.5 }}
            >
              <Box
                component="span"
                sx={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: 'rgba(144, 202, 249, 0.16)',
                  color: 'primary.main',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body2">{exercise}</Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

// Szablony treningów pogrupowane według planu; kliknięcie szablonu rozwija jego ćwiczenia.
export default function TrainingTemplatesView() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState(() => new Set());

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['training-templates'],
    queryFn: () => REST.getAllTrainingTemplates(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const templates = useMemo(() => data?.content ?? [], [data]);
  const query = search.trim().toLowerCase();
  const groups = useMemo(
    () =>
      groupTemplates(
        templates.filter(
          (template) =>
            !query ||
            template.name.toLowerCase().includes(query) ||
            template.exercises.some((exercise) => exercise.toLowerCase().includes(query))
        )
      ),
    [templates, query]
  );

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Box sx={{ py: 3, px: 2, maxWidth: 1000, mx: 'auto' }}>
      <FoodPageHeader
        icon={<ListAlt />}
        title={t('training.templates')}
        description={t('training.templatesDesc')}
        statLabel={t('training.templatesCount')}
        statValue={templates.length}
        statLoading={isLoading}
        actions={
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder={t('training.searchTemplate')}
          />
        }
      />

      {isError ? (
        <ErrorAlert error={error} />
      ) : isLoading ? (
        <Box sx={{ ...surfaceSx, p: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={44} />
          ))}
        </Box>
      ) : groups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <SearchOff sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography>
            {templates.length === 0
              ? t('training.noTemplates')
              : t('training.noTemplatesMatching', { query: search.trim() })}
          </Typography>
        </Box>
      ) : (
        <Box sx={surfaceSx}>
          {groups.map(([group, items], index) => (
            <Box key={group} component="section" sx={{ borderTop: index > 0 ? HAIRLINE : 0 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'baseline', gap: 1, px: 2, pt: 1.5, pb: 0.75 }}
              >
                <Typography component="h2" sx={{ fontSize: 14, fontWeight: 500 }}>
                  {group}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  · {t('training.templatesInGroup', { count: items.length })}
                </Typography>
              </Box>
              {items.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  isOpen={openIds.has(template.id)}
                  onToggle={() => toggle(template.id)}
                />
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
