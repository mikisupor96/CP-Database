import getAll from "./libs/js/getAll.js";
import getPersonnel from "./libs/js/getPersonnel.js";
import getAllDepartments from "./libs/js/getAllDepartments.js";
import getDepartment from "./libs/js/getDepartment.js";
import getAllLocations from "./libs/js/getAllLocations.js";
import getLocation from "./libs/js/getLocation.js";
import addNewUser from "./libs/js/addNewUser.js";
import addNewDepartment from "./libs/js/addNewDepartment.js";
import addNewLocation from "./libs/js/addNewLocation.js";
import populateLocations from "./libs/js/populateLocations.js";
import populateDepartments from "./libs/js/populateDepartments.js";
import errorResult from "./libs/js/Dom/errorResult.js";

$(document).ready(() => {
  $("form").submit(() => {
    return false;
  });

  populateDepartments();

  getAll();
});

$(".createUser").submit(function () {
  const firstName = $("#firstName").val();
  const lastName = $("#lastName").val();
  const email = $("#email").val();
  const department = $(".department-select").val();

  addNewUser(firstName, lastName, email, department);
});

$(".createDepartment").submit(function () {
  const department = $("#departmentName").val();
  const location = $("#locationOfDepartment").val();

  addNewDepartment(department, location);
});

$(".createLocation").submit(function () {
  const location = $("#locationName").val();

  addNewLocation(location);
});

$("#searchButton").click(() => {
  const select = $("#searchOption").val();
  const value = $("#searchBox").val();
  const result = $(".result");

  $("#searchOption").change(() => {
    result.empty();
  });

  result.empty();

  $("#searchBox").val("");

  if (select === "personnel") {
    value !== "" ? getPersonnel(value) : getAll();
  } else if (select === "departments") {
    value !== "" ? getDepartment(value) : getAllDepartments();
  } else if (select === "locations") {
    value !== "" ? getLocation(value) : getAllLocations();
  } else {
    errorResult("Please select a search parameter!");
  }
});

$("#searchOption").change(function () {
  const select = $(this).val();
  if (select === "personnel") {
    populateDepartments();
    $("#addButton").attr("data-target", "#addUserModal");
    $(".result").empty();
    getAll();
  } else if (select === "departments") {
    populateLocations();
    $("#addButton").attr("data-target", "#addDepartmentModal");
    $(".result").empty();
    getAllDepartments();
  } else if (select === "locations") {
    $("#addButton").attr("data-target", "#addLocationModal");
    $(".result").empty();
    getAllLocations();
  }
});
