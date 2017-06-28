$(document).ready(function () {
    $('.borrar-articulo').on('click', function (e) {
        $target = $(e.target);
        console.log($target.attr('data-id'));
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articulos/' + id,
            success: function (response) {
                alert('Deleting Article');
                window.location.href = '/';
            },
            error: function (error) {
                console.log(error)
            }
        });
    });
});