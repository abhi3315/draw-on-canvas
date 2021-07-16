import React from "react";
import PropTypes from "prop-types";

function Header({ theme, isSaving, setAutoSave, autoSave }) {
  return (
    <div className={`header ${theme}`}>
      <p>Auto Save</p>
      {isSaving && <div className="loader"></div>}
      <label className="switch">
        <input
          type="checkbox"
          checked={autoSave}
          onChange={({ target }) => setAutoSave(target.checked)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

Header.propTypes = {
  theme: PropTypes.string,
  isSaving: PropTypes.bool,
  setAutoSave: PropTypes.func,
  autoSave: PropTypes.bool,
};

export default Header;
