import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import ExcalidrawComponent from "./components/Excalidraw";
import SavedCanvas from "./components/SavedCanvas";

export default function App() {
  const [initialState, setInitialState] = React.useState({});
  const [autoSave, setAutoSave] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  return (
    <>
      <Switch>
        <Route exact path="/saved-canvas">
          <SavedCanvas setInitialData={setInitialState} />
        </Route>
        <Route path="/:drawSessionId?">
          <Header
            isSaving={isSaving}
            setAutoSave={setAutoSave}
            autoSave={autoSave}
            theme={initialState?.appState?.theme || "dark"}
          />
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
