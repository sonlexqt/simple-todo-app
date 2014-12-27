//$("#sortable").sortable();
//$("#sortable").disableSelection();
//
//countTodos();
//
//// all done btn
//$("#checkAll").click(function(){
//    AllDone();
//});
//
////create todo
//$('.add-todo').on('keypress',function (e) {
//    e.preventDefault
//    if (e.which == 13) {
//        if($(this).val() != ''){
//            var todo = $(this).val();
//            createTodo(todo);
//            countTodos();
//        }else{
//            // some validation
//        }
//    }
//});
//// mark task as done
//$('.todolist').on('change','#sortable li input[type="checkbox"]',function(){
//    if($(this).prop('checked')){
//        var doneItem = $(this).parent().parent().find('label').text();
//        $(this).parent().parent().parent().addClass('remove');
//        done(doneItem);
//        countTodos();
//    }
//});
//
////delete done task from "already done"
//$('.todolist').on('click','.remove-item',function(){
//    removeItem(this);
//});
//
//// count tasks
//function countTodos(){
//    var count = $("#sortable li").length;
//    $('.count-todos').html(count);
//}
//
////create task
//function createTodo(text){
//    var markup = '<li class="ui-state-default"><div class="checkbox"><label><input type="checkbox" value="" />'+ text +'</label></div></li>';
//    $('#sortable').append(markup);
//    $('.add-todo').val('');
//}
//
////mark task as done
//function done(doneItem){
//    var done = doneItem;
//    var markup = '<li>'+ done +'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
//    $('#done-items').append(markup);
//    $('.remove').remove();
//}
//
////mark all tasks as done
//function AllDone(){
//    var myArray = [];
//
//    $('#sortable li').each( function() {
//        myArray.push($(this).text());
//    });
//
//    // add to done
//    for (i = 0; i < myArray.length; i++) {
//        $('#done-items').append('<li>' + myArray[i] + '<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>');
//    }
//
//    // myArray
//    $('#sortable li').remove();
//    countTodos();
//}
//
////remove done task from list
//function removeItem(element){
//    $(element).parent().remove();
//}

var APP_URL = 'https://onlinenotes.firebaseio.com/todos';

var myApp = angular.module('todoApp', ['firebase']);
myApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
myApp.controller('mainController', function($scope, $firebase) {
    // connect to firebase
    var ref = new Firebase(APP_URL);
    var fb = $firebase(ref);
    $scope.todos = [];
    // sync as array
    var syncObject = fb.$asArray();
    // 3-way data binding
    $scope.todos = syncObject;
    $scope.addNewTodo = function(){
        var todoTitle = $('.add-todo').val();
        var element = {
            title: todoTitle,
            createdAt: Firebase.ServerValue.TIMESTAMP,
            modifiedAt: Firebase.ServerValue.TIMESTAMP,
            done: false
        };
        $scope.todos.$add(element);
        $('.add-todo').val("");
    };
    $scope.markAsDone = function($event){
        var todoTitle = $($event.target.parentElement).find("span").html();
        console.log(todoTitle);
        var result = $.grep($scope.todos, function(e){ return e.title === todoTitle; });
        var itemRef = new Firebase(APP_URL + '/' + result[0].$id);
        itemRef.update({
            done: true,
            modifiedAt: Firebase.ServerValue.TIMESTAMP
        });
    };
    $scope.markAllAsDone = function(){
        $.each($scope.todos, function(i, val){
            if (val.done === false){
                var itemRef =  new Firebase(APP_URL + '/' + val.$id);
                itemRef.update({
                    done: true,
                    modifiedAt: Firebase.ServerValue.TIMESTAMP
                });
            }
        });
    };
    $scope.deleteTodo = function($event){
        var todoTitle = $($event.target.parentElement).find(".todo-title").html();
        console.log(todoTitle);
        var result = $.grep($scope.todos, function(e){ return e.title === todoTitle; });
        var itemRef = new Firebase(APP_URL + '/' + result[0].$id);
        itemRef.remove();
    };
});