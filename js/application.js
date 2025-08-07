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
                window.location.reload();
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }  
        })
    })
    $('#remove-to-do-item').on('click', function(){
        var id = this.dataset.id
        console.log(id)


    })
})
var loadToDoItems = function() {
    $.ajax({
        type: 'GET',
        url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=6',
        dataType: 'json',
        success: function (response, textStatus) {
        var toDoItem = document.querySelector('#list-items')
        var sortedTasks = response.tasks.sort((a,b) => a.id - b.id)
        sortedTasks.forEach(task => {
                if (task.completed) {
                    var toggleTextContent = 'Mark Active'
                }
                else {
                    var toggleTextContent = 'Mark Complete'
                }
            $(toDoItem).append('<li class="list-group-item">' + task.content +
                '<button type="button" data-id="remove-' + task.id + '" id="remove-to-do-item" class="btn-item btn-outline-primary" style="float: right;">Remove</button>' +
                '<button type="button" data-id="toggle-' + task.id + '" id="mark-to-do-item" class="btn-item btn-outline-primary" style="float: right;">' + toggleTextContent + '</button>' +
                '</li>'
            )
            var removeButton = document.querySelector(`[data-id="remove-${task.id}"]`)
            var toggleButton = document.querySelector(`[data-id="toggle-${task.id}"]`)
            addRemoveEventListener(removeButton, task.id)
            addToggleEventListener(toggleButton, task)
        });
    },
        error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
        }
    })
}
var addRemoveEventListener = function(element,id) {
     element.addEventListener('click', () => {
        deleteTodo(id)
      });
}
var addToggleEventListener = function(element, task) {
    element.addEventListener('click', () => {
        toggleToDoStatus(task)
      });
}

var deleteTodo = function(id) {
    $.ajax({
        type: 'DELETE',
        url: `https://fewd-todolist-api.onrender.com/tasks/${id}?api_key=6`,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response, textStatus) {
             window.location.reload();
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
                window.location.reload();
            },
            error: function (request, textStatus, errorMessage) {
                console.log(errorMessage);
            }  
        })
}