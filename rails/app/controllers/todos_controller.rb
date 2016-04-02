class TodosController < ApplicationController
  respond_to :json

  before_filter :find_todo, :only => [:show]

  def index
      @todos = Todo.all
      respond_with(@todos)
  end

  def new
    @todo = Todo.new
  end

  def create
    @todo = Todo.create(todo_params)
    if @todo.save
      respond_with(@todo)
    else
      respond_with(nil, @message = "Error while creating Todo")
    end
  end

  def show
    respond_with(@todo)
  end

  def destroy
    @todo = Todo.find(params[:id])
    if @todo.update(checked: true)
        respond_with(@todo)
    else
        respond_with(nil, @message = "Todo Update Failed")
    end
  end

  private
  def todo_params
    params.require(:todo).permit(
        :item,
        :checked,
        :description
    )
  end

  private
  def find_todo
    print("hello workccdccccd")
    print(params[:id])
    @todo = Todo.find(params[:id])
  end

end
