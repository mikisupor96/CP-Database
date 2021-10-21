import editUser from "./editUser.js";
import deleteUser from "./deleteUser.js";

const getAll = () => {
  $.ajax({
    url: "./libs/php/getAll.php",
    type: `GET`,
    dataType: `json`,
    success: (result) => {
      result["data"].forEach((el) => {
        $(".result").append(`
        <div class="card">
          <div class="card-body ">
            <h5 class="card-title"><span>${el["firstName"]}</span> <span>${el["lastName"]}</span></h5>
            <p class="card-text"><span>${el["location"]}</span></p>
            <p class="card-text"><span >${el["department"]}</span> <span class="d-none">${el["departmentID"]}</span></p>
            <p class="card-text d-inline-flex"><span >${el["email"]}</span></p>
            <button class="btn btn-danger btn-sm float-right removeUser " data-toggle="modal" data-target="#deleteModal">-</button>
            <button class="btn btn-success btn-sm float-right editUserButton mr-1 " data-toggle="modal" data-target="#editUserModal">...</button>
          </div>
        </div>
      `);
      });

      //*Edit User
      $(".editUserButton").click(function (event) {
        $(".alert").remove();
        let result = [];
        $(this)
          .parent()
          .find("span")
          .each(function () {
            result.push($(this).html());
          });

        const firstName = result[0];
        const lastName = result[1];
        const email = result[5];
        const department = result[4];

        const firstNameDom = $("#editUserModal").find("#editFirstName");
        const lastNameDom = $("#editUserModal").find("#editLastName");
        const emailDom = $("#editUserModal").find("#editEmail");
        const departmentDom = $("#editUserModal").find(".department-select");

        firstNameDom.val(firstName);
        lastNameDom.val(lastName);
        emailDom.val(email);
        departmentDom.val(department);

        $(".editUser").submit(() => {
          const newFirstName = firstNameDom.val();
          const newLastName = lastNameDom.val();
          const newEmail = emailDom.val();
          const newDepartment = departmentDom.val();

          editUser(
            firstName,
            lastName,
            email,
            newFirstName,
            newLastName,
            newEmail,
            newDepartment
          );
        });
      });

      //*Remove User
      $(".removeUser").on("click", function () {
        $(".alert").remove();
        $(".yesDelete")
          .unbind()
          .click(() => {
            $(this).parent().parent().remove();
            let result = [];
            $(this)
              .parent()
              .find("span")
              .each(function () {
                result.push($(this).html());
              });
            const firstName = result[0];
            const lastName = result[1];
            const email = result[5];

            deleteUser(firstName, lastName, email);
          });
      });
    },

    error: (xhr) => {
      console.log(xhr);
    },
  });
};

export default getAll;
