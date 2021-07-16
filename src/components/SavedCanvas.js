import React from "react";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";

function SavedCanvas({ setInitialData }) {
  const history = useHistory();
  const [documents, setDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const db = firebase.firestore();
    db.collection("data")
      .get()
      .then((docSnapshot) => {
        const documents = docSnapshot.docs.map((doc) => doc.data());
        setLoading(false);
        setDocuments(documents);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const editCanvas = ({ initialData, drawSessionId }) => {
    localStorage.setItem(drawSessionId, initialData);
    history.push(`/${drawSessionId}`);
  };

  if (loading)
    return (
      <section className="center-container">
        <div className="expand-loader loader" />
      </section>
    );

  if (!loading && !documents.length)
    return (
      <section className="center-container">
        <p>No saved canvas found!</p>
      </section>
    );

  return (
    <>
      <div className={`header light`}>
        <button className="view-saved-btn" onClick={() => history.push("/")}>
          Create New Canvas
        </button>
      </div>
      <div className="card-container">
        {documents.map((document, index) => (
          <section key={index} className="card">
            <section className="card-content">
              <img src={document.imgUrl} alt="canvas-img" />
              <div className="overlay">
                <button
                  className="view-saved-btn transparent-bg"
                  onClick={() => window.open(document.imgUrl)}
                >
                  Download
                </button>
                <button
                  className="view-saved-btn transparent-bg"
                  onClick={() => editCanvas(document)}
                >
                  Edit
                </button>
              </div>
            </section>
          </section>
        ))}
      </div>
    </>
  );
}

export default SavedCanvas;
