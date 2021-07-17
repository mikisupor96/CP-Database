const getPersonnel = (id) => {
  $.ajax({
    url: "./libs/php/getPersonnel.php",
    type: `GET`,
    dataType: `json`,
    data: {
      id: id,
    },
    success: (result) => {
      console.log(result);
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default getPersonnel;
