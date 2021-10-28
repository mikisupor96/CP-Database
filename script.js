// *On document load
$(document).ready(() => {
  // remove preloader
  $("body div:first-child").removeAttr("id");

  // Prevent form resubmit //
  $("form").submit(() => {
    return false;
  });

  // populate department section
  populateFields(
    "populateFields.php",
    "#departmentName",
    ".department-select",
    "department"
  );

  // populate location section
  populateFields(
    "populateFields.php",
    "#locationOfDepartment",
    "#editLocationOfDepartment",
    "location"
  );

  // Render all personnel
  renderPersonnel();
});

// *Action on user search
$("#searchButton").click(function () {
  const select = $("#searchOption").val();
  const value = $("#searchBox").val();

  $("#searchBox").val("");

  if (select === "personnel") {
    value !== "" ? renderPersonnel(value) : renderPersonnel();
  } else if (select === "department") {
    value !== "" ? renderDepartments(value) : renderDepartments();
  } else if (select === "location") {
    value !== "" ? renderDepartments(value) : renderLocations();
  }
});

$("#addButton").click(() => {
  $("#addUserModal").each(function () {
    $(this).find(":input").val("");
  });
});

// *Category change
$("#searchOption").change(function () {
  const select = $(this).val();
  const addButton = $("#addButton");

  if (select === "personnel") {
    $("#addButton").click(() => {
      $("#addUserModal").each(function () {
        $(this).find(":input").val("");
      });
    });
    addButton.attr("data-target", "#addUserModal");
    renderPersonnel();
  } else if (select === "department") {
    $("#addButton").click(() => {
      $("#addDepartmentModal").each(function () {
        $(this).find(":input").val("");
      });
    });
    addButton.attr("data-target", "#addDepartmentModal");
    renderDepartments();
  } else if (select === "location") {
    $("#addButton").click(() => {
      $("#addLocationModal").each(function () {
        $(this).find(":input").val("");
      });
    });
    addButton.attr("data-target", "#addLocationModal");
    renderLocations();
  }
});

// *Populate select fields
function populateFields(type, name, select, data) {
  ajaxRequest(`./libs/php/${type}`, { type: data }, (result) => {
    result["data"].forEach((el) => {
      $(name).append(new Option(el["name"], el["id"]));
      $(select).append(new Option(el["name"], el["id"]));
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

function messageModal(title, message, type, hide) {
  $(hide).modal("hide");
  $("#messageModal h4").html(title);
  $("#messageModal p").html(message);
  $("#messageModal .modal-content").addClass(
    `alert alert-${type ? "success" : "danger"}`
  );
  $("#messageModal .modal-content").removeClass(
    `alert alert-${type ? "danger" : "success"}`
  );
  $("#messageModal").modal("show");
}

// *Render Personnel
function renderPersonnel(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "personnel",
    },
    (result) => {
      // *Clear prev result
      $(".result").empty();

      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          // TODO: Add programatical way https://www.valentinog.com/blog/html-table/
          $(".result").append(`
            <div class="card">
              <div class="card-body ">
                <h5 class="card-title">${el["firstName"]} ${el["lastName"]}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${el["location"]}</h6>
                <p class="card-text">${el["department"]}</p>
                <a href="#" class="card-link">${el["email"]}</a>
                <button class="btn btn-danger btn-sm float-right delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                  <img src="./assets/Images/delete.svg" alt="delete button" />
                </button>
                <button class="btn btn-success btn-sm float-right mr-1 edit" data-toggle="modal" data-target="#editUserModal" data-id=${el["id"]}>
                  <img src="./assets/Images/edit.svg" alt="edit button" />
                </button>
              </div>
            </div>
          `);
        });
      } else {
        messageModal(
          `User not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // *Edit
      $(".edit").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "personnel",
          },
          (result) => {
            const firstNameDom = $("#editUserModal").find("#editFirstName");
            const lastNameDom = $("#editUserModal").find("#editLastName");
            const emailDom = $("#editUserModal").find("#editEmail");
            const departmentDom =
              $("#editUserModal").find(".department-select");
            const firstName = result["data"]["firstName"];
            const lastName = result["data"]["lastName"];

            firstNameDom.val(firstName);
            lastNameDom.val(lastName);
            emailDom.val(result["data"]["email"]);
            departmentDom.val(result["data"]["departmentID"]);

            $(".editUser").submit(() => {
              const newFirstName = firstNameDom.val();
              const newLastName = lastNameDom.val();
              const newEmail = emailDom.val();
              const newDepartment = departmentDom.val();

              ajaxRequest(
                "./libs/php/edit.php",
                {
                  id: id,
                  type: "personnel",
                  newFirstName: newFirstName,
                  newLastName: newLastName,
                  newEmail: newEmail,
                  newDepartment: newDepartment,
                },
                (result) => {
                  if (result["data"]) {
                    messageModal(
                      `User edited successfully!`,
                      `User's <b>${firstName} ${lastName}</b> details sucessfully changed.`,
                      true,
                      "#editUserModal"
                    );
                    renderPersonnel();
                  } else {
                    messageModal(
                      `Error!`,
                      `User's <b>${firstName} ${lastName}</b> details could not be changed.`,
                      false,
                      "#editUserModal"
                    );
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".delete").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "personnel",
          },
          (result) => {
            const firstName = result["data"]["firstName"];
            const lastName = result["data"]["lastName"];

            $(".yesDelete")
              .unbind() // make sure click event only runs once
              .click(() => {
                ajaxRequest(
                  "./libs/php/delete.php",
                  {
                    id: id,
                    type: "personnel",
                  },
                  () => {
                    messageModal(
                      `Success!`,
                      `User's <b>${firstName} ${lastName}</b> details sucessfully deleted.`,
                      true,
                      "#deleteModal"
                    );
                    $(this).parent().parent().remove();
                  }
                );
              });
          }
        );
      });
    }
  );

  // *Add
  $("#addUser")
    .unbind()
    .click(function () {
      const firstName = $("#firstName").val();
      const lastName = $("#lastName").val();
      const email = $("#email").val();
      const department = $(".department-select").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "personnel",
          firstName: firstName,
          lastName: lastName,
          email: email,
          department: department,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `User added!`,
              `User <b>${firstName} ${lastName}</b> sucessfully added!`,
              true,
              "#addUserModal"
            );
            renderPersonnel();
          } else {
            messageModal(
              `Error!`,
              `User <b>${firstName} ${lastName}</b> cannot be added!`,
              false,
              "#addUserModal"
            );
          }
        }
      );
    });
}

