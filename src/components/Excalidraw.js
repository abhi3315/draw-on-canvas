import React from "react";
import { useParams, useHistory } from "react-router";
import Excalidraw from "@excalidraw/excalidraw";
import { exportToBlob } from "@excalidraw/excalidraw";
import firebase, { storage } from "../firebase";
import { getFileBlob } from "../utils/blob.utils";

const SAVE_DELAY_MS = 10000;

function ExcalidrawComponent({ initialData, setIsSaving, autoSave }) {
  const { drawSessionId } = useParams();
  const history = useHistory();
  const excalidrawRef = React.useRef();

  React.useEffect(() => {
    console.log(history);
    if (!drawSessionId) {
      const drawSessionId = new Date().getTime().toString(36);
      history.replace(`/${drawSessionId}`);
    }
  }, [drawSessionId, history]);

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
          setIsSaving(false);
          storage
            .ref("images")
            .child(imageName)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              console.log(fireBaseUrl);
            });
        },
      });
    });
  }, [drawSessionId, setIsSaving]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (autoSave) uploadCanvas();
    }, SAVE_DELAY_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which it clears interval to prevent memory leaks.
  }, [autoSave, uploadCanvas]);

  return (
    <div className="excalidraw-wrapper">
      <Excalidraw
        onCollabButtonClick={() =>
          window.alert("Collab feature is not available")
        }
        ref={excalidrawRef}
        initialData={initialData}
      />
    </div>
  );
}

export default ExcalidrawComponent;
