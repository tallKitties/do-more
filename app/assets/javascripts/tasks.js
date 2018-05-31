$(function() {

  function taskHtml(task){
    var checkedStatus = task.done ? "checked" : '';
    var liClass = task.done ? "completed" : '';
    var liElement = '<li id="listItem-' + task.id +
      '" class="' + liClass + '">' +
      '<div class="view"><input class="toggle" type="checkbox"' +
      ' data-id="' + task.id + '"' +
      checkedStatus +
      '><label>' +
      task.title +
      '</label></div></li>';
    return liElement;
  }

  function toggleTask (e) {
    var item = $(e.target);
    var itemId = item.data("id");
    var doneValue = Boolean(item.is(':checked'));

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });
  }

  function addItemToUl (htmlString) {
    var ulTodos = $('.todo-list');
    ulTodos.append(htmlString);
    $('.toggle').change(toggleTask);
  }



  $.get('/tasks').success(function(data) {
    var htmlString = "";

    $.each(data, function(index,  task) {
      htmlString += taskHtml(task);
    });

    addItemToUl(htmlString);
  });

  $('#new-form').submit(function(event) {
    event.preventDefault();
    var newItem = $('.new-todo');
    var payload = {
      task: {
        title: newItem.val()
      }
    };

    $.post('/tasks', payload).success(function(data){
      var htmlString = taskHtml(data);
      addItemToUl(htmlString);
      $('.new-todo').val('');
    });
  });
});