// *Render Departments
function renderDepartments(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "department",
    },
    (result) => {
      // *Clear prev result
      $(".result").empty();

      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
              <div class="card">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <button class="btn btn-danger btn-sm float-right delete" data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                  <button class="btn btn-success btn-sm float-right edit mr-1" data-toggle="modal" data-target="#editDepModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
              </div>
              </div>
        `);
        });
      } else {
        messageModal(
          `Department not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // *Edit
      $(".edit").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "department",
          },
          (result) => {
            const departmentDom = $("#editDepModal").find(
              "#editDepartmentName"
            );
            const locationDom = $("#editDepModal").find(
              "#editLocationOfDepartment"
            );
            const department = result["data"]["name"];

            departmentDom.val(department);
            locationDom.val(result["data"]["locationID"]);

            $(".editDep").submit(() => {
              const newDepartment = departmentDom.val();
              const newLocation = locationDom.val();

              ajaxRequest(
                "./libs/php/edit.php",
                {
                  id: id,
                  type: "department",
                  newDepartment: newDepartment,
                  newLocation: newLocation,
                },
                (result) => {
                  if (result["data"]) {
                    messageModal(
                      `Department edited successfully!`,
                      `Department's <b>${department}</b> details sucessfully changed.`,
                      true,
                      "#editDepModal"
                    );
                    renderDepartments();
                  } else {
                    messageModal(
                      `Error!`,
                      `Department's <b>${department}</b> details could not be changed.`,
                      false,
                      "#editDepModal"
                    );
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".delete").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "department",
          },
          (result) => {
            const department = result["data"]["name"];

            ajaxRequest(
              "./libs/php/checkNumber.php",
              {
                id: id,
                type: "department",
              },
              (result) => {
                if (result["data"]["pc"] === "0") {
                  $(".yesDelete")
                    .unbind()
                    .click(() => {
                      ajaxRequest(
                        "./libs/php/delete.php",
                        {
                          id: id,
                          type: "department",
                        },
                        () => {
                          messageModal(
                            `Success!`,
                            `Department's <b>${department}</b> details sucessfully deleted.`,
                            true,
                            "#deleteModal"
                          );

                          $(this).parent().parent().remove();
                        }
                      );
                    });
                } else {
                  messageModal(
                    `Error!`,
                    `Cannot delete <b>${department}</b> please remove the remaining <b>${result["data"]["pc"]}</b> users first.`,
                    false,
                    "#deleteModal"
                  );
                }
              }
            );
          }
        );
      });
    }
  );

  // *Add
  $("#addDepartment")
    .unbind()
    .click(function () {
      const locationID = $("#locationOfDepartment").val();
      const department = $("#departmentName").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "department",
          department: department,
          locationID: locationID,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `Department added!`,
              `Department <b>${department}</b> sucessfully added!`,
              true,
              "#addDepartmentModal"
            );
            renderDepartments();
          } else {
            messageModal(
              `Error!`,
              `Department <b>${department}</b> cannot be added!`,
              false,
              "#addDepartmentModal"
            );
          }
        }
      );
    });
}

