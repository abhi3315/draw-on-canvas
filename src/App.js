import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import ExcalidrawComponent from "./components/Excalidraw";

export default function App() {
  const [initialState, setInitialState] = React.useState({});
  const [autoSave, setAutoSave] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <>
      <Header
        isSaving={isSaving}
        setAutoSave={setAutoSave}
        autoSave={autoSave}
        theme={initialState?.appState?.theme || "dark"}
      />
      <Switch>
        <Route path="/:drawSessionId?">
          <ExcalidrawComponent
            initialData={initialState}
            setIsSaving={setIsSaving}
            autoSave={autoSave}
            setInitialState={setInitialState}
          />
        </Route>
      </Switch>
    </>
  );
}
