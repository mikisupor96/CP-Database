const deleteDepartment = (department, uiElement) => {
  console.log(department);
  $.ajax({
    url: "./libs/php/deleteDepartment.php",
    type: `GET`,
    dataType: `json`,
    data: {
      department: department,
    },
    success: (result) => {
      if (result["data"]) {
        $(".delete").prepend(`
        <div class="alert alert-success" role="alert">
          Department deleted!
        </div>
      `);
        uiElement.parent().parent().remove();
      } else {
        $(".delete").prepend(`
        <div class="alert alert-danger" role="alert">
          Please remove users from current department!
        </div>
      `);
      }
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default deleteDepartment;
