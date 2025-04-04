import React, { useState } from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { excerpt } from "./utility";

const RelatedTours = ({ relatedTours, tourId }) => {
  const [visibleTours, setVisibleTours] = useState(3);
  const [loading, setLoading] = useState(false);

  const loadMoreTours = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleTours((prev) => prev + 3);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {relatedTours && relatedTours.length > 0 ? (
        <>
          {relatedTours.length > 1 && <h4>Related Tours</h4>}
          <MDBRow className="row-cols-1 row-cols-md-3 g-4">
            {relatedTours
              .filter((item) => item._id !== tourId)
              .slice(0, visibleTours)
              .map((item) => (
                <MDBCol key={item._id}>
                  <MDBCard className="hover-shadow">
                    <Link to={`/tour/${item._id}`}>
                      <MDBCardImage
                        src={item.imageFile}
                        alt={item.title}
                        position="top"
                      />
                    </Link>
                    <span className="text-start tag-card">
                      {item.tags.map((tag, index) => (
                        <Link key={index} to={`/tours/tag/${tag}`}> #{tag}</Link>
                      ))}
                    </span>
                    <MDBCardBody>
                      <MDBCardTitle className="text-start">{item.title}</MDBCardTitle>
                      <MDBCardText className="text-start">
                        {excerpt(item.description, 45)}
                      </MDBCardText>
                      <p className="text-muted small">By {item.author || "Unknown"} • {new Date(item.date).toLocaleDateString()}</p>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))}
          </MDBRow>
          {visibleTours < relatedTours.length && (
            <div className="text-center mt-3">
              <MDBBtn onClick={loadMoreTours} disabled={loading}>
                {loading ? <MDBSpinner small /> : "Voir Plus"}
              </MDBBtn>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted">Aucun tour trouvé.</p>
      )}
    </>
  );
};

export default RelatedTours;