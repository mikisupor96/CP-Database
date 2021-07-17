const searchByDepartment = (department) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/searchByDepartment.php",
      type: `GET`,
      dataType: `json`,
      data: {
        departmentName: department,
      },
      success: (result) => {
        resolve(result["data"]);
      },

      error: (xhr) => {
        reject(xhr);
        console.log(xhr["responseText"]);
      },
    });
  });
};
export default searchByDepartment;