// *Render Locations
function renderLocations(value) {
  ajaxRequest(
    "./libs/php/get.php",
    {
      value: value,
      type: "location",
    },
    (result) => {
      // *Clear prev result
      $(".result").empty();

      // *Get
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
              <div class="card">
              <div class="card-body ">
                  <p class="card-text">${el["name"]} </p>
                  <button class="btn btn-danger btn-sm float-right removeLoc " data-toggle="modal" data-target="#deleteModal" data-id=${el["id"]}>
                    <img src="./assets/Images/delete.svg" alt="delete button" />
                  </button>
                  <button class="btn btn-success btn-sm float-right mr-1 editLocButton" data-toggle="modal" data-target="#editLocModal" data-id=${el["id"]}>
                    <img src="./assets/Images/edit.svg" alt="edit button" />
                  </button>
              </div>
              </div>
        `);
        });
      } else {
        messageModal(
          `Location not found!`,
          `Could not find <b>${value}</b>, please try again.`,
          false
        );
      }

      // *Edit
      $(".editLocButton").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "location",
          },
          (result) => {
            const locationDom = $("#editLocModal").find("#editLocationName");
            const location = result["data"]["name"];

            locationDom.val(location);

            $(".editLoc").submit(() => {
              const newLocation = locationDom.val();

              ajaxRequest(
                "./libs/php/edit.php",
                {
                  id: id,
                  type: "location",
                  newLocation: newLocation,
                },
                (result) => {
                  if (result["data"]) {
                    messageModal(
                      `Location edited successfully!`,
                      `Location's <b>${location}</b> details sucessfully changed.`,
                      true,
                      "#editLocModal"
                    );
                    renderLocations();
                  } else {
                    messageModal(
                      `Error!`,
                      `Location's <b>${location}</b> details could not be changed.`,
                      false,
                      "#editLocModal"
                    );
                  }
                }
              );
            });
          }
        );
      });

      // *Delete
      $(".removeLoc").click(function () {
        const id = $(this).attr("data-id");

        ajaxRequest(
          "./libs/php/searchById.php",
          {
            id: id,
            type: "location",
          },
          (result) => {
            const location = result["data"]["name"];

            ajaxRequest(
              "./libs/php/checkNumber.php",
              {
                id: id,
                type: "location",
              },
              (result) => {
                if (result["data"]["dc"] === "0") {
                  $(".yesDelete")
                    .unbind()
                    .click(() => {
                      ajaxRequest(
                        "./libs/php/delete.php",
                        {
                          id: id,
                          type: "location",
                        },
                        () => {
                          messageModal(
                            `Success!`,
                            `Location's <b>${location}</b> details sucessfully deleted.`,
                            true,
                            "#deleteModal"
                          );

                          $(this).parent().parent().remove();
                        }
                      );
                    });
                } else {
                  messageModal(
                    `Error!`,
                    `Cannot delete <b>${location}</b> please remove the remaining <b>${result["data"]["dc"]}</b> departments first.`,
                    false,
                    "#deleteModal"
                  );
                }
              }
            );
          }
        );
      });
    }
  );
  // *Add
  $("#addLocation")
    .unbind()
    .click(function () {
      const location = $("#locationName").val();

      ajaxRequest(
        "./libs/php/add.php",
        {
          type: "location",
          location: location,
        },
        (result) => {
          if (result["data"]) {
            messageModal(
              `Location added!`,
              `Location <b>${location}</b> sucessfully added!`,
              true,
              "#addLocationModal"
            );
            renderLocations();
          } else {
            messageModal(
              `Error!`,
              `Location <b>${location}</b> cannot be added!`,
              false,
              "#addLocationModal"
            );
          }
        }
      );
    });
}
