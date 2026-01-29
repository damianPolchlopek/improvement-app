// features/diet-audit/components/DietAuditTimeline.jsx

import React from 'react';
import RevisionCard from './RevisionCard';
import { formatTimestamp } from '../utils/auditFormatters';

import {
  Box,
  Typography,
  Card,
  Divider,
  useTheme,
  Fade
} from '@mui/material';

import {
  Circle as CircleIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const DietAuditTimeline = ({ revisions, onRevisionSelect, selectedRevision }) => {
  const theme = useTheme();

  if (!revisions || revisions.length === 0) {
    return (
      <Card elevation={6} sx={{
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a2e3d 0%, #243441 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        p: 8,
        textAlign: 'center'
      }}>
        <TrendingUpIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
        <Typography variant="h6" color="rgba(255, 255, 255, 0.7)">
          Brak wpisów w historii zmian
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" sx={{ mt: 1 }}>
          Nie znaleziono rewizji spełniających kryteria filtrowania
        </Typography>
      </Card>
    );
  }

  // Grupuj rewizje po dacie
  const groupedByDate = revisions.reduce((groups, revision) => {
    const date = formatTimestamp(revision.revisionTimestamp).date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(revision);
    return groups;
  }, {});

  return (
    <Box sx={{ position: 'relative' }}>
      {Object.entries(groupedByDate).map(([date, dateRevisions], groupIndex) => (
        <Fade in={true} timeout={300 + groupIndex * 100} key={date}>
          <Box sx={{ mb: 6 }}>
            {/* Date Separator */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              gap: 2
            }}>
              <Divider 
                sx={{ 
                  flex: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1
                }} 
              />
              <Card elevation={4} sx={{
                background: theme.palette.card.header,
                border: theme.palette.card.border,
                px: 3,
                py: 1.5,
                borderRadius: 3,
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="700"
                  sx={{ 
                    color: 'white',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem'
                  }}
                >
                  {date}
                </Typography>
              </Card>
              <Divider 
                sx={{ 
                  flex: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: 1
                }} 
              />
            </Box>

            {/* Timeline Container */}
            <Box sx={{ position: 'relative', pl: { xs: 2, md: 8 } }}>
              {/* Vertical Line */}
              <Box sx={{
                position: 'absolute',
                left: { xs: '8px', md: '32px' },
                top: 0,
                bottom: 0,
                width: '3px',
                background: 'linear-gradient(180deg, rgba(76, 175, 80, 0.6) 0%, rgba(76, 175, 80, 0.1) 100%)',
                borderRadius: '2px',
              }} />

              {/* Revision Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {dateRevisions.map((revision, index) => {
                  const isSelected = selectedRevision?.revisionNumber === revision.revisionNumber;
                  
                  return (
                    <Fade 
                      in={true} 
                      timeout={500 + index * 150} 
                      key={revision.revisionNumber}
                    >
                      <Box 
                        sx={{ 
                          position: 'relative',
                          pl: { xs: 3, md: 4 }
                        }}
                      >
                        {/* Timeline Dot */}
                        <Box sx={{
                          position: 'absolute',
                          left: { xs: '-4px', md: '24px' },
                          top: '28px',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {/* Outer glow ring */}
                          {isSelected && (
                            <Box sx={{
                              position: 'absolute',
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                                '50%': {
                                  transform: 'scale(1.3)',
                                  opacity: 0.5,
                                },
                                '100%': {
                                  transform: 'scale(1)',
                                  opacity: 1,
                                },
                              },
                            }} />
                          )}
                          
                          {/* Main dot */}
                          <CircleIcon sx={{
                            fontSize: 18,
                            color: isSelected ? '#4caf50' : 'rgba(255, 255, 255, 0.5)',
                            filter: isSelected 
                              ? 'drop-shadow(0 0 6px rgba(76, 175, 80, 0.8))' 
                              : 'none',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            zIndex: 1,
                          }} />
                        </Box>

                        {/* Connector line to card (optional visual enhancement) */}
                        <Box sx={{
                          position: 'absolute',
                          left: { xs: '6px', md: '34px' },
                          top: '28px',
                          width: { xs: '20px', md: '24px' },
                          height: '2px',
                          background: isSelected 
                            ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.6) 0%, rgba(76, 175, 80, 0.1) 100%)'
                            : 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          zIndex: 1,
                        }} />

                        {/* Revision Card */}
                        <RevisionCard
                          revision={revision}
                          onClick={() => onRevisionSelect(revision)}
                          isSelected={isSelected}
                        />
                      </Box>
                    </Fade>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Fade>
      ))}

      {/* Timeline End Indicator */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mt: 4,
          pl: { xs: 2, md: 8 }
        }}>
          <Divider 
            sx={{ 
              flex: 1, 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderStyle: 'dashed',
            }} 
          />
          <Typography 
            variant="caption" 
            color="rgba(255, 255, 255, 0.5)"
            sx={{ 
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 600
            }}
          >
            Koniec historii
          </Typography>
          <Divider 
            sx={{ 
              flex: 1, 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderStyle: 'dashed',
            }} 
          />
        </Box>
      </Fade>
    </Box>
  );
};

export default DietAuditTimeline;