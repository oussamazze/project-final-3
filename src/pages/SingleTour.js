import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardText, MDBCardImage, MDBContainer, MDBIcon, MDBBtn, MDBInput } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getRelatedTours, getTour, addComment, deleteComment } from "../redux/features/tourSlice";
import RelatedTours from "../components/RelatedTours";
import DisqusThread from "../components/DisqusThread";
import { toast } from "react-toastify";

const SingleTour = () => {
  const dispatch = useDispatch();
  const { tour, relatedTours } = useSelector((state) => ({ ...state.tour }));
  const { id } = useParams();
  const navigate = useNavigate();
  const tags = tour?.tags;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(tour?.comments || []);
  
  useEffect(() => {
    if (id) {
      dispatch(getTour(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (tags) {
      dispatch(getRelatedTours(tags));
    }
  }, [tags, dispatch]);

  useEffect(() => {
    setComments(tour?.comments || []);
  }, [tour?.comments]);

  const user = JSON.parse(localStorage.getItem("profile"));

  const handleAddComment = () => {
    if (comment.trim()) {
      if (!user?.result?.name) {
        alert("Vous devez être connecté pour commenter !");
        return;
      }

      const newComment = {
        userName: user.result.name,
        text: comment,
        createdAt: new Date(),
      };

      setComments([...comments, newComment]);

      dispatch(addComment({ id, comment })).then(() => {
        dispatch(getTour(id));
      });

      setComment("");
    }
  };

  const handleDeleteComment = (commentId) => {
    if (!user?.result?.name) {
      alert("Vous devez être connecté pour supprimer un commentaire !");
      return;
    }

    dispatch(deleteComment({ tourId: id, commentId, toast })).then(() => {
      dispatch(getTour(id));
    });
  };

  return (
    <MDBContainer>
      <MDBCard className="mb-3 mt-2">
        <MDBCardImage
          position="top"
          style={{ width: "100%", maxHeight: "600px" }}
          src={tour.imageFile}
          alt={tour.title}
        />
        <MDBCardBody>
          <MDBBtn
            tag="a"
            color="none"
            style={{ float: "left", color: "#000" }}
            onClick={() => navigate("/")}
          >
            <MDBIcon fas size="lg" icon="long-arrow-alt-left" style={{ float: "left" }} />
          </MDBBtn>
          <h3>{tour.title}</h3>
          <span>
            <p className="text-start tourName">Created By: {tour.name}</p>
          </span>
          <div style={{ float: "left" }}>
            <span className="text-start">
              {tour?.tags?.map((item) => `#${item} `)}
            </span>
          </div>
          <br />
          <MDBCardText className="text-start mt-2">
            <MDBIcon style={{ float: "left", margin: "5px" }} far icon="calendar-alt" size="lg" />
            <small className="text-muted">{moment(tour.createdAt).fromNow()}</small>
          </MDBCardText>
          <MDBCardText className="lead mb-0 text-start">{tour.description}</MDBCardText>

          {/* Section Commentaires */}
          <div className="mt-4">
            <h5>Commentaires :</h5>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <MDBCard
                  key={comment._id || Math.random()}
                  className="mt-2 p-4"
                  style={{
                    backgroundColor: "#f7f7f7",
                    borderRadius: "15px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease-in-out",
                    marginBottom: "20px",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div className="d-flex align-items-center">
                    {/* Avatar */}
                    <div className="me-3" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ddd" }}>
                      <MDBIcon fas icon="user" style={{ color: "#fff", fontSize: "20px", paddingTop: "10px" }} />
                    </div>

                    <div>
                      <MDBCardText style={{ fontWeight: "bold", fontSize: "1.1em", color: "#333" }}>
                        <strong>{comment.userName}</strong>
                      </MDBCardText>
                      <MDBCardText className="text-muted" style={{ fontSize: "0.9em" }}>
                        {moment(comment.createdAt).fromNow()}
                      </MDBCardText>
                      <MDBCardText style={{ fontSize: "1.1em", color: "#444" }}>
                        {comment.text}
                      </MDBCardText>
                    </div>

                    {user?.result?.name === comment.userName && (
                      <MDBBtn
                        size="sm"
                        color="danger"
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          borderRadius: "50%",
                          padding: "0.5rem",
                          transition: "background-color 0.3s",
                        }}
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <MDBIcon fas icon="trash" size="xs" />
                      </MDBBtn>
                    )}
                  </div>
                </MDBCard>
              ))
            ) : (
              <p>Aucun commentaire pour le moment.</p>
            )}
          </div>

          {/* Ajouter un commentaire */}
          <div className="mt-3">
            <MDBInput
              label="Ajouter un commentaire"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                borderRadius: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            />
            <MDBBtn
              className="mt-2"
              color="primary"
              onClick={handleAddComment}
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                transition: "background-color 0.3s, border-color 0.3s",
                padding: "12px 30px",
                borderRadius: "30px",
                marginTop: "10px",
              }}
            >
              <MDBIcon fas icon="comment" className="me-2" />
              Commenter
            </MDBBtn>
          </div>
        </MDBCardBody>
        <RelatedTours relatedTours={relatedTours} tourId={id} />
      </MDBCard>
      <DisqusThread id={id} title={tour.title} path={`/tour/${id}`} />
    </MDBContainer>
  );
};

export default SingleTour;
