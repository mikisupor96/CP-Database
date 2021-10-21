const addNewDepartment = (department, locationID) => {
  $.ajax({
    url: "./libs/php/addNewDepartment.php",
    type: `GET`,
    dataType: `json`,
    data: {
      department: department,
      locationID: locationID,
    },
    success: (result) => {
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
    },
    error: (xhr) => {
      console.log(xhr);
    },
  });
};

export default addNewDepartment;
