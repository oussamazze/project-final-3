import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCardGroup,
  MDBBtn,
  MDBIcon,
  MDBTooltip,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { likeTour } from "../redux/features/tourSlice";

const CardTour = ({ imageFile, description, title, tags, _id, name, likes }) => {
  const { user } = useSelector((state) => ({ ...state.auth }));
  const userId = user?.result?._id || user?.result?.googleId;
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.includes(_id));
  }, [_id]);

  const updateFavorites = () => {
    let storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (storedFavorites.includes(_id)) {
      storedFavorites = storedFavorites.filter((fav) => fav !== _id);
    } else {
      storedFavorites.push(_id);
    }
    localStorage.setItem("favorites", JSON.stringify(storedFavorites));
    setIsFavorite(!isFavorite);
  };

  const excerpt = (str) => (str.length > 45 ? str.substring(0, 45) + " ..." : str);

  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId) ? (
        <>
          <MDBIcon fas icon="thumbs-up" /> &nbsp;
          {likes.length > 2 ? (
            <MDBTooltip tag="a" title={`You and ${likes.length - 1} other people like this tour`}>
              {likes.length} Likes
            </MDBTooltip>
          ) : (
            `${likes.length} Like${likes.length > 1 ? "s" : ""}`
          )}
        </>
      ) : (
        <>
          <MDBIcon far icon="thumbs-up" /> &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }
    return (
      <>
        <MDBIcon far icon="thumbs-up" /> &nbsp;Like
      </>
    );
  };

  const handleLike = () => {
    if (!user?.result) return;
    dispatch(likeTour({ _id }));
  };

  return (
    <MDBCardGroup>
      <MDBCard
        className="h-100 mt-2 d-sm-flex shadow-sm"
        style={{
          maxWidth: "20rem",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          boxShadow: hovered ? "0px 8px 16px rgba(0,0,0,0.2)" : "0px 4px 8px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <MDBBtn
          style={{ position: "absolute", top: "10px", right: "10px", padding: "5px 10px" }}
          color="primary"
          onClick={() => navigator.clipboard.writeText(window.location.origin + `/tour/${_id}`)}
        >
          <MDBIcon fas icon="share" />
        </MDBBtn>
        <MDBCardImage
          src={imageFile}
          alt={title}
          position="top"
          style={{ maxWidth: "100%", height: "180px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
        />
        <div className="top-left" style={{ fontWeight: "bold", padding: "10px" }}>{name}</div>
        <MDBCardBody>
          <MDBCardTitle className="text-start">{title}</MDBCardTitle>
          <MDBCardText className="text-start">
            {excerpt(description)} <Link to={`/tour/${_id}`}>Read More</Link>
          </MDBCardText>
          <span className="text-start tag-card">
            {tags.map((tag) => (
              <Link key={tag} to={`/tours/tag/${tag}`} style={{ marginRight: "5px" }}>#{tag}</Link>
            ))}
          </span>
          <MDBBtn style={{ float: "right" }} tag="a" color="none" onClick={handleLike}>
            {!user?.result ? (
              <MDBTooltip title="Please login to like tour" tag="a">
                <Likes />
              </MDBTooltip>
            ) : (
              <Likes />
            )}
          </MDBBtn>
          <MDBBtn
            style={{ position: "absolute", bottom: "10px", left: "10px", padding: "5px 10px" }}
            color={isFavorite ? "danger" : "secondary"}
            onClick={updateFavorites}
          >
            <MDBIcon fas icon={isFavorite ? "heart" : "heart-broken"} />
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  );
};

export default CardTour;
