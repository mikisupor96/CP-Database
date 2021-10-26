// *On document load
$(document).ready(() => {
  // Prevent form resubmit //
  $("form").submit(() => {
    return false;
  });

  // populate department section
  populateDepartments();

  // populate location section
  populateLocations();

  // Render all personnel
  renderPersonnel();
});

//* Action on user search
$("#searchButton").click(() => {
  const select = $("#searchOption").val();
  const value = $("#searchBox").val();
  const result = $(".result");

  // Clear everything on change
  $("#searchOption").change(() => {
    result.empty();
  });

  // Clear previous result
  result.empty();

  // Reset value of search bar
  $("#searchBox").val("");

  if (select === "personnel") {
    value !== "" ? renderPersonnel(value) : renderPersonnel();
  } else if (select === "departments") {
    value !== "" ? renderDepartments(value) : renderDepartments();
  } else if (select === "locations") {
    value !== "" ? renderLocations(value) : renderLocations();
  }
});

//* Category change
$("#searchOption").change(function () {
  const select = $(this).val();
  if (select === "personnel") {
    $("#addButton").attr("data-target", "#addUserModal");
    $(".result").empty();
    renderPersonnel();
  } else if (select === "departments") {
    $("#addButton").attr("data-target", "#addDepartmentModal");
    $(".result").empty();
    renderDepartments();
  } else if (select === "locations") {
    $("#addButton").attr("data-target", "#addLocationModal");
    $(".result").empty();
    renderLocations();
  }
});

// *Populate location field
function populateLocations() {
  ajaxRequest("./libs/php/getAllLocations.php", "", (result) => {
    result["data"].forEach((el) => {
      $("#locationOfDepartment").append(new Option(el["name"], el["id"]));
      $("#editLocationOfDepartment").append(new Option(el["name"], el["id"]));
    });
  });
}

// *Populate department field
function populateDepartments() {
  ajaxRequest("./libs/php/getDepartments.php", "", (result) => {
    result["data"].forEach((el) => {
      $("#departmentName").append(new Option(el["name"], el["id"]));
      $(".department-select").append(new Option(el["name"], el["id"]));
    });
  });
}

