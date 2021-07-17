import getAll from "./libs/js/getAll.js";
import searchByFirstName from "./libs/js/searchByFirstName.js";
import searchByLastName from "./libs/js/searchByLastName.js";
import searchByEmail from "./libs/js/searchByEmail.js";
import searchByDepartment from "./libs/js/searchByDepartment.js";
import searchByLocation from "./libs/js/searchByLocation.js";
import getAllDepartments from "./libs/js/getAllDepartments.js";
import addNewUser from "./libs/js/addNewUser.js";
import deleteUser from "./libs/js/deleteUser.js";
import editUser from "./libs/js/editUser.js";

$(document).ready(() => {
  // Execute info modal
  $("#infoModal").modal({
    keyboard: true,
  });

  // toggle on off the department option
  $("#newDepBtn").click(function () {
    const btnHtml = $(this).html().trim();
    if (btnHtml === "+") {
      $(this).html("-");
    } else {
      $(this).html("+");
    }
    $("#departmentSelect").toggleClass("collapse");
    $("#addLocation").toggleClass("collapse");
  });

  // Prevent form resubmit //
  $("form").submit(() => {
    return false;
  });

  // Render options in departments
  (async () => {
    const result = await getAllDepartments();
    result["data"].forEach((el) => {
      $("#departmentSelect").append($("<option />").val(el).text(el));
    });
  })();
});

function createFeedback(value, inputDom, valid, invalid) {
  // feedback for server values

  if (value) {
    inputDom
      .removeClass("is-invalid")
      .addClass("is-valid")
      .after(`<div class='feedback valid-feedback'>${valid}</div>`);
  } else {
    inputDom
      .removeClass("is-valid")
      .addClass("is-invalid")
      .after(`<div class='feedback invalid-feedback'>${invalid}</div>`);
  }
}

function validateUserData(firstName, lastName, email, department, locationID) {
  (async () => {
    const validateData = await addNewUser(
      firstName,
      lastName,
      email,
      department,
      locationID
    );

    const { firstNameExist, lastNameExist, emailExist } = validateData;

    $(".feedback").remove();

    createFeedback(
      firstNameExist,
      $("#firstName"),
      "Valid first name!",
      "First name already taken!"
    );

    createFeedback(
      lastNameExist,
      $("#lastName"),
      "Valid last name!",
      "Last name already taken!"
    );

    createFeedback(
      emailExist,
      $("#email"),
      "Valid email!",
      "Email already taken!"
    );
  })();
}

// ----------------------------TEST----------------------------
// (() => {})();
// ----------------------------TEST----------------------------

// *Get data from add new user form
$(".createUser").submit(() => {
  $(".alert").remove();
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const email = $("#email").val();
  const locationID = $("#addLocation").val();
  let department = $("#departmentSelect").val();

  const depCondition = $("#newDepBtn").attr("aria-expanded");

  if (depCondition === "true") {
    department = $("#addDepartment").val();
  }

  validateUserData(firstName, lastName, email, department, locationID);
});

// Action on use search //
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

  // If the user leaves blank it means that he wants to see all users from specific select
  if (select === "Category" && !value) {
    render(getAll);
  } else if (select === "firstName") {
    render(searchByFirstName, value);
  } else if (select === "lastName") {
    render(searchByLastName, value);
  } else if (select === "email") {
    render(searchByEmail, value);
  } else if (select === "department") {
    render(searchByDepartment, value);
  } else if (select === "location") {
    render(searchByLocation, value);
  } else {
    errorHtml("Please select a search parameter!");
  }
});

// Render html //
const errorHtml = (message) => {
  $(".result").html(`
  <div class="alert alert-danger" role="alert">
    ${message}
  </div>
  `);
};

const generateHtml = (firstName, lastName, email, department, location) => {
  $(".result").append(`
    <div class="col">
      <div class="card">
        <div class="card-body ">
          <h5 class="card-title"><span>${firstName}</span> <span>${lastName}</span></h5>
          <p class="card-text">Location: <span>${location}</span></p>
          <p class="card-text">Department: <span>${department}</span></p>
          <p class="card-text d-inline-flex">Email: <span>${email}</span></p>
          <button class="btn btn-danger btn-sm float-right removeUser ">-</button>
          <button class="btn btn-success btn-sm float-right editUserButton mr-1 " 
                  data-toggle="modal"
                  data-target="#editUserModal">
                  ...
          </button>
        </div>
      </div>
    </div>
    `);
};

// Functionality //
const render = async (searchFunc, searchParam = null) => {
  try {
    const result = await searchFunc(searchParam);
    result.forEach((el) => {
      const { firstName, lastName, email, department, location } = el;
      generateHtml(firstName, lastName, email, department, location);
    });
  } catch (e) {
    errorHtml(`Could not find ${searchParam}.`);
  }

  $(".removeUser").on("click", function () {
    $(this).parent().parent().parent().remove();
    let result = [];
    $(this)
      .parent()
      .find("span")
      .each(function () {
        result.push($(this).html());
      });
    const firstName = result[0];
    deleteUser(firstName);
  });

  $(".editUserButton").on("click", function () {
    let result = [];
    $(this)
      .parent()
      .find("span")
      .each(function () {
        result.push($(this).html());
      });
    const firstName = result[0];
    const lastName = result[1];
    const email = result[4];

    const firstNameDom = $("#editUserModal").find("#editFirstName");
    const lastNameDom = $("#editUserModal").find("#editLastName");
    const emailDom = $("#editUserModal").find("#editEmail");

    // set values to current values
    firstNameDom.attr("value", firstName);
    lastNameDom.attr("value", lastName);
    emailDom.attr("value", email);

    $(".editUser").submit(() => {
      const newFirstName = firstNameDom.val();
      const newLastName = lastNameDom.val();
      const newEmail = emailDom.val();

      editUser(firstName, lastName, email, newFirstName, newLastName, newEmail);

      $("#editFirstName")
        .addClass("is-valid")
        .after(
          `<div class='feedback valid-feedback'>First name updated successfully!</div>`
        );

      $("#editLastName")
        .addClass("is-valid")
        .after(
          `<div class='feedback valid-feedback'>Last name updated successfully!</div>`
        );

      $("#editEmail")
        .addClass("is-valid")
        .after(
          `<div class='feedback valid-feedback'>Email updated successfully!</div>`
        );
    });
  });
};
