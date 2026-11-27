import React, { useState } from 'react';
import { Box, ButtonBase, Collapse, Typography } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

import { surfaceSx, HAIRLINE } from '../../food/component/foodStyles';

const STORAGE_PREFIX = 'finance.live.section.';

function readOpen(id, fallback) {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + id);
    return stored === null ? fallback : stored === 'true';
  } catch {
    return fallback;
  }
}

function writeOpen(id, open) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, String(open));
  } catch {
    // Storage may be unavailable (private mode); the section still works, just isn't remembered.
  }
}

/**
 * A titled section that collapses its content. Closed by default; the last state is
 * remembered per browser. Content is unmounted while closed, so heavy TradingView iframes
 * only load once the section is opened.
 */
export default function CollapsibleSection({ id, title, actions, defaultOpen = false, children }) {
  const [open, setOpen] = useState(() => readOpen(id, defaultOpen));

  const toggle = () => {
    setOpen((prev) => {
      writeOpen(id, !prev);
      return !prev;
    });
  };

  // Ta sama płaska powierzchnia co pasek notowań i nagłówek, więc strona czyta się jako
  // jeden zestaw paneli (jak w module food).
  return (
    <Box component="section" sx={{ ...surfaceSx, textAlign: 'left' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minHeight: 52,
          pr: 2,
          borderBottom: open ? HAIRLINE : 0,
        }}
      >
        <ButtonBase
          onClick={toggle}
          aria-expanded={open}
          sx={{
            flex: 1,
            justifyContent: 'flex-start',
            alignSelf: 'stretch',
            px: 2,
            gap: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
          }}
        >
          <Typography component="h2" sx={{ fontWeight: 500, mr: 'auto' }}>
            {title}
          </Typography>
          <KeyboardArrowDown
            sx={{
              transition: 'transform 200ms',
              transform: open ? 'rotate(180deg)' : 'none',
              color: 'text.secondary',
            }}
          />
        </ButtonBase>
        {open && actions}
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}
