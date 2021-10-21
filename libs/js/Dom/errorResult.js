const errorResult = (message) => {
  $(".result").html(`
    <div class="alert alert-danger" role="alert">
      ${message}
    </div>
    `);
};

export default errorResult;
