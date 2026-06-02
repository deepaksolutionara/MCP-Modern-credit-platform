/**
 * DirectionIcon.jsx
 *
 * Renders an outbound (↗) or inbound (↙) arrow for communication direction.
 *
 * Props:
 *   direction – 'out' | 'in'
 *   size      – icon size in px (default: 13)
 */

import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DirectionIcon({ direction, size = 13 }) {
  return direction === 'out'
    ? <ArrowUpRight  size={size} className="comm-dir-out" />
    : <ArrowDownLeft size={size} className="comm-dir-in"  />;
}
