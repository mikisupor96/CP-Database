import editLoc from "./editLoc.js";
import deleteLocation from "./deleteLocation.js";

const getLocation = (value) => {
  $.ajax({
    url: "./libs/php/getLocation.php",
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
                <button class="btn btn-danger btn-sm float-right removeLoc " data-toggle="modal" data-target="#deleteModal">-</button>
                <button class="btn btn-success btn-sm float-right editLocButton mr-1 "data-toggle="modal" data-target="#editLocModal">...</button>
            </div>
            </div>
      `);
        });

        //*Edit Location
        $(".editLocButton").click(function (event) {
          $(".alert").remove();
          let result = [];
          $(this)
            .parent()
            .find("p")
            .each(function () {
              result.push($(this).html());
            });
          const location = result[0];

          const locationDom = $("#editLocModal").find("#editLocationName");

          locationDom.val(location);

          $(".editLoc").submit(() => {
            const newLocation = locationDom.val();
            editLoc(location, newLocation);
          });
        });

        //*Remove Location
        $(".removeLoc").on("click", function () {
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

              const location = result[0];

              deleteLocation(location, $(this));
            });
        });
      } else {
        $(".result").html(`
        <div class="alert alert-danger" role="alert">
          Could not find any location named "${value}", please make sure you write the value in full.
        </div>
      `);
      }
    },

    error: (xhr) => {
      reject(xhr);
    },
  });
};

export default getLocation;
