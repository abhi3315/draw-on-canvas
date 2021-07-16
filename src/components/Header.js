import React from "react";
import { useHistory } from "react-router";
import PropTypes from "prop-types";

function Header({ theme, isSaving, setAutoSave, autoSave }) {
  const history = useHistory();
  return (
    <div className={`header ${theme}`}>
      <button
        className="view-saved-btn"
        onClick={() => history.push("/saved-canvas")}
      >
        View Saved Canvas
      </button>
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
