import React from "react";
import { MDBPagination, MDBPaginationItem, MDBBtn } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { setCurrentPage } from "../redux/features/tourSlice";

const Pagination = ({ currentPage, numberOfPages }) => {
  const dispatch = useDispatch();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= numberOfPages) {
      dispatch(setCurrentPage(page));
    }
  };

  if (numberOfPages <= 1) return null;

  return (
    <div className="mt-4">
      <MDBPagination center className="mb-0">
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-1" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            Première
          </MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-1" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </MDBBtn>
        </MDBPaginationItem>
        {Array.from({ length: numberOfPages }, (_, i) => i + 1).map((page) => (
          <MDBPaginationItem key={page} active={page === currentPage}>
            <MDBBtn
              rounded
              className="mx-1"
              onClick={() => handlePageChange(page)}
              color={page === currentPage ? "primary" : "light"}
            >
              {page}
            </MDBBtn>
          </MDBPaginationItem>
        ))}
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-1" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === numberOfPages}>
            Next
          </MDBBtn>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBBtn rounded className="mx-1" onClick={() => handlePageChange(numberOfPages)} disabled={currentPage === numberOfPages}>
            Dernière
          </MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
      <p className="text-center mt-2 fw-bold">Page {currentPage} sur {numberOfPages}</p>
    </div>
  );
};

export default Pagination;
