import editDep from "./editDep.js";
import deleteDepartment from "./deleteDepartment.js";

const getDepartment = (value) => {
  $.ajax({
    url: "./libs/php/getDepartment.php",
    type: `GET`,
    dataType: `json`,
    data: {
      value: value,
    },
    success: (result) => {
      if (result["data"]) {
        result["data"].forEach((el) => {
          $(".result").append(`
            <div class="card">
            <div class="card-body ">
                <p class="card-text">${el["name"]}</p>
                <button class="btn btn-danger btn-sm float-right removeDep " data-toggle="modal" data-target="#deleteModal">-</button>
                <button class="btn btn-success btn-sm float-right editDepButton mr-1 " data-toggle="modal" data-target="#editDepModal">...</button>
            </div>
            </div>
      `);
        });

        //*Edit Department
        $(".editDepButton").click(function (event) {
          $(".alert").remove();
          let result = [];
          $(this)
            .parent()
            .find("p")
            .each(function () {
              result.push($(this).html());
            });
          const department = result[0];

          const departmentDom = $("#editDepModal").find("#editDepartmentName");

          departmentDom.val(department);

          $(".editDep").submit(() => {
            const newDepartment = departmentDom.val();
            editDep(department, newDepartment);
          });
        });

        //*Remove Department
        $(".removeDep").on("click", function () {
          $(".alert").remove();
          $(".yesDelete")
            .unbind()
            .click(() => {
              let result = [];
              $(this)
                .parent()
                .find("p")
                .each(function () {
                  result.push($(this).html());
                });

              const department = result[0];

              deleteDepartment(department, $(this));
            });
        });
      } else {
        $(".result").html(`
        <div class="alert alert-danger" role="alert">
          Could not find any department named "${value}", please make sure you write the value in full.
        </div>
      `);
      }
    },

    error: (xhr) => {
      reject(xhr);
    },
  });
};

export default getDepartment;
