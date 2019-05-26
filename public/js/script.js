$(document).ready(function(e){

    $('.delete-article').on('click',function(){

        const id = $(this).attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/article/delete/'+id,
            success:function(res){
                alert('Deleting Article');
                window.location.href = '/';
            },
            error:function () { 
                console.log(err);
            }
        });

    });
});