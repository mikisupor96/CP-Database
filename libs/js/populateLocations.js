const populateLocations = () => {
  $.ajax({
    url: "./libs/php/getAllLocations.php",
    type: `GET`,
    dataType: `json`,
    success: (result) => {
      result["data"].forEach((el) => {
        $("#locationOfDepartment").append(
          $("<option />").val(el["id"]).text(el["name"])
        );
      });
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default populateLocations;
