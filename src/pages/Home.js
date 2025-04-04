import React, { useEffect, useContext } from "react";
import { MDBCol, MDBContainer, MDBRow, MDBTypography } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { getTours } from "../redux/features/tourSlice";
import CardTour from "../components/CardTour";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { tours, loading, currentPage, numberOfPages } = useSelector((state) => state.tour);
  const query = useQuery();
  const searchQuery = query.get("searchQuery");

  useEffect(() => {
    dispatch(getTours(currentPage));
  }, [dispatch, currentPage]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme === "dark" ? "#121212" : "#f5f5f5",
        color: theme === "dark" ? "#ffffff" : "#000000",
        padding: "20px 0",
      }}
    >
      <MDBContainer
        style={{
          backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.85)",
          borderRadius: "15px",
          padding: "25px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <MDBRow className="mt-3">
          <MDBTypography
            className="text-center mb-4"
            tag="h2"
            style={{
              color: theme === "dark" ? "#ffffff" : "#2c3e50",
              fontWeight: "600",
            }}
          >
            Bienvenue à Evopedia ! Partagez vos tours ici.
          </MDBTypography>

          {tours.length === 0 && (
            <MDBTypography className="text-center mb-4" tag="h2" style={{ color: theme === "dark" ? "#aaaaaa" : "#4b4b4d" }}>
              {searchQuery ? `No results for "${searchQuery}"` : "No Tours Found"}
            </MDBTypography>
          )}

          <MDBCol>
            <MDBContainer>
              <MDBRow className="row-cols-1 row-cols-md-3 g-4">
                {tours.map((item) => (
                  <div className="card-hover" key={item._id}>
                    <CardTour {...item} />
                  </div>
                ))}
              </MDBRow>
            </MDBContainer>
          </MDBCol>
        </MDBRow>

        {tours.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <Pagination currentPage={currentPage} numberOfPages={numberOfPages} />
          </div>
        )}
      </MDBContainer>
    </div>
  );
};

export default Home;
