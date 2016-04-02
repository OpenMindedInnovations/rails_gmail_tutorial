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
      require 'slack-notifier'
      # respond with a success notification and the user project object
      notifier = Slack::Notifier.new "https://hooks.slack.com/services/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"
      notifier.ping "Todo Added:"+@todo.item, icon_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6t41ErQxx0y1rApv207bM3LznQVdvOILrYy-XTUVg3JpxGvRn"
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
        require 'slack-notifier'
        # respond with a success notification and the user project object
        notifier = Slack::Notifier.new "https://hooks.slack.com/services/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"
        notifier.ping "Todo Completed:"+@todo.item, icon_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR6t41ErQxx0y1rApv207bM3LznQVdvOILrYy-XTUVg3JpxGvRn"
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
