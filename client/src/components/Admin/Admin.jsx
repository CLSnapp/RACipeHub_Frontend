import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
} from "./AdminSlice";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import React from "react";

export default function Admin() {
  const { data, isSuccess, isLoading, error } = useGetUsersQuery();
  const { id } = useParams();
  const [deleteUser] = useDeleteUserMutation(id);
  const [updateUser] = useUpdateUserAdminMutation();
  const [userArr, setUserArr] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 20;

  useEffect(() => {
    if (isSuccess) {
      const sortedUsers = [...data].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );

      setUserArr(sortedUsers);
    }
  }, [data, isSuccess]);

  const filterUsers = userArr.filter((user) => {
    const isSearchMatch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const isRoleMatch = selectedRole ? user.role === selectedRole : true;

    return isSearchMatch && isRoleMatch;
  });

  console.log("Filtered Users Count:", filterUsers.length);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    console.log("Selected Role:", e.target.value); // Log role selection
  };

  const token = window.sessionStorage.getItem("token");
  console.log("Here is my token", token);

  const [expandUser, setExpandUser] = useState(null);

  const toggleUserDetails = (userId) => {
    if (expandUser === userId) {
      setExpandUser(null);
    } else {
      setExpandUser(userId);
    }
  };

  const handleClickEdit = (user) => {
    setEditUser(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Form Data before saving:", formData);
    try {
      await updateUser({ id: editUser, ...formData }).unwrap();
      setUserArr((prev) => {
        const updatedUsers = prev.map((user) =>
          user.id === editUser ? { ...user, ...formData } : user
        );
        return updatedUsers.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
      });

      setEditUser(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteUser({ id });
        const updatedUsers = userArr.filter((item) => item.id !== id);
        setUserArr(updatedUsers);
        alert("User deleted.");
        console.log(`Deleting item with ID: ${id}`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    } else {
      console.log("Deletion cancelled.");
    }
  };

  const indexOfLastUser = (currentPage + 1) * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filterUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          <h3>Admin Dashboard</h3>
          <hr />
          {/* <p style={{ wordWrap: "break-word" }}>Token: {token}</p> */}

          <h1 className="display-6">User List</h1>
          {error && (
            <div className="alert alert-danger" role="alert">
              Error loading users...
            </div>
          )}
          <div
            className="mb-3"
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "space-between",
            }}
          >
            <span>
              Search by name or email:
              <input
                className="form-control"
                type="text"
                size="40"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </span>
            <br />
            <span>
              Filter by role:
              <select
                className="form-select"
                value={selectedRole}
                onChange={handleRoleChange}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </span>
          </div>
          <table className="table table-striped">
            <tbody>
              {currentUsers?.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <th
                      scope="row"
                      onClick={() => toggleUserDetails(user.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.firstName} {user.lastName}
                    </th>

                    <td style={{ minWidth: "150px", textAlign: "right" }}>
                      <button
                        onClick={() => toggleUserDetails(user.id)}
                        className="button-details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>

                  {expandUser === user.id && (
                    <tr>
                      <td colSpan="4">
                        <div className="dropdown-content">
                          {editUser === user.id ? (
                            <div>
                              <label>First Name:</label>
                              <input
                                className="form-control"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                              />
                              <label>Last Name:</label>
                              <input
                                className="form-control"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                              />
                              <label>Email:</label>
                              <input
                                className="form-control"
                                type="email"
                                name="email"
                                size="30"
                                value={formData.email}
                                onChange={handleChange}
                              />

                              {/* Role Dropdown - In the form fields */}
                              <label>Role:</label>
                              <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                              >
                                {" "}
                                {formData.role === "USER" ? (
                                  <>
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                  </>
                                )}
                              </select>

                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  gap: "15px",
                                }}
                              >
                                <button
                                  onClick={handleSave}
                                  className="button-details"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditUser(null)}
                                  className="button-details"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "15px",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  <p>
                                    <strong>Email:</strong> {user.email}
                                  </p>

                                  <p>
                                    <strong>Role:</strong> {user.role}
                                  </p>
                                  <p>
                                    <strong>User ID:</strong> {user.id}
                                  </p>
                                </span>

                                <span style={{ textAlign: "right" }}>
                                  <p>
                                    <strong>Recipes:</strong>{" "}
                                    {user.recipes.length}
                                  </p>
                                  <p>
                                    <strong>Reviews:</strong>{" "}
                                    {user.reviews.length}
                                  </p>
                                  <p>
                                    <strong>Comments:</strong>{" "}
                                    {user.comments.length}
                                  </p>
                                </span>
                              </div>
                              <div
                                style={{
                                  marginTop: "10px",
                                  display: "flex",
                                  gap: "15px",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  <Link
                                    to={`/admin-user-details/${user.id}`}
                                    className="button-details-alt"
                                    style={{ textDecoration: "none" }}
                                  >
                                    Content Overview
                                  </Link>
                                </span>

                                <span>
                                  <button
                                    onClick={() => handleClickEdit(user)}
                                    className="button-details"
                                  >
                                    Edit
                                  </button>
                                  &nbsp;&nbsp;
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="button-details"
                                  >
                                    Delete User
                                  </button>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <ul className="pagination justify-content-center mt-3">
            <li className="page-item">
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={Math.ceil(filterUsers.length / usersPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
