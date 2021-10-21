const editDep = (department, newDepartment) => {
  $.ajax({
    url: "./libs/php/editDep.php",
    type: `GET`,
    dataType: `json`,
    data: {
      department: department,
      newDepartment: newDepartment,
    },
    success: (result) => {
      $(".alert").remove();

      if (result["data"]) {
        $(".editDep").prepend(`
            <div class="alert alert-success" role="alert">
              Department Edited Successfully.
            </div>
          `);
      } else {
        $(".editDep").prepend(`
          <div class="alert alert-danger" role="alert">
            Something went wrong, please check your details.
          </div>
        `);
      }
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default editDep;
