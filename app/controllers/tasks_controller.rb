class TasksController < ApplicationController
  def index
    render json: Task.order(:id)
  end

  def update
    task = Task.find_by_id(params[:id])
    task.update_attributes(task_params)
    render json: task
  end

  private

  def task_params
    params.require(:task).permit(:done)
  end
end
