$(document).ready(function(){
    loadToDoItems()
    $('#add-to-do-item').on('click', function(){
        var itemText = $('#item-text').val()
        $.ajax({
            type: 'POST',
            url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=6',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                task: {
                content: itemText
                }
            }),
            success: function (response, textStatus) {
                $("input").val('')
                var toDoItem = document.querySelector('#list-items')
                var toggleTextContent = 'Mark complete'
                $(toDoItem).append('<li class="list-group-item" id="to-do-item-' +  response.task.id +'">' + response.task.content +
                    '<button type="button" data-id="remove-' + response.task.id + '" id="remove-to-do-item" class="btn-item btn-outline-primary" style="float: right;">Remove</button>' +
                    '<button type="button" data-id="toggle-' + response.task.id + '" class="btn-item btn-outline-primary mark-to-do-item" style="float: right;">' + toggleTextContent + '</button>' +
                    '</li>'
                )
                var newToggleStatusButton = document.querySelector(`[data-id="toggle-${response.task.id}"]`)
                newToggleStatusButton.addEventListener('click', function() {
                    $.ajax({
                        type: 'GET',
                        url: `https://fewd-todolist-api.onrender.com/tasks/${response.task.id}?api_key=6`,
                        dataType: 'json',
                               success: function(response) {
                                toggleToDoStatus(response.task);
                            }
                    })
                })
                var newRemoveButton = document.querySelector(`[data-id="remove-${response.task.id}"]`)
                newRemoveButton.addEventListener('click', function(){
                    $.ajax({
                        type: 'GET',
                        url: `https://fewd-todolist-api.onrender.com/tasks/${response.task.id}?api_key=6`,
                        dataType: 'json',
                               success: function(response) {
                                deleteTodo(response.task.id);
                            }
                    })
                })
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }  
        })
    })
})
var toggledButtonName = function(task) {
    if (task.completed) {
       return 'Mark active'
    }
    else {
        return 'Mark complete'
    } 
}
var loadToDoItems = function() {
    $.ajax({
        type: 'GET',
        url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=6',
        dataType: 'json',
        success: function (response, textStatus) {
            $("input").val('')
            var toDoItem = document.querySelector('#list-items')
            var sortedTasks = response.tasks.sort((a,b) => a.id - b.id)
            sortedTasks.forEach(task => {
                $(toDoItem).append('<li class="list-group-item" id="to-do-item-' +  task.id +'">' + task.content +
                    '<button type="button" data-id="remove-' + task.id + '" class="btn-item btn-outline-primary" style="float: right;">Remove</button>' +
                    '<button type="button" data-id="toggle-' + task.id + '" class="btn-item btn-outline-primary mark-to-do-item" style="float: right;">' + toggledButtonName(task) + '</button>' +
                    '</li>'
                )
        });
    },
        error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
        }
    })
}

var deleteTodo = function(id) {
    $.ajax({
        type: 'DELETE',
        url: `https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=6`,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response, textStatus) {
            var itemToBeRemoved = document.querySelector(`#to-do-item-${id}`)
            $(itemToBeRemoved).remove()
        },
        error: function (request, textStatus, errorMessage) {
            console.log(errorMessage);
        }  
    })
}

var toggleToDoStatus = function(task) {
    var newStatus = task.completed ? false : true
    var apiRouteStatusString = task.completed ? 'active' : 'complete'
        $.ajax({
            type: 'PUT',
            url: `https://fewd-todolist-api.onrender.com/tasks/${task.id}/mark_${apiRouteStatusString}?api_key=6`,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                task: {
                    id: task.id,
                    content: task.content,
                    completed: newStatus,
                    due: task.due,
                    created_at: task.created_at,
                    updated_at: task.updated_at
                }
            }),
            success: function (response, textStatus) {
                if (response.task.completed) {
                    $(`[data-id="toggle-${task.id}"]`).html('Mark active')
                }
                else {
                    $(`[data-id="toggle-${task.id}"]`).html('Mark complete')
                }
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }  
        })
}