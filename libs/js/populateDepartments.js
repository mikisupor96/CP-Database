const populateDepartments = () => {
  $.ajax({
    url: "./libs/php/getAllDepartments.php",
    type: `GET`,
    dataType: `json`,
    success: (result) => {
      result["data"].forEach((el) => {
        $(".department-select").append(
          $("<option />").text(el["name"]).val(el["id"])
        );
      });
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default populateDepartments;
