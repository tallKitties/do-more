$(function() {

  function $addElement (tag) {
    return $(document.createElement(tag))
  }

  function $buildTask (task) {
    let $element = $addElement('div').addClass('view').append(
      $addElement('label').text(task.title).prepend(
        $addElement('input').attr({
          class: 'toggle',
          type: 'checkbox',
          'data-id': task.id
        }).prop('checked', task.done)
      )
    );
    return $element;
  }

  function changeCompletedClass (task, $el) {
    if (task.done) {
      $el.addClass('completed');
    }else if ($el.hasClass('completed')) {
      $el.removeClass('completed');
    }
  }

  function taskHtml(task){
    var $liElement = $addElement('li').attr({
      id: 'listItem-' + task.id
    });
    changeCompletedClass(task, $liElement);
    $liElement.append($buildTask(task));

    return $liElement;
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
      var $li = $("#listItem-" + data.id);
      changeCompletedClass(data, $li);
      $('.toggle').change(toggleTask);
    });
  }

  function addItemToUl (htmlString) {
    var ulTodos = $('.todo-list');
    ulTodos.append(htmlString);
    $('.toggle').change(toggleTask);
  }

// -------

  $.get('/tasks').success(function(data) {
    $.each(data, function(index,  task) {
      addItemToUl(taskHtml(task));
    });
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
