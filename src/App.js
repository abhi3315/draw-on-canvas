import React from "react";
import { Switch, Route } from "react-router-dom";
import ExcalidrawComponent from "./components/Excalidraw";

const initialAppState = {
  theme: "dark",
};

export default function App() {
  const [appState, setAppState] = React.useState(initialAppState);
  const [autoSave, setAutoSave] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <Switch>
      <Route path="/:drawSessionId?">
        {isSaving ? "Saving" : "saved"}
        <ExcalidrawComponent
          initialData={{ appState }}
          setIsSaving={setIsSaving}
          autoSave={autoSave}
        />
      </Route>
    </Switch>
  );
}
