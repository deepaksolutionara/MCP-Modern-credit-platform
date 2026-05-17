import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const Announcement = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="announcement-banner">
      <Sparkles size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
      <div className="announcement-content">
        <span className="announcement-title">What's New — v2.7.3: Canonical 20-Event Integration Catalog</span>
        <span className="announcement-desc">Standardized 20-event onboarding integration catalog across all systems</span>
        <a href="#" className="announcement-link">View all changes →</a>
      </div>
      <button className="announcement-close" onClick={() => setVisible(false)}>
        <X size={14} />
      </button>
    </div>
  );
};

export default Announcement;
