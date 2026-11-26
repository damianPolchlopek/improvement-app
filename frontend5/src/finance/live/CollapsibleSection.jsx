import React, { useState } from 'react';
import { Box, ButtonBase, Card, Collapse, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

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

  // Same surface as the live-prices bar above (elevation 2, rounded) so the page reads as
  // one set of panels.
  return (
    <Card elevation={2} sx={{ borderRadius: 3, px: 2, py: 1, textAlign: 'left' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 40 }}>
        <ButtonBase
          onClick={toggle}
          aria-expanded={open}
          sx={{ borderRadius: 1, px: 0.5, py: 0.5, mr: 'auto', gap: 0.5 }}
        >
          <ExpandMore
            sx={{
              transition: 'transform 0.2s',
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              color: 'text.secondary',
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </ButtonBase>
        {open && actions}
      </Box>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ pt: 1, pb: 1 }}>{children}</Box>
      </Collapse>
    </Card>
  );
}
