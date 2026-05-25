import React from "react";
import { FileText, Download } from "lucide-react";

const Header = ({ icon, csvIcon, xlsxIcon, topic, label }) => {
  return (
    <div className="chr-page-header">
      <div className="chr-header-left">
        <div className="chr-header-icon">
          {icon}
        </div>

        <div>
          <div className="chr-page-title">{topic}</div>
          <div className="chr-page-sub">{label}</div>
        </div>
      </div>

      <div className="chr-export-btns">
        <button className="chr-btn-csv">
          {csvIcon}
          CSV
        </button>

        <button className="chr-btn-xlsx">
         {xlsxIcon}
          XLSX
        </button>
      </div>
    </div>
  );
};

export default Header;