import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardTour from "../components/CardTour";

const FavoriteTours = () => {
  const [favoriteTours, setFavoriteTours] = useState([]);
  const { tours } = useSelector((state) => state.tour);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Favoris dans localStorage :", storedFavorites);
    console.log("Tous les tours disponibles :", tours);

    if (tours.length > 0) {
      const filteredTours = tours.filter((tour) => storedFavorites.includes(tour._id));
      console.log("Tours filtrés :", filteredTours);
      setFavoriteTours(filteredTours);
    }
    setLoading(false);
  }, [tours]);

  return (
    <div className="container mt-4">
      <h2>Mes Favoris</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="row">
          {favoriteTours.length > 0 ? (
            favoriteTours.map((tour) => (
              <div key={tour._id} className="col-md-4 mb-4">
                <CardTour {...tour} />
              </div>
            ))
          ) : (
            <p>Aucun tour favori enregistré.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteTours;