// *Blueprint for all ajax requests
function ajaxRequest(url, data, code) {
  $.ajax({
    url: url,
    type: `GET`,
    dataType: `json`,
    data: data,
    success: (result) => {
      code(result);
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
}

// *Render Personnel
function renderPersonnel(value) {
  ajaxRequest(
    "./libs/php/getPersonnel.php",
    {
      value: value,
    },
    (result) => {
      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card">
              <div class="card-body ">
                <h5 class="card-title">${el["firstName"]} ${el["lastName"]}</h5>
                <p class="card-text">${el["location"]}</p>
                <p class="card-text">${el["department"]}</p>
                <p class="card-text d-inline-flex">${el["email"]}</p>
                <button class="btn btn-danger btn-sm float-right delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                  <img src="./assets/Images/delete.svg" alt="delete button" />
                </button>
                <button class="btn btn-success btn-sm float-right mr-1 edit" data-toggle="modal" data-target="#editUserModal" data-id=${el["id"]}>
                  <img src="./assets/Images/edit.svg" alt="edit button" />
                </button>
              </div>
            </div>
          `);
          // $(".result").append(
          //   $("<div></div>")
          //     .addClass("card")
          //     .append(
          //       $("<div></div>")
          //         .addClass("card-body")
          //         .append(
          //           $("<h5></h5>")
          //             .addClass("card-title")
          //             .html(`${el["firstName"]} ${el["lastName"]}`)
          //         )
          //         .append(
          //           $("<p></p>").addClass("card-text").html(`${el["location"]}`)
          //         )
          //         .append(
          //           $("<p></p>")
          //             .addClass("card-text")
          //             .html(`${el["department"]}`)
          //         )
          //         .append(
          //           $("<p></p>").addClass("card-text").html(`${el["email"]}`)
          //         )
          //         .append(
          //           $("<button></button>")
          //             .addClass("btn btn-danger btn-sm float-right delete")
          //             .attr("data-toggle", "modal")
          //             .attr("data-target", "#deleteModal")
          //             .attr("data-id", `${el["id"]}`)
          //             .append(
          //               $("<img></img>")
          //                 .attr("src", "./assets/Images/delete.svg")
          //                 .attr("alt", "delete button")
          //             )
          //         )
          //         .append(
          //           $("<button></button>")
          //             .addClass("btn btn-success btn-sm float-right mr-1 edit")
          //             .attr("data-toggle", "modal")
          //             .attr("data-target", "#editUserModal")
          //             .attr("data-id", `${el["id"]}`)
          //             .append(
          //               $("<img></img>")
          //                 .attr("src", "./assets/Images/edit.svg")
          //                 .attr("alt", "edit button")
          //             )
          //         )
          //     )
          // );
        });
      } else {
        $("#errorTitle").html(`User/s not found!`);
        $("#errorMessage").html(
          `Could not find user/s matching the search criteria <b>"${value}"</b>, try searching by first name, last name, email, location or department.`
        );
        $("#errorModal").modal("show");
      }

      // *Edit
      $(".edit").click(function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
          },
          (result) => {
            const firstNameDom = $("#editUserModal").find("#editFirstName");
            const lastNameDom = $("#editUserModal").find("#editLastName");
            const emailDom = $("#editUserModal").find("#editEmail");
            const departmentDom =
              $("#editUserModal").find(".department-select");

            firstNameDom.val(result["data"]["firstName"]);
            lastNameDom.val(result["data"]["lastName"]);
            emailDom.val(result["data"]["email"]);
            departmentDom.val(result["data"]["departmentID"]);

            $(".editUser").submit(() => {
              const newFirstName = firstNameDom.val();
              const newLastName = lastNameDom.val();
              const newEmail = emailDom.val();
              const newDepartment = departmentDom.val();

              ajaxRequest(
                "./libs/php/editUser.php",
                {
                  id: id,
                  newFirstName: newFirstName,
                  newLastName: newLastName,
                  newEmail: newEmail,
                  newDepartment: newDepartment,
                },
                (result) => {
                  $(".alert").remove();

                  if (result["data"]) {
                    $(".editUser").prepend(`
                      <div class="alert alert-success" role="alert">
                        User's details changed successfully.
                      </div>
                    `);
                  } else {
                    $(".editUser").prepend(`
                      <div class="alert alert-danger" role="alert">
                        Something went wrong, please check your details.
                      </div>
                    `);
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".delete").on("click", function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        $(".yesDelete")
          .unbind() // make sure click event only runs once
          .click(() => {
            ajaxRequest(
              "./libs/php/deleteUser.php",
              {
                id: id,
              },
              () => {
                $(".deleteForm").prepend(`
                   <div class="alert alert-success" role="alert">
                     User deleted!
                   </div>
              `);
              }
            );
          });
      });
    }
  );

  // TODO: Change the way it checks user entered values
  // *Add
  $(".createUser").submit(() => {
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const email = $("#email").val();
    const department = $(".department-select").val();

    ajaxRequest(
      "./libs/php/addNewUser.php",
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        department: department,
      },
      (result) => {
        $(".alert").remove();

        console.log(result["data"]);

        if (result["data"]) {
          $(".createUser").prepend(`
            <div class="alert alert-success" role="alert">
              User, "${firstName}" sucessfully added!
            </div>
          `);
        } else {
          $(".createUser").prepend(`
            <div class="alert alert-danger" role="alert">
              First name, last name or email at least one must be unique!
            </div>
          `);
        }
      }
    );
  });
}

// *Render Departments
function renderDepartments(value) {
  ajaxRequest(
    "./libs/php/getDepartments.php",
    {
      value: value,
    },
    (result) => {
      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
              <div class="card">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <button class="btn btn-danger btn-sm float-right removeDep " data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                  <button class="btn btn-success btn-sm float-right editDepButton mr-1 " data-toggle="modal" data-target="#editDepModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
              </div>
              </div>
        `);
        });
      } else {
        $("#errorTitle").html(`Department/s not found!`);
        $("#errorMessage").html(
          `Could not find department/s matching the search criteria "${value}", please search by using current departments name.`
        );
        $("#errorModal").modal("show");
      }

      // *Edit
      $(".editDepButton").click(function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchByDepId.php",
          {
            id: id,
          },
          (result) => {
            const departmentDom = $("#editDepModal").find(
              "#editDepartmentName"
            );
            const locationDom = $("#editDepModal").find(
              "#editLocationOfDepartment"
            );

            departmentDom.val(result["data"]["name"]);
            locationDom.val(result["data"]["locationID"]);

            $(".editDep").submit(() => {
              const newDepartment = departmentDom.val();
              const newLocation = locationDom.val();

              ajaxRequest(
                "./libs/php/editDep.php",
                {
                  id: id,
                  newDepartment: newDepartment,
                  newLocation: newLocation,
                },
                (result) => {
                  $(".alert").remove();

                  if (result["data"]) {
                    $(".editDep").prepend(`
                      <div class="alert alert-success" role="alert">
                        Department details changed successfully.
                      </div>
                    `);
                  } else {
                    $(".editDep").prepend(`
                      <div class="alert alert-danger" role="alert">
                        Something went wrong, please check your details.
                      </div>
                    `);
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".removeDep").on("click", function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/checkDepartment.php",
          {
            id: id,
          },
          (result) => {
            if (result["data"]["pc"] === "0") {
              $(".deleteForm p").html(
                `Are you sure you want to delete this department?`
              );
              $(".deleteForm .modal-footer").removeClass("d-none");

              $(".yesDelete")
                .unbind() // make sure click event only runs once
                .click(() => {
                  ajaxRequest(
                    "./libs/php/deleteDepartment.php",
                    {
                      id: id,
                    },
                    () => {
                      $(".deleteForm").prepend(`
                        <div class="alert alert-success" role="alert">
                          Department deleted!
                        </div>
                      `);
                      $(this).parent().parent().remove();
                    }
                  );
                });
            } else {
              $(".deleteForm p").html(
                `Cannot delete department please remove the remaining ${result["data"]["pc"]} users first.`
              );
              $(".deleteForm .modal-footer").addClass("d-none");
            }
          }
        );
      });
    }
  );
  // TODO: Change the way it checks user entered values
  // *Add
  $(".createDepartment").submit(function () {
    const locationID = $("#locationOfDepartment").val();
    const department = $("#departmentName").val();

    ajaxRequest(
      "./libs/php/addNewDepartment.php",
      {
        department: department,
        locationID: locationID,
      },
      (result) => {
        $(".alert").remove();

        if (result["data"]) {
          $(".createDepartment").prepend(`
                <div class="alert alert-success" role="alert">
                  New department added!
                </div>
              `);
        } else {
          $(".createDepartment").prepend(`
              <div class="alert alert-danger" role="alert">
                Please make sure you add a unique department!
              </div>
            `);
        }
      }
    );
  });
}

// *Render Locations
function renderLocations(value) {
  ajaxRequest(
    "./libs/php/getLocations.php",
    {
      value: value,
    },
    (result) => {
      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
              <div class="card">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <button class="btn btn-danger btn-sm float-right removeDep " data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                  <button class="btn btn-success btn-sm float-right editLocButton mr-1 " data-toggle="modal" data-target="#editLocModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
              </div>
              </div>
        `);
        });
      } else {
        $("#errorTitle").html(`Department/s not found!`);
        $("#errorMessage").html(
          `Could not find location/s matching the search criteria "${value}", please search by using current departments name.`
        );
        $("#errorModal").modal("show");
      }

      // *Edit
      $(".editLocButton").click(function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchByLocId.php",
          {
            id: id,
          },
          (result) => {
            const locationDom = $("#editLocModal").find("#editLocationName");

            locationDom.val(result["data"]["name"]);

            $(".editLoc").submit(() => {
              const newLocation = locationDom.val();

              ajaxRequest(
                "./libs/php/editLoc.php",
                {
                  locationID: id,
                  newLocation: newLocation,
                },
                (result) => {
                  $(".alert").remove();

                  if (result["data"]) {
                    $(".editLoc").prepend(`
                      <div class="alert alert-success" role="alert">
                        Location details changed successfully.
                      </div>
                    `);
                  } else {
                    $(".editLoc").prepend(`
                      <div class="alert alert-danger" role="alert">
                        Something went wrong, please check your details.
                      </div>
                    `);
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".removeDep").on("click", function () {
        $(".alert").remove();

        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/checkLocation.php",
          {
            id: id,
          },
          (result) => {
            if (result["data"]["dc"] === "0") {
              $(".deleteForm p").html(
                `Are you sure you want to delete this location?`
              );
              $(".deleteForm .modal-footer").removeClass("d-none");

              $(".yesDelete")
                .unbind() // make sure click event only runs once
                .click(() => {
                  ajaxRequest(
                    "./libs/php/deleteLocation.php",
                    {
                      id: id,
                    },
                    () => {
                      $(".deleteForm").prepend(`
                        <div class="alert alert-success" role="alert">
                          Location deleted!
                        </div>
                      `);
                      $(this).parent().parent().remove();
                    }
                  );
                });
            } else {
              $(".deleteForm p").html(
                `Cannot delete location please remove the remaining ${result["data"]["dc"]} departments first.`
              );
              $(".deleteForm .modal-footer").addClass("d-none");
            }
          }
        );
      });
    }
  );
  // TODO: Change the way it checks user entered values
  // *Add
  $(".createLocation").submit(function () {
    // const location = $("#locationName").val();
    const location = $("#locationName").val();

    ajaxRequest(
      "./libs/php/addNewLocation.php",
      {
        location: location,
      },
      (result) => {
        $(".alert").remove();

        if (result["data"]) {
          $(".createLocation").prepend(`
                <div class="alert alert-success" role="alert">
                  ${location} added!
                </div>
              `);
        } else {
          $(".createLocation").prepend(`
              <div class="alert alert-danger" role="alert">
                Please make sure you add a unique department!
              </div>
            `);
        }
      }
    );
  });
}
