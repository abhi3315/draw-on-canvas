import React from "react";
import PropTypes from "prop-types";
import { useParams, useHistory } from "react-router";
import Excalidraw from "@excalidraw/excalidraw";
import { exportToBlob } from "@excalidraw/excalidraw";
import { debounce } from "lodash";
import firebase, { storage } from "../firebase";
import { getFileBlob } from "../utils/blob.utils";

const SAVE_DELAY_MS = 10000;

function ExcalidrawComponent({
  initialData,
  setIsSaving,
  autoSave,
  setInitialState,
}) {
  const { drawSessionId } = useParams();
  const history = useHistory();
  const excalidrawRef = React.useRef();

  React.useEffect(() => {
    if (!drawSessionId) {
      const drawSessionId = new Date().getTime().toString(36);
      history.replace(`/${drawSessionId}`);
    }
    const appState = JSON.parse(localStorage.getItem(drawSessionId));
    setInitialState(appState);
  }, [drawSessionId, history, setInitialState]);

  const uploadCanvas = React.useCallback(async () => {
    // get all scene elements
    const elements = excalidrawRef.current.getSceneElements();
    // convert canvas drawing to blob
    const blobObj = await exportToBlob({ elements });
    const imageFile = URL.createObjectURL(blobObj);
    getFileBlob(imageFile, (blob) => {
      setIsSaving(true);
      // create file name
      const imageName = drawSessionId + ".png";
      const uploadTask = storage.ref(`/images/${imageName}`).put(blob);
      //initiates the firebase side uploading
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, {
        error: (error) => {
          console.log(error);
          setIsSaving(false);
        },
        complete: () => {
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          storage
            .ref("images")
            .child(imageName)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              const db = firebase.firestore();
              db.collection("data")
                .doc(drawSessionId)
                .set({
                  imgUrl: fireBaseUrl,
                  drawSessionId,
                  initialData: JSON.stringify({
                    elements,
                    appState: { theme: initialData?.appState?.theme || "dark" },
                  }),
                });
              setIsSaving(false);
            })
            .catch((err) => {
              console.log(err);
              setIsSaving(false);
            });
        },
      });
    });
  }, [drawSessionId, initialData?.appState?.theme, setIsSaving]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (autoSave) uploadCanvas();
    }, SAVE_DELAY_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which it clears interval to prevent memory leaks.
  }, [autoSave, uploadCanvas]);

  const onChange = debounce((elements, appState) => {
    setInitialState({ elements, appState });
    localStorage.setItem(drawSessionId, JSON.stringify({ elements, appState }));
  }, 1);

  return (
    <div className="excalidraw-wrapper">
      <Excalidraw
        onCollabButtonClick={() =>
          window.alert("Collab feature is not available")
        }
        ref={excalidrawRef}
        initialData={{
          elements: initialData?.elements,
          appState: { theme: initialData?.appState?.theme || "dark" },
        }}
        onChange={onChange}
      />
    </div>
  );
}

Excalidraw.propTypes = {
  initialData: PropTypes.shape({}),
  setIsSaving: PropTypes.func,
  autoSave: PropTypes.bool,
  setInitialState: PropTypes.func,
};

export default ExcalidrawComponent;
